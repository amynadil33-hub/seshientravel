'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getServiceDb } from '@/lib/dbs'
import { computeQuote } from '@/lib/booking/load'
import { generateReference } from '@/lib/booking/engine'
import type { Booking, EnquiryKind } from '@/lib/types'

export type FormState = {
  ok?: boolean
  message?: string
  fieldErrors?: Record<string, string>
}

const hits = new Map<string, number[]>()
async function throttled(bucket: string, limit = 8, windowMs = 10 * 60_000) {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > limit
}

const text = (max: number) => z.string().trim().max(max)
const fieldErrors = (error: z.ZodError) =>
  Object.fromEntries(error.issues.map((i) => [String(i.path[0]), i.message]))

const bookingSchema = z.object({
  roomId: z.string().uuid('Invalid room.'),
  checkIn: z.string(),
  checkOut: z.string(),
  adults: z.coerce.number().int(),
  children: z.coerce.number().int(),
  rooms: z.coerce.number().int(),
  guest_name: text(120).min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.').max(200),
  phone: text(40).min(6, 'Please enter a phone or WhatsApp number.'),
  country: text(80).optional(),
  arrival_notes: text(1500).optional(),
  terms: z.literal('on', { error: 'Please accept the booking terms to continue.' }),
  expectedTotal: z.coerce.number(),
})

export async function submitBookingRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get('website')) return { ok: false, message: 'Something went wrong. Please try again.' }
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors: fieldErrors(parsed.error) }
  }
  if (await throttled('booking', 5)) {
    return { ok: false, message: 'Too many requests from this connection. Please wait a few minutes or contact us directly.' }
  }
  const d = parsed.data
  const result = await computeQuote(d.roomId, {
    checkIn: d.checkIn,
    checkOut: d.checkOut,
    adults: d.adults,
    children: d.children,
    units: d.rooms,
  })
  if (!result.ok) return { ok: false, message: result.error }
  if (result.availability && result.availability.unavailableNights.length > 0) {
    return { ok: false, message: 'Some of these nights are no longer available. Please choose different dates or contact us.' }
  }

  if (Math.abs(result.breakdown.total - d.expectedTotal) > 0.009) {
    return {
      ok: false,
      message: 'Rates for these dates have just changed. Please review the updated price below and submit again.',
    }
  }

  const db = getServiceDb()
  if (!db) {
    return { ok: false, message: 'Online booking requests are temporarily unavailable. Please contact us directly.' }
  }

  let reference = ''
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      reference = generateReference()
      const taken = await db.findOne<Booking>('bookings', { reference })
      if (!taken) break
    }
    await db.insert('bookings', {
      reference,
      guesthouse_id: result.ctx.guesthouse.id,
      room_type_id: result.ctx.room.id,
      check_in: d.checkIn,
      check_out: d.checkOut,
      adults: d.adults,
      children: d.children,
      units: d.rooms,
      guest_name: d.guest_name,
      email: d.email.toLowerCase(),
      phone: d.phone,
      country: d.country || null,
      arrival_notes: d.arrival_notes || null,
      price_breakdown: result.breakdown,
      total: result.breakdown.total,
      currency: result.breakdown.currency,
      status: 'pending',
      payment_status: 'unpaid',
      admin_notes: null,
      cancellation_reason: null,
      decided_at: null,
    })
  } catch (error) {
    console.error('[Sea Shine] Booking insert failed:', (error as Error).message)
    return { ok: false, message: 'We could not save your request. Please try again or contact us directly.' }
  }
  redirect(`/book/confirmation/${reference}`)
}

const enquirySchema = z.object({
  kind: z.enum(['surf', 'activity', 'restaurant', 'contact', 'guesthouse']),
  subject_id: z.string().uuid().optional().or(z.literal('')),
  subject_title: text(200).optional(),
  name: text(120).min(2, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.').max(200),
  phone: text(40).optional(),
  preferred_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid date.')
    .optional()
    .or(z.literal('')),
  party_size: z.coerce.number().int().min(1, 'At least 1 person.').max(100, 'For groups over 100, please mention it in your message.').optional(),
  message: text(3000).min(5, 'Please add a short message.'),
})

export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get('website')) return { ok: true, message: 'Thanks — your enquiry has been sent.' }
  const raw = Object.fromEntries(formData)
  if (raw.party_size === '') delete raw.party_size
  const parsed = enquirySchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors: fieldErrors(parsed.error) }
  }
  if (parsed.data.preferred_date && parsed.data.preferred_date < new Date().toISOString().slice(0, 10)) {
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors: { preferred_date: 'Please choose a future date.' } }
  }
  if (await throttled('enquiry', 6)) {
    return { ok: false, message: 'Too many messages from this connection. Please wait a few minutes or contact us directly.' }
  }
  const db = getServiceDb()
  if (!db) return { ok: false, message: 'Enquiries are temporarily unavailable. Please email or call us directly.' }
  const d = parsed.data
  try {
    await db.insert('enquiries', {
      kind: d.kind as EnquiryKind,
      subject_id: d.subject_id || null,
      subject_title: d.subject_title || null,
      name: d.name,
      email: d.email.toLowerCase(),
      phone: d.phone || null,
      preferred_date: d.preferred_date || null,
      party_size: d.party_size ?? null,
      message: d.message,
      status: 'new',
    })
  } catch (error) {
    console.error('[Sea Shine] Enquiry insert failed:', (error as Error).message)
    return { ok: false, message: 'We could not send your enquiry. Please try again or contact us directly.' }
  }
  return { ok: true, message: 'Thanks — your enquiry has been sent. Our team on Huraa will reply by email, usually within 24 hours.' }
}

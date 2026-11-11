'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { COLLECTION_MAP, type AdminField } from '@/lib/admin/collections'
import { PAGE_DEFS } from '@/lib/content-defs'
import { getAdminSession, requireAdminAction } from '@/lib/auth'
import { availability, isValidIso } from '@/lib/booking/engine'
import { getAdminDb } from '@/lib/dbs'
import { DEMO_MODE } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'
import type {
  Booking,
  BookingStatus,
  ContentBlock,
  DateBlock,
  EnquiryStatus,
  GalleryItem,
  Media,
  PaymentStatus,
  RoomType,
} from '@/lib/types'

export type ActionState = { error?: string; ok?: string } | null

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const isId = (v: unknown): v is string => typeof v === 'string' && (UUID.test(v) || /^demo-[\w-]+$/.test(v))

function refreshSite() {
  revalidatePath('/', 'layout')
}

function str(form: FormData, key: string, max = 5000) {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function parseField(field: AdminField, form: FormData): { value: unknown; error?: string } {
  const raw = str(form, field.key, field.type === 'textarea' ? 20000 : 2000)
  const empty = raw === ''
  const need = () => ({ value: null, error: `${field.label} is required.` })

  switch (field.type) {
    case 'bool':
      return { value: form.get(field.key) === 'on' }
    case 'list':
      return { value: raw.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 50) }
    case 'int': {
      if (empty) return field.required ? need() : { value: null }
      const n = Number(raw)
      if (!Number.isInteger(n)) return { value: null, error: `${field.label} must be a whole number.` }
      if ((field.min !== undefined && n < field.min) || (field.max !== undefined && n > field.max))
        return { value: null, error: `${field.label} must be between ${field.min ?? 0} and ${field.max}.` }
      return { value: n }
    }
    case 'money': {
      if (empty) return field.required ? need() : { value: null }
      const n = Number(raw)
      if (!Number.isFinite(n) || n < 0 || n > 1_000_000) return { value: null, error: `${field.label} must be a positive number.` }
      return { value: Math.round(n * 100) / 100 }
    }
    case 'date':
      if (empty) return field.required ? need() : { value: null }
      return isValidIso(raw) ? { value: raw } : { value: null, error: `${field.label} is not a valid date.` }
    case 'select':
      if (empty) return field.required ? need() : { value: null }
      return field.options?.some((o) => o.value === raw)
        ? { value: raw }
        : { value: null, error: `${field.label} has an invalid value.` }
    case 'media':
    case 'relation':
      if (empty) return field.required ? need() : { value: null }
      return isId(raw) ? { value: raw } : { value: null, error: `${field.label} is invalid.` }
    case 'slug': {
      const slug = raw.toLowerCase()
      if (!slug) return need()
      return SLUG.test(slug) ? { value: slug } : { value: null, error: 'URL slug may only use lowercase letters, numbers and dashes.' }
    }
    default:
      if (empty) return field.required ? need() : { value: null }
      return { value: raw }
  }
}

function friendly(error: unknown) {
  const msg = (error as Error)?.message ?? 'Something went wrong.'
  if (/duplicate key|unique/i.test(msg)) return 'That URL slug is already in use. Choose another.'
  if (/foreign key/i.test(msg)) return 'This item is still referenced by other records (e.g. rooms or bookings). Remove those first.'
  if (/row-level security|not authori[sz]ed|permission/i.test(msg)) return 'You do not have permission to do that.'
  console.error('[admin] action failed:', msg)
  return 'Could not save. Please try again.'
}

export async function saveRecord(collectionKey: string, id: string | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdminAction()
  const collection = COLLECTION_MAP[collectionKey]
  if (!collection) return { error: 'Unknown collection.' }
  if (id !== null && !isId(id)) return { error: 'Invalid record.' }

  const row: Record<string, unknown> = {}
  for (const field of collection.fields) {
    const { value, error } = parseField(field, form)
    if (error) return { error }
    row[field.key] = value
  }
  if ('start_date' in row && 'end_date' in row && String(row.end_date) < String(row.start_date))
    return { error: 'The last night must be on or after the first night.' }
  if (collection.table === 'room_types') {
    const r = row as Partial<RoomType>
    if ((r.max_occupancy ?? 0) < 1 || (r.max_adults ?? 0) > (r.max_occupancy ?? 0))
      return { error: 'Max total guests must be at least the max adults.' }
  }

  let savedId = id
  try {
    const db = await getAdminDb()
    if (id) {
      await db.update(collection.table, id, row)
    } else {
      const created = await db.insert<{ id: string }>(collection.table, { ...collection.defaults, ...row })
      savedId = created.id
    }
  } catch (error) {
    return { error: friendly(error) }
  }
  refreshSite()
  redirect(`/admin/c/${collection.key}/${savedId}?saved=1`)
}

export async function deleteRecord(collectionKey: string, id: string) {
  await requireAdminAction()
  const collection = COLLECTION_MAP[collectionKey]
  if (!collection || !isId(id)) throw new Error('Invalid request')
  const db = await getAdminDb()
  try {
    await db.remove(collection.table, id)
  } catch (error) {
    redirect(`/admin/c/${collection.key}/${id}?error=${encodeURIComponent(friendly(error))}`)
  }
  refreshSite()
  redirect(`/admin/c/${collection.key}?deleted=1`)
}

/* ---------- Bookings ---------- */

const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'declined', 'cancelled']
const PAYMENT_STATUSES: PaymentStatus[] = ['unpaid', 'deposit_paid', 'paid', 'refunded']

async function confirmInDemo(bookingId: string): Promise<string | null> {
  const db = await getAdminDb()
  const booking = await db.get<Booking>('bookings', bookingId)
  if (!booking) return 'Booking not found.'
  if (booking.status === 'confirmed') return null
  if (booking.status !== 'pending') return `A ${booking.status} booking cannot be confirmed.`
  const room = await db.get<RoomType>('room_types', booking.room_type_id)
  if (!room) return 'Room type no longer exists.'
  const [bookings, blocks] = await Promise.all([
    db.list<Booking>('bookings', { room_type_id: room.id }),
    db.list<DateBlock>('date_blocks', { room_type_id: room.id }),
  ])
  const avail = availability(room, bookings, blocks, booking.check_in, booking.check_out, booking.units, booking.id)
  if (avail.unavailableNights.length)
    return `Not enough rooms free on ${avail.unavailableNights.join(', ')}. Decline this request or free up inventory first.`
  await db.update('bookings', booking.id, { status: 'confirmed', updated_at: new Date().toISOString() })
  return null
}

export async function setBookingStatus(bookingId: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdminAction()
  if (!isId(bookingId)) return { error: 'Invalid booking.' }
  const next = str(form, 'status') as BookingStatus
  if (!BOOKING_STATUSES.includes(next)) return { error: 'Invalid status.' }
  const reason = str(form, 'reason', 1000) || null

  try {
    if (next === 'confirmed') {
      if (DEMO_MODE) {
        const problem = await confirmInDemo(bookingId)
        if (problem) return { error: problem }
      } else {
        // Row-locked, inventory-checked confirmation in Postgres so two admins can never overbook.
        const supabase = await createClient()
        const { error } = await supabase.rpc('confirm_booking', { p_booking_id: bookingId })
        if (error) return { error: error.message.startsWith('Not enough inventory') ? error.message : friendly(error) }
      }
    } else {
      const db = await getAdminDb()
      const booking = await db.get<Booking>('bookings', bookingId)
      if (!booking) return { error: 'Booking not found.' }
      if (next === 'pending' && booking.status !== 'pending') return { error: 'Bookings cannot be moved back to pending.' }
      await db.update('bookings', bookingId, {
        status: next,
        cancellation_reason: next === 'declined' || next === 'cancelled' ? reason : booking.cancellation_reason,
        updated_at: new Date().toISOString(),
      })
    }
  } catch (error) {
    return { error: friendly(error) }
  }
  revalidatePath('/admin', 'layout')
  return { ok: `Booking marked as ${next}.` }
}

export async function updateBookingDetails(bookingId: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdminAction()
  if (!isId(bookingId)) return { error: 'Invalid booking.' }
  const payment = str(form, 'payment_status') as PaymentStatus
  if (!PAYMENT_STATUSES.includes(payment)) return { error: 'Invalid payment status.' }
  try {
    const db = await getAdminDb()
    await db.update('bookings', bookingId, {
      payment_status: payment,
      admin_notes: str(form, 'admin_notes', 5000) || null,
      updated_at: new Date().toISOString(),
    })
  } catch (error) {
    return { error: friendly(error) }
  }
  revalidatePath('/admin', 'layout')
  return { ok: 'Saved.' }
}

/* ---------- Enquiries ---------- */

export async function setEnquiryStatus(enquiryId: string, form: FormData) {
  await requireAdminAction()
  const status = str(form, 'status') as EnquiryStatus
  if (!isId(enquiryId) || !['new', 'in_progress', 'closed'].includes(status)) throw new Error('Invalid request')
  const db = await getAdminDb()
  await db.update('enquiries', enquiryId, { status })
  revalidatePath('/admin', 'layout')
}

/* ---------- Page content & settings ---------- */

export async function savePageContent(page: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdminAction()
  const def = PAGE_DEFS.find((p) => p.page === page)
  if (!def) return { error: 'Unknown page.' }
  try {
    const db = await getAdminDb()
    const existing = await db.list<ContentBlock>('content_blocks', { page })
    for (const field of def.fields) {
      const isImage = field.type === 'image'
      const raw = str(form, field.key, 20000)
      if (isImage && raw && !isId(raw)) return { error: `${field.label} is invalid.` }
      const patch = isImage ? { media_id: raw || null, value: null } : { value: raw || null, media_id: null }
      const current = existing.find((b) => b.key === field.key)
      if (current) {
        const changed = isImage ? current.media_id !== patch.media_id : current.value !== patch.value
        if (changed) await db.update('content_blocks', current.id, patch)
      } else if (raw !== field.default) {
        await db.insert('content_blocks', { page, key: field.key, ...patch })
      }
    }
  } catch (error) {
    return { error: friendly(error) }
  }
  refreshSite()
  return { ok: 'Saved. The public site is updated.' }
}

/* ---------- Media ---------- */

const MAX_UPLOAD = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export async function uploadMedia(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdminAction()
  const alt = str(form, 'alt', 300)
  const caption = str(form, 'caption', 500) || null
  const url = str(form, 'url', 1000)
  const file = form.get('file')
  if (!alt) return { error: 'Describe the photo for screen readers (alt text).' }

  try {
    const db = await getAdminDb()
    if (file instanceof File && file.size > 0) {
      if (DEMO_MODE) return { error: 'File uploads need Supabase connected. In the preview you can add a photo by URL.' }
      if (!ALLOWED_TYPES.includes(file.type)) return { error: 'Upload a JPG, PNG, WebP or AVIF image.' }
      if (file.size > MAX_UPLOAD) return { error: 'Images must be under 8 MB.' }
      const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
      const path = `uploads/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`
      const supabase = await createClient()
      const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, upsert: false })
      if (error) return { error: friendly(error) }
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      await db.insert('media', { url: data.publicUrl, storage_path: path, alt, caption, is_demo: false })
    } else if (url) {
      if (!/^(https:\/\/|\/images\/)/.test(url)) return { error: 'Photo URLs must start with https:// or /images/.' }
      await db.insert('media', { url, storage_path: null, alt, caption, is_demo: false })
    } else {
      return { error: 'Choose an image file or paste a photo URL.' }
    }
  } catch (error) {
    return { error: friendly(error) }
  }
  revalidatePath('/admin/media')
  return { ok: 'Photo added to the library.' }
}

export async function updateMedia(mediaId: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdminAction()
  if (!isId(mediaId)) return { error: 'Invalid photo.' }
  const alt = str(form, 'alt', 300)
  if (!alt) return { error: 'Alt text is required.' }
  try {
    const db = await getAdminDb()
    await db.update('media', mediaId, { alt, caption: str(form, 'caption', 500) || null, is_demo: form.get('is_demo') === 'on' })
  } catch (error) {
    return { error: friendly(error) }
  }
  refreshSite()
  return { ok: 'Saved.' }
}

export async function deleteMedia(mediaId: string) {
  await requireAdminAction()
  if (!isId(mediaId)) throw new Error('Invalid request')
  const db = await getAdminDb()
  const media = await db.get<Media>('media', mediaId)
  if (!media) redirect('/admin/media')
  try {
    for (const item of await db.list<GalleryItem>('gallery_items', { media_id: mediaId })) {
      await db.remove('gallery_items', item.id)
    }
    await db.remove('media', mediaId)
    if (media.storage_path && !DEMO_MODE) {
      const supabase = await createClient()
      await supabase.storage.from('media').remove([media.storage_path])
    }
  } catch (error) {
    redirect(`/admin/media?error=${encodeURIComponent(friendly(error))}`)
  }
  refreshSite()
  redirect('/admin/media?deleted=1')
}

/* ---------- Galleries ---------- */

const GALLERY_KEY = /^[a-z]+(?::[\w-]+)?$/

export async function addGalleryItem(galleryKey: string, form: FormData) {
  await requireAdminAction()
  const mediaId = str(form, 'media_id')
  if (!GALLERY_KEY.test(galleryKey) || !isId(mediaId)) return
  const db = await getAdminDb()
  const items = await db.list<GalleryItem>('gallery_items', { gallery_key: galleryKey })
  if (items.some((i) => i.media_id === mediaId)) return
  await db.insert('gallery_items', {
    gallery_key: galleryKey,
    media_id: mediaId,
    position: items.reduce((m, i) => Math.max(m, i.position), -1) + 1,
    status: 'published',
  })
  refreshSite()
}

export async function moveGalleryItem(itemId: string, direction: 'up' | 'down') {
  await requireAdminAction()
  if (!isId(itemId)) return
  const db = await getAdminDb()
  const item = await db.get<GalleryItem>('gallery_items', itemId)
  if (!item) return
  const items = (await db.list<GalleryItem>('gallery_items', { gallery_key: item.gallery_key })).sort((a, b) => a.position - b.position)
  const index = items.findIndex((i) => i.id === itemId)
  const target = direction === 'up' ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= items.length) return
  ;[items[index], items[target]] = [items[target], items[index]]
  // Rewrite positions as 0..n so duplicate positions can never block a move.
  for (const [i, it] of items.entries()) if (it.position !== i) await db.update('gallery_items', it.id, { position: i })
  refreshSite()
}

export async function toggleGalleryItem(itemId: string) {
  await requireAdminAction()
  if (!isId(itemId)) return
  const db = await getAdminDb()
  const item = await db.get<GalleryItem>('gallery_items', itemId)
  if (!item) return
  await db.update('gallery_items', itemId, { status: item.status === 'published' ? 'draft' : 'published' })
  refreshSite()
}

export async function removeGalleryItem(itemId: string) {
  await requireAdminAction()
  if (!isId(itemId)) return
  const db = await getAdminDb()
  await db.remove('gallery_items', itemId)
  refreshSite()
}

/* ---------- Session ---------- */

export async function signIn(_prev: ActionState, form: FormData): Promise<ActionState> {
  if (DEMO_MODE) redirect('/admin')
  const email = str(form, 'email', 320).toLowerCase()
  const password = typeof form.get('password') === 'string' ? (form.get('password') as string) : ''
  if (!email || !password) return { error: 'Enter your email and password.' }
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.error('[admin] sign-in failed:', error.code ?? error.message)
    if (error.status === 429) return { error: 'Too many attempts. Wait a few minutes and try again.' }
    if (error.code === 'email_not_confirmed') return { error: 'Confirm your email address before signing in.' }
    return { error: 'Invalid email or password.' }
  }
  const session = await getAdminSession()
  if (!session) {
    await supabase.auth.signOut()
    return { error: 'This account does not have admin access.' }
  }
  redirect('/admin')
}

export async function signOut() {
  if (!DEMO_MODE) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect('/admin/login')
}

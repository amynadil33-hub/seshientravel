'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { submitBookingRequest, type FormState } from '@/app/actions/public'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, Honeypot } from '@/components/site/field'
import { cta } from '@/components/site/cta'
import type { StayInput } from '@/lib/booking/engine'

export function BookingRequestForm({ roomId, stay, expectedTotal }: { roomId: string; stay: StayInput; expectedTotal: number }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitBookingRequest, {})
  const err = state.fieldErrors ?? {}
  const describe = (k: string) => (err[k] ? `bk-${k}-error` : undefined)
  return (
    <form action={action} className="relative flex flex-col gap-4" noValidate>
      <Honeypot />
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="checkIn" value={stay.checkIn} />
      <input type="hidden" name="checkOut" value={stay.checkOut} />
      <input type="hidden" name="adults" value={stay.adults} />
      <input type="hidden" name="children" value={stay.children} />
      <input type="hidden" name="rooms" value={stay.units} />
      <input type="hidden" name="expectedTotal" value={expectedTotal} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="bk-guest_name" label="Full name" error={err.guest_name} className="sm:col-span-2">
          <Input id="bk-guest_name" name="guest_name" autoComplete="name" required aria-invalid={!!err.guest_name} aria-describedby={describe('guest_name')} />
        </Field>
        <Field id="bk-email" label="Email" error={err.email}>
          <Input id="bk-email" name="email" type="email" autoComplete="email" required aria-invalid={!!err.email} aria-describedby={describe('email')} />
        </Field>
        <Field id="bk-phone" label="Phone / WhatsApp" error={err.phone}>
          <Input id="bk-phone" name="phone" type="tel" autoComplete="tel" required aria-invalid={!!err.phone} aria-describedby={describe('phone')} />
        </Field>
        <Field id="bk-country" label="Country (optional)" error={err.country} className="sm:col-span-2">
          <Input id="bk-country" name="country" autoComplete="country-name" />
        </Field>
      </div>
      <Field id="bk-arrival_notes" label="Arrival details & requests (optional)" hint="Flight time, speedboat transfer, dietary needs, surf plans…" error={err.arrival_notes}>
        <Textarea id="bk-arrival_notes" name="arrival_notes" rows={4} />
      </Field>
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" name="terms" required className="mt-1 size-4 accent-ocean" aria-invalid={!!err.terms} aria-describedby={describe('terms')} />
          <span>
            {'I understand this is a booking request, not a confirmed reservation, and I accept the '}
            <Link href="/terms" target="_blank" className="font-medium text-ocean underline">
              booking terms
            </Link>
            {' and '}
            <Link href="/privacy" target="_blank" className="font-medium text-ocean underline">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {err.terms && (
          <p id="bk-terms-error" className="text-sm text-destructive" role="alert">
            {err.terms}
          </p>
        )}
      </div>
      {state.message && !state.ok && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={cta('primary', 'lg', 'self-start')}>
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
        {pending ? 'Sending request…' : 'Send booking request'}
      </button>
    </form>
  )
}

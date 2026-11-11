'use client'

import { useActionState, useState } from 'react'
import { setBookingStatus, updateBookingDetails } from '@/app/actions/admin'
import { Field, nativeSelect } from '@/components/site/field'
import { Textarea } from '@/components/ui/textarea'
import type { BookingStatus, PaymentStatus } from '@/lib/types'
import { SubmitButton } from './form-bits'

function Feedback({ state }: { state: { error?: string; ok?: string } | null }) {
  if (!state) return null
  return (
    <p role={state.error ? 'alert' : 'status'} className={state.error ? 'text-sm text-destructive' : 'text-sm text-primary'}>
      {state.error ?? state.ok}
    </p>
  )
}

const NEXT: Record<BookingStatus, { value: BookingStatus; label: string; variant: 'default' | 'outline' | 'destructive' }[]> = {
  pending: [
    { value: 'confirmed', label: 'Confirm booking', variant: 'default' },
    { value: 'declined', label: 'Decline', variant: 'outline' },
  ],
  confirmed: [{ value: 'cancelled', label: 'Cancel booking', variant: 'destructive' }],
  declined: [],
  cancelled: [],
}

export function BookingStatusForm({ bookingId, status }: { bookingId: string; status: BookingStatus }) {
  const [state, action] = useActionState(setBookingStatus.bind(null, bookingId), null)
  const [choice, setChoice] = useState<BookingStatus | null>(null)
  const options = NEXT[status]

  if (!options.length)
    return <p className="text-sm text-muted-foreground">This booking is {status}. No further status changes are available.</p>

  const needsReason = choice === 'declined' || choice === 'cancelled'
  return (
    <form action={action} className="flex flex-col gap-3">
      {needsReason && (
        <Field id="reason" label="Reason (internal, optional)">
          <Textarea id="reason" name="reason" rows={2} />
        </Field>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((o) =>
          needsReason && choice === o.value ? (
            <SubmitButton key={o.value} variant={o.variant} pendingLabel="Updating…">
              {`${o.label} now`}
            </SubmitButton>
          ) : o.value === 'confirmed' ? (
            <button
              key={o.value}
              type="submit"
              name="status"
              value="confirmed"
              onClick={() => setChoice('confirmed')}
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {o.label}
            </button>
          ) : (
            <button
              key={o.value}
              type="button"
              onClick={() => setChoice(o.value)}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-muted"
            >
              {o.label}
            </button>
          ),
        )}
      </div>
      {needsReason && <input type="hidden" name="status" value={choice ?? ''} />}
      <Feedback state={state} />
      <p className="text-xs text-muted-foreground">Updating the status does not email the guest. Reply to them directly.</p>
    </form>
  )
}

export function BookingDetailsForm({
  bookingId,
  paymentStatus,
  adminNotes,
}: {
  bookingId: string
  paymentStatus: PaymentStatus
  adminNotes: string
}) {
  const [state, action] = useActionState(updateBookingDetails.bind(null, bookingId), null)
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field id="payment_status" label="Payment">
        <select id="payment_status" name="payment_status" defaultValue={paymentStatus} className={nativeSelect}>
          <option value="unpaid">Unpaid</option>
          <option value="deposit_paid">Deposit paid</option>
          <option value="paid">Paid in full</option>
          <option value="refunded">Refunded</option>
        </select>
      </Field>
      <Field id="admin_notes" label="Internal notes" hint="Only visible to admins.">
        <Textarea id="admin_notes" name="admin_notes" rows={4} defaultValue={adminNotes} />
      </Field>
      <Feedback state={state} />
      <SubmitButton>Save</SubmitButton>
    </form>
  )
}

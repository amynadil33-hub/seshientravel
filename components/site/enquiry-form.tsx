'use client'

import { useActionState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { submitEnquiry, type FormState } from '@/app/actions/public'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, Honeypot } from '@/components/site/field'
import { cta } from '@/components/site/cta'
import type { EnquiryKind } from '@/lib/types'

export function EnquiryForm({
  kind,
  subjectId,
  subjectTitle,
  showDate = true,
  showParty = true,
  dateLabel = 'Preferred date',
  partyLabel = 'Number of people',
  messagePlaceholder = 'Tell us what you have in mind…',
  submitLabel = 'Send enquiry',
}: {
  kind: EnquiryKind
  subjectId?: string
  subjectTitle?: string
  showDate?: boolean
  showParty?: boolean
  dateLabel?: string
  partyLabel?: string
  messagePlaceholder?: string
  submitLabel?: string
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitEnquiry, {})
  const err = state.fieldErrors ?? {}
  const p = `enq-${kind}`

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-ocean/30 bg-accent p-6" role="status">
        <CheckCircle2 className="size-7 text-ocean" aria-hidden="true" />
        <p className="font-heading text-lg font-bold">Enquiry sent</p>
        <p className="leading-relaxed text-muted-foreground">{state.message}</p>
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)
  const describe = (k: string) => (err[k] ? `${p}-${k}-error` : undefined)

  return (
    <form action={action} className="relative flex flex-col gap-4" noValidate>
      <input type="hidden" name="kind" value={kind} />
      {subjectId && <input type="hidden" name="subject_id" value={subjectId} />}
      {subjectTitle && <input type="hidden" name="subject_title" value={subjectTitle} />}
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${p}-name`} label="Your name" error={err.name}>
          <Input id={`${p}-name`} name="name" autoComplete="name" required aria-invalid={!!err.name} aria-describedby={describe('name')} />
        </Field>
        <Field id={`${p}-email`} label="Email" error={err.email}>
          <Input id={`${p}-email`} name="email" type="email" autoComplete="email" required aria-invalid={!!err.email} aria-describedby={describe('email')} />
        </Field>
        <Field id={`${p}-phone`} label="Phone / WhatsApp (optional)" error={err.phone}>
          <Input id={`${p}-phone`} name="phone" type="tel" autoComplete="tel" aria-invalid={!!err.phone} />
        </Field>
        {showDate && (
          <Field id={`${p}-preferred_date`} label={dateLabel} error={err.preferred_date}>
            <Input id={`${p}-preferred_date`} name="preferred_date" type="date" min={today} aria-invalid={!!err.preferred_date} aria-describedby={describe('preferred_date')} />
          </Field>
        )}
        {showParty && (
          <Field id={`${p}-party_size`} label={partyLabel} error={err.party_size}>
            <Input id={`${p}-party_size`} name="party_size" type="number" min={1} max={100} inputMode="numeric" aria-invalid={!!err.party_size} aria-describedby={describe('party_size')} />
          </Field>
        )}
      </div>
      <Field id={`${p}-message`} label="Message" error={err.message}>
        <Textarea
          id={`${p}-message`}
          name="message"
          rows={5}
          required
          placeholder={messagePlaceholder}
          aria-invalid={!!err.message}
          aria-describedby={describe('message')}
        />
      </Field>
      {state.message && !state.ok && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={cta('primary', 'lg', 'self-start')}>
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
        {pending ? 'Sending…' : submitLabel}
      </button>
    </form>
  )
}

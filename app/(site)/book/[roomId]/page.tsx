import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, ArrowLeft, CalendarDays, Info } from 'lucide-react'
import { StayForm } from '@/components/booking/stay-form'
import { PriceBreakdownView } from '@/components/booking/price-breakdown'
import { BookingRequestForm } from '@/components/booking/booking-request-form'
import { DemoNotice } from '@/components/site/demo-badge'
import { computeQuote, loadRoomContext, parseStay } from '@/lib/booking/load'
import { formatDate } from '@/lib/format'
import { getSettings } from '@/lib/queries'
import { DEMO_MODE, isServiceRoleConfigured } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Booking request',
  robots: { index: false },
}

type Props = {
  params: Promise<{ roomId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BookPage({ params, searchParams }: Props) {
  const { roomId } = await params
  const ctx = await loadRoomContext(roomId)
  if (!ctx) notFound()
  const stay = parseStay(await searchParams)
  const hasDates = Boolean(stay.checkIn && stay.checkOut)
  const [result, settings] = await Promise.all([hasDates ? computeQuote(roomId, stay) : null, getSettings()])
  const { room, guesthouse } = ctx
  const blocked = result?.ok && result.availability && result.availability.unavailableNights.length > 0

  return (
    <div className="bg-sand">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:py-14">
        <Link href={`/guesthouses/${guesthouse.slug}`} className="inline-flex items-center gap-2 self-start text-sm font-medium text-ocean hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {`Back to ${guesthouse.name}`}
        </Link>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">Booking request</p>
          <h1 className="text-3xl font-bold text-balance md:text-5xl">{`${room.name} · ${guesthouse.name}`}</h1>
        </div>
        {guesthouse.is_demo && <DemoNotice>Demo listing — rates are illustrative. Requests are stored so you can test the admin approval flow.</DemoNotice>}

        <section aria-labelledby="dates-heading" className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 id="dates-heading" className="flex items-center gap-2 pb-4 font-heading text-lg font-bold">
            <CalendarDays className="size-5 text-ocean" aria-hidden="true" />
            Your stay
          </h2>
          <StayForm room={room} stay={stay} submitLabel={hasDates ? 'Update price' : 'Check price & availability'} />
        </section>

        {result && !result.ok && (
          <p role="alert" className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            {result.error}
          </p>
        )}

        {result?.ok && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
            <section aria-labelledby="price-heading" className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6 lg:sticky lg:top-24">
              <div className="flex flex-col gap-1">
                <h2 id="price-heading" className="font-heading text-lg font-bold">
                  Price breakdown
                </h2>
                <p className="text-sm text-muted-foreground">
                  {`${formatDate(result.stay.checkIn)} → ${formatDate(result.stay.checkOut)} · ${result.stay.adults} adult${result.stay.adults > 1 ? 's' : ''}${result.stay.children ? `, ${result.stay.children} child${result.stay.children > 1 ? 'ren' : ''}` : ''}`}
                </p>
              </div>
              <PriceBreakdownView breakdown={result.breakdown} />
              <p className="flex items-start gap-2 rounded-xl bg-accent p-3 text-xs leading-relaxed text-accent-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                No payment is taken online. This is a request — we confirm availability and payment details by email.
              </p>
            </section>

            <section aria-labelledby="guest-heading" className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
              <h2 id="guest-heading" className="font-heading text-lg font-bold">
                Guest details
              </h2>
              {blocked ? (
                <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
                  {`Sorry — this room is fully booked on ${result.availability!.unavailableNights.map((n) => formatDate(n, { day: 'numeric', month: 'short' })).join(', ')}. Try different dates or contact us at ${settings.email}.`}
                </p>
              ) : !(DEMO_MODE || isServiceRoleConfigured) ? (
                <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                  {`Online requests are not enabled yet. Please email ${settings.email} or message us on WhatsApp with these dates.`}
                </p>
              ) : (
                <>
                  {result.availability && result.availability.pendingOverlaps > 0 && (
                    <p className="text-sm text-muted-foreground">Other guests have also requested these dates — we handle requests in the order they arrive.</p>
                  )}
                  <BookingRequestForm roomId={room.id} stay={result.stay} expectedTotal={result.breakdown.total} />
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

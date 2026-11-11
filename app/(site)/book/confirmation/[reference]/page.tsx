import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { cta } from '@/components/site/cta'
import { getServiceDb } from '@/lib/dbs'
import { formatDate, money } from '@/lib/format'
import { getSettings } from '@/lib/queries'
import type { Booking, Guesthouse, RoomType } from '@/lib/types'

export const metadata: Metadata = { title: 'Request received', robots: { index: false } }

const STATUS_COPY: Record<Booking['status'], string> = {
  pending: 'Awaiting confirmation',
  confirmed: 'Confirmed',
  declined: 'Not available',
  cancelled: 'Cancelled',
}

export default async function ConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params
  if (!/^SSH-[A-Z0-9]{6}$/.test(reference)) notFound()
  const db = getServiceDb()
  const booking = db ? await db.findOne<Booking>('bookings', { reference }).catch(() => null) : null
  if (!booking || !db) notFound()
  const [room, guesthouse, settings] = await Promise.all([
    db.get<RoomType>('room_types', booking.room_type_id),
    db.get<Guesthouse>('guesthouses', booking.guesthouse_id),
    getSettings(),
  ])

  return (
    <div className="bg-sand">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-16 md:py-24">
        <CheckCircle2 className="size-10 text-ocean" aria-hidden="true" />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-balance md:text-5xl">Thanks — we have your request</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {`We'll check availability with the guesthouse and reply by email, usually within 24 hours. Nothing has been charged.`}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 text-sm">
          <div className="col-span-2">
            <dt className="text-muted-foreground">Reference</dt>
            <dd className="font-mono text-xl font-semibold tracking-wider">{booking.reference}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">{STATUS_COPY[booking.status]}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estimated total</dt>
            <dd className="font-medium">{money(Number(booking.total), booking.currency)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Stay</dt>
            <dd className="font-medium">
              {`${room?.name ?? 'Room'} · ${guesthouse?.name ?? ''}`}
              <span className="block font-normal text-muted-foreground">{`${formatDate(booking.check_in)} → ${formatDate(booking.check_out)} · ${booking.units} room${booking.units > 1 ? 's' : ''}`}</span>
            </dd>
          </div>
        </dl>
        <p className="text-sm text-muted-foreground">{`Keep your reference handy. Questions? Email ${settings.email} or message us on WhatsApp.`}</p>
        <Link href="/" className={cta('navy', 'md', 'self-start')}>
          Back to home
        </Link>
      </div>
    </div>
  )
}

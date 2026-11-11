import { notFound } from 'next/navigation'
import { BookingDetailsForm, BookingStatusForm } from '@/components/admin/booking-forms'
import { AdminPageHeader, Notice, Panel, StatusPill } from '@/components/admin/ui'
import { PriceBreakdownView } from '@/components/booking/price-breakdown'
import { availability } from '@/lib/booking/engine'
import { getAdminDb } from '@/lib/dbs'
import { formatDate, formatDateTime } from '@/lib/format'
import type { Booking, DateBlock, Guesthouse, RoomType } from '@/lib/types'

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getAdminDb()
  const booking = await db.get<Booking>('bookings', id).catch(() => null)
  if (!booking) notFound()

  const [room, guesthouse, roomBookings, blocks] = await Promise.all([
    db.get<RoomType>('room_types', booking.room_type_id),
    db.get<Guesthouse>('guesthouses', booking.guesthouse_id),
    db.list<Booking>('bookings', { room_type_id: booking.room_type_id }),
    db.list<DateBlock>('date_blocks', { room_type_id: booking.room_type_id }),
  ])
  const avail = room
    ? availability(room, roomBookings, blocks, booking.check_in, booking.check_out, booking.units, booking.id)
    : null

  const subject = encodeURIComponent(`Your Sea Shine booking request ${booking.reference}`)
  const phoneDigits = booking.phone.replace(/\D/g, '')

  return (
    <>
      <AdminPageHeader
        title={`${booking.guest_name}`}
        description={`Reference ${booking.reference} · received ${formatDateTime(booking.created_at)}`}
        back={{ href: '/admin/bookings', label: 'Bookings' }}
        actions={
          <div className="flex items-center gap-2">
            <StatusPill value={booking.status} />
            <StatusPill value={booking.payment_status} />
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <Panel title="Stay">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Guesthouse</dt>
                <dd className="font-medium">{guesthouse?.name ?? 'Removed'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Room</dt>
                <dd className="font-medium">
                  {room?.name ?? 'Removed'} × {booking.units}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Check-in</dt>
                <dd className="font-medium">{formatDate(booking.check_in, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Check-out</dt>
                <dd className="font-medium">{formatDate(booking.check_out, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Guests</dt>
                <dd className="font-medium">
                  {booking.adults} adult{booking.adults === 1 ? '' : 's'}, {booking.children} child{booking.children === 1 ? '' : 'ren'}
                </dd>
              </div>
            </dl>
            {booking.arrival_notes && (
              <div className="rounded-lg bg-muted p-4 text-sm leading-relaxed">
                <p className="mb-1 font-medium">Guest notes</p>
                <p className="whitespace-pre-line">{booking.arrival_notes}</p>
              </div>
            )}
          </Panel>

          <Panel title="Price quoted to guest">
            <PriceBreakdownView breakdown={booking.price_breakdown} />
            <p className="text-xs text-muted-foreground">Prices are locked at the time of the request and do not change if you edit rates later.</p>
          </Panel>

          <Panel title="Guest contact">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a className="font-medium text-primary hover:underline" href={`mailto:${booking.email}?subject=${subject}`}>
                    {booking.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="flex flex-wrap gap-3 font-medium">
                  <a className="text-primary hover:underline" href={`tel:${booking.phone}`}>
                    {booking.phone}
                  </a>
                  {phoneDigits && (
                    <a className="text-primary hover:underline" href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  )}
                </dd>
              </div>
              {booking.country && (
                <div>
                  <dt className="text-muted-foreground">Country</dt>
                  <dd className="font-medium">{booking.country}</dd>
                </div>
              )}
            </dl>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Availability">
            {!avail ? (
              <Notice tone="error">The room type for this booking no longer exists.</Notice>
            ) : avail.unavailableNights.length ? (
              <Notice tone="error">
                Not enough rooms on {avail.unavailableNights.map((n) => formatDate(n, { day: 'numeric', month: 'short' })).join(', ')}.
                {booking.status === 'pending' ? ' This request cannot be confirmed as it stands.' : ''}
              </Notice>
            ) : (
              <Notice tone="success">
                {booking.status === 'confirmed'
                  ? 'Confirmed and holding inventory.'
                  : `Available: at least ${avail.minFree} of ${room!.inventory} room${room!.inventory === 1 ? '' : 's'} free every night.`}
              </Notice>
            )}
            {!!avail?.pendingOverlaps && (
              <p className="text-sm text-muted-foreground">
                {avail.pendingOverlaps} other pending request{avail.pendingOverlaps === 1 ? '' : 's'} overlap these dates.
              </p>
            )}
          </Panel>

          <Panel title="Status">
            <BookingStatusForm bookingId={booking.id} status={booking.status} />
            {booking.cancellation_reason && (
              <p className="text-sm text-muted-foreground">Reason: {booking.cancellation_reason}</p>
            )}
          </Panel>

          <Panel title="Payment & notes">
            <BookingDetailsForm
              bookingId={booking.id}
              paymentStatus={booking.payment_status}
              adminNotes={booking.admin_notes ?? ''}
            />
          </Panel>
        </div>
      </div>
    </>
  )
}

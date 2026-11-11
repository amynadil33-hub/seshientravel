import Link from 'next/link'
import { AdminPageHeader, EmptyState, Panel, StatusPill } from '@/components/admin/ui'
import { addDays, todayIso } from '@/lib/booking/engine'
import { getAdminDb } from '@/lib/dbs'
import { formatDate, formatDateTime, money } from '@/lib/format'
import { loadNames } from '@/lib/admin/lookups'
import type { Booking, Enquiry } from '@/lib/types'

export default async function AdminOverview() {
  const db = await getAdminDb()
  const [bookings, enquiries, names] = await Promise.all([
    db.list<Booking>('bookings'),
    db.list<Enquiry>('enquiries'),
    loadNames(db),
  ])
  const today = todayIso()
  const horizon = addDays(today, 14)
  const pending = bookings.filter((b) => b.status === 'pending').sort((a, b) => a.created_at.localeCompare(b.created_at))
  const arrivals = bookings
    .filter((b) => b.status === 'confirmed' && b.check_in >= today && b.check_in <= horizon)
    .sort((a, b) => a.check_in.localeCompare(b.check_in))
  const fresh = enquiries.filter((e) => e.status === 'new')

  return (
    <>
      <AdminPageHeader title="Overview" description="What needs your attention today." />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={`Booking requests awaiting reply (${pending.length})`}>
          {pending.length === 0 ? (
            <EmptyState>No pending requests.</EmptyState>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {pending.slice(0, 8).map((b) => (
                <li key={b.id}>
                  <Link href={`/admin/bookings/${b.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-primary">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{b.guest_name}</span>
                      <span className="truncate text-sm text-muted-foreground">
                        {names.roomName.get(b.room_type_id) ?? 'Room'} · {formatDate(b.check_in)} → {formatDate(b.check_out)}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(b.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={`Confirmed arrivals, next 14 days (${arrivals.length})`}>
          {arrivals.length === 0 ? (
            <EmptyState>No confirmed arrivals in the next two weeks.</EmptyState>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {arrivals.map((b) => (
                <li key={b.id}>
                  <Link href={`/admin/bookings/${b.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-primary">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">
                        {formatDate(b.check_in, { weekday: 'short', day: 'numeric', month: 'short' })} · {b.guest_name}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {names.guesthouseName.get(b.guesthouse_id)} · {names.roomName.get(b.room_type_id)} × {b.units}
                      </span>
                    </div>
                    <StatusPill value={b.payment_status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={`New enquiries (${fresh.length})`} className="xl:col-span-2">
          {fresh.length === 0 ? (
            <EmptyState>No new enquiries.</EmptyState>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {fresh.slice(0, 8).map((e) => (
                <li key={e.id} className="flex flex-col gap-1 py-3 md:flex-row md:items-center md:justify-between md:gap-4">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">
                      {e.name} <span className="font-normal text-muted-foreground">· {e.subject_title ?? e.kind}</span>
                    </span>
                    <span className="truncate text-sm text-muted-foreground">{e.message}</span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(e.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/enquiries" className="text-sm font-medium text-primary hover:underline">
            All enquiries
          </Link>
        </Panel>
      </div>

      <p className="text-sm text-muted-foreground">
        Confirmed revenue on the books: {money(bookings.filter((b) => b.status === 'confirmed').reduce((s, b) => s + Number(b.total), 0))}
      </p>
    </>
  )
}

import Link from 'next/link'
import { AdminPageHeader, EmptyState, StatusPill } from '@/components/admin/ui'
import { getAdminDb } from '@/lib/dbs'
import { formatDate, formatDateTime, money } from '@/lib/format'
import { loadNames } from '@/lib/admin/lookups'
import type { Booking, BookingStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const FILTERS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'declined', label: 'Declined' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'all', label: 'All' },
]

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const params = await searchParams
  const filter = FILTERS.find((f) => f.value === params.status)?.value ?? 'pending'
  const q = (params.q ?? '').trim().toLowerCase().slice(0, 100)
  const db = await getAdminDb()
  const [all, names] = await Promise.all([db.list<Booking>('bookings'), loadNames(db)])
  const rows = all
    .filter((b) => filter === 'all' || b.status === filter)
    .filter((b) => !q || [b.reference, b.guest_name, b.email].some((v) => v.toLowerCase().includes(q)))
    .sort((a, b) => (filter === 'confirmed' ? a.check_in.localeCompare(b.check_in) : b.created_at.localeCompare(a.created_at)))

  return (
    <>
      <AdminPageHeader
        title="Bookings"
        description="Requests hold no inventory until you confirm them. Confirming checks availability across every night of the stay."
      />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filter bookings" className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={`/admin/bookings?status=${f.value}`}
              aria-current={filter === f.value ? 'page' : undefined}
              className={cn(
                'rounded-full px-3 py-1 text-sm',
                filter === f.value ? 'bg-foreground text-background' : 'bg-muted text-foreground hover:bg-secondary',
              )}
            >
              {f.label} ({f.value === 'all' ? all.length : all.filter((b) => b.status === f.value).length})
            </Link>
          ))}
        </nav>
        <form className="flex gap-2" role="search">
          <input type="hidden" name="status" value={filter} />
          <label htmlFor="q" className="sr-only">
            Search bookings
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Reference, name or email"
            className="h-9 w-64 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </form>
      </div>

      {rows.length === 0 ? (
        <EmptyState>No bookings match.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Guest</th>
                <th scope="col" className="px-4 py-3 font-medium">Stay</th>
                <th scope="col" className="px-4 py-3 font-medium">Room</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Total</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((b) => (
                <tr key={b.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="font-medium text-primary hover:underline">
                      {b.guest_name}
                    </Link>
                    <div className="font-mono text-xs text-muted-foreground">{b.reference}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDate(b.check_in, { day: 'numeric', month: 'short' })} → {formatDate(b.check_out)}
                    <div className="text-xs text-muted-foreground">
                      {b.adults} adult{b.adults === 1 ? '' : 's'}
                      {b.children ? `, ${b.children} child${b.children === 1 ? '' : 'ren'}` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {names.roomName.get(b.room_type_id) ?? 'Removed room'} × {b.units}
                    <div className="text-xs text-muted-foreground">{names.guesthouseName.get(b.guesthouse_id)}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{money(Number(b.total), b.currency)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <StatusPill value={b.status} />
                      <StatusPill value={b.payment_status} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

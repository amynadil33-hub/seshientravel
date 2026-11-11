import Link from 'next/link'
import { setEnquiryStatus } from '@/app/actions/admin'
import { AdminPageHeader, EmptyState, StatusPill } from '@/components/admin/ui'
import { nativeSelect } from '@/components/site/field'
import { Button } from '@/components/ui/button'
import { getAdminDb } from '@/lib/dbs'
import { formatDate, formatDateTime } from '@/lib/format'
import type { Enquiry, EnquiryStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const FILTERS: { value: EnquiryStatus | 'all'; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
  { value: 'all', label: 'All' },
]

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const filter = FILTERS.find((f) => f.value === status)?.value ?? 'new'
  const db = await getAdminDb()
  const all = await db.list<Enquiry>('enquiries')
  const rows = all.filter((e) => filter === 'all' || e.status === filter).sort((a, b) => b.created_at.localeCompare(a.created_at))

  return (
    <>
      <AdminPageHeader title="Enquiries" description="Surf, excursion, restaurant and general messages from the website." />
      <nav aria-label="Filter enquiries" className="flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/enquiries?status=${f.value}`}
            aria-current={filter === f.value ? 'page' : undefined}
            className={cn(
              'rounded-full px-3 py-1 text-sm',
              filter === f.value ? 'bg-foreground text-background' : 'bg-muted text-foreground hover:bg-secondary',
            )}
          >
            {f.label} ({f.value === 'all' ? all.length : all.filter((e) => e.status === f.value).length})
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <EmptyState>No enquiries here.</EmptyState>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((e) => {
            const subject = encodeURIComponent(`Re: ${e.subject_title ?? 'your enquiry'} – Sea Shine`)
            return (
              <li key={e.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 lg:flex-row lg:justify-between">
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill value={e.status} />
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs capitalize text-muted-foreground">{e.kind}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(e.created_at)}</span>
                  </div>
                  <p className="font-medium">
                    {e.name}
                    {e.subject_title && <span className="font-normal text-muted-foreground"> · {e.subject_title}</span>}
                  </p>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{e.message}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <a className="text-primary hover:underline" href={`mailto:${e.email}?subject=${subject}`}>
                      {e.email}
                    </a>
                    {e.phone && (
                      <a className="text-primary hover:underline" href={`tel:${e.phone}`}>
                        {e.phone}
                      </a>
                    )}
                    {e.preferred_date && <span className="text-muted-foreground">Preferred date: {formatDate(e.preferred_date)}</span>}
                    {e.party_size && <span className="text-muted-foreground">Party of {e.party_size}</span>}
                  </div>
                </div>
                <form action={setEnquiryStatus.bind(null, e.id)} className="flex shrink-0 items-end gap-2 lg:flex-col lg:items-stretch">
                  <label className="sr-only" htmlFor={`status-${e.id}`}>
                    Status for enquiry from {e.name}
                  </label>
                  <select id={`status-${e.id}`} name="status" defaultValue={e.status} className={cn(nativeSelect, 'w-40')}>
                    <option value="new">New</option>
                    <option value="in_progress">In progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Button type="submit" variant="outline" size="sm">
                    Update
                  </Button>
                </form>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

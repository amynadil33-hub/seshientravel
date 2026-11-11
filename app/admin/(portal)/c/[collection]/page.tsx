import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdminPageHeader, EmptyState, Notice, StatusPill } from '@/components/admin/ui'
import { Button } from '@/components/ui/button'
import { COLLECTION_MAP } from '@/lib/admin/collections'
import { loadNames } from '@/lib/admin/lookups'
import { getAdminDb } from '@/lib/dbs'
import { formatDate, money } from '@/lib/format'

type Row = Record<string, unknown> & { id: string }

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>
  searchParams: Promise<{ deleted?: string }>
}) {
  const [{ collection: key }, { deleted }] = await Promise.all([params, searchParams])
  const collection = COLLECTION_MAP[key]
  if (!collection) notFound()

  const db = await getAdminDb()
  const [rows, names] = await Promise.all([db.list<Row>(collection.table), loadNames(db)])
  const fieldType = (k: string) => collection.fields.find((f) => f.key === k)?.type

  const cell = (row: Row, k: string) => {
    const v = row[k]
    if (k === 'guesthouse_id') return names.guesthouseName.get(String(v)) ?? '—'
    if (k === 'room_type_id') return names.roomName.get(String(v)) ?? '—'
    if (k === 'status') return <StatusPill value={String(v)} />
    if (v === null || v === undefined || v === '') return '—'
    if (typeof v === 'boolean') return v ? 'Yes' : 'No'
    if (fieldType(k) === 'money') return k === 'amount' && String(row.kind).startsWith('percent') ? `${v}%` : money(Number(v))
    if (fieldType(k) === 'date') return formatDate(String(v))
    if (k === 'kind') return String(v).replaceAll('_', ' ')
    return String(v)
  }

  return (
    <>
      <AdminPageHeader
        title={collection.title}
        description={collection.description}
        actions={
          <Button nativeButton={false} render={<Link href={`/admin/c/${collection.key}/new`} />}>Add {collection.singular}</Button>
        }
      />
      {deleted && <Notice tone="success">Deleted.</Notice>}
      {rows.length === 0 ? (
        <EmptyState>Nothing here yet.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Name
                </th>
                {collection.columns.map((c) => (
                  <th key={c.key} scope="col" className="px-4 py-3 font-medium">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/c/${collection.key}/${row.id}`} className="font-medium text-primary hover:underline">
                      {String(row[collection.titleKey] || `Untitled ${collection.singular}`)}
                    </Link>
                    {row.is_demo === true && <span className="ml-2 text-xs text-muted-foreground">(demo)</span>}
                  </td>
                  {collection.columns.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      {cell(row, c.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

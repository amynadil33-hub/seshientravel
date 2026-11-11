import { notFound } from 'next/navigation'
import { deleteRecord } from '@/app/actions/admin'
import { SubmitButton } from '@/components/admin/form-bits'
import { RecordForm } from '@/components/admin/record-form'
import { AdminPageHeader, Notice } from '@/components/admin/ui'
import { COLLECTION_MAP } from '@/lib/admin/collections'
import { loadMediaOptions } from '@/lib/admin/lookups'
import { getAdminDb } from '@/lib/dbs'

type Row = Record<string, unknown> & { id: string }

export default async function RecordPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const [{ collection: key, id }, { saved, error }] = await Promise.all([params, searchParams])
  const collection = COLLECTION_MAP[key]
  if (!collection) notFound()

  const db = await getAdminDb()
  const isNew = id === 'new'
  const record = isNew ? null : await db.get<Row>(collection.table, id).catch(() => null)
  if (!isNew && !record) notFound()

  const relationFields = collection.fields.filter((f) => f.type === 'relation' && f.relation)
  const [media, ...relations] = await Promise.all([
    collection.fields.some((f) => f.type === 'media') ? loadMediaOptions(db) : Promise.resolve([]),
    ...relationFields.map((f) => db.list<Row>(f.relation!.table)),
  ])
  const relationOptions = Object.fromEntries(
    relationFields.map((f, i) => [
      f.key,
      relations[i].map((r) => ({ value: r.id, label: String(r[f.relation!.labelKey] ?? r.id) })),
    ]),
  )
  const title = record ? String(record[collection.titleKey] || `Untitled ${collection.singular}`) : `New ${collection.singular}`

  return (
    <>
      <AdminPageHeader title={title} back={{ href: `/admin/c/${collection.key}`, label: collection.title }} />
      {saved && <Notice tone="success">Saved. The public site is updated.</Notice>}
      {error && <Notice tone="error">{error}</Notice>}
      <RecordForm
        collectionKey={collection.key}
        recordId={record?.id ?? null}
        values={record ?? collection.defaults ?? {}}
        media={media}
        relationOptions={relationOptions}
      />
      {record && (
        <form action={deleteRecord.bind(null, collection.key, record.id)} className="border-t border-border pt-6">
          <SubmitButton
            variant="destructive"
            pendingLabel="Deleting…"
            confirmMessage={`Delete this ${collection.singular}? This cannot be undone.`}
          >
            Delete {collection.singular}
          </SubmitButton>
        </form>
      )}
    </>
  )
}

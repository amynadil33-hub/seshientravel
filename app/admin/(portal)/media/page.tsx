import { MediaCard, MediaUploadForm } from '@/components/admin/media-forms'
import { AdminPageHeader, EmptyState, Notice, Panel } from '@/components/admin/ui'
import { getAdminDb } from '@/lib/dbs'
import { DEMO_MODE } from '@/lib/site'
import type { Media } from '@/lib/types'

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ deleted?: string; error?: string }> }) {
  const { deleted, error } = await searchParams
  const db = await getAdminDb()
  const media = (await db.list<Media>('media')).sort((a, b) => b.created_at.localeCompare(a.created_at))

  return (
    <>
      <AdminPageHeader
        title="Photo library"
        description="Every photo used on the site. Add real photos here, then choose them on rooms, packages, pages and galleries."
      />
      {deleted && <Notice tone="success">Photo deleted.</Notice>}
      {error && <Notice tone="error">{error}</Notice>}
      <Panel title="Add a photo">
        <MediaUploadForm demo={DEMO_MODE} />
      </Panel>
      {media.length === 0 ? (
        <EmptyState>No photos yet.</EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {media.map((m) => (
            <li key={m.id}>
              <MediaCard media={m} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

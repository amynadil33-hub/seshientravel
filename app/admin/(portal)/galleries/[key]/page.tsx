import { notFound } from 'next/navigation'
import { addGalleryItem, moveGalleryItem, removeGalleryItem, toggleGalleryItem } from '@/app/actions/admin'
import { AdminPageHeader, EmptyState, Panel, StatusPill } from '@/components/admin/ui'
import { nativeSelect } from '@/components/site/field'
import { Button } from '@/components/ui/button'
import { STATIC_GALLERIES } from '@/lib/admin/collections'
import { getAdminDb } from '@/lib/dbs'
import type { GalleryItem, Media } from '@/lib/types'

export default async function GalleryEditor({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const gallery = STATIC_GALLERIES.find((g) => g.key === key)
  if (!gallery) notFound()

  const db = await getAdminDb()
  const [items, media] = await Promise.all([db.list<GalleryItem>('gallery_items', { gallery_key: key }), db.list<Media>('media')])
  const mediaById = new Map(media.map((m) => [m.id, m]))
  const sorted = items.sort((a, b) => a.position - b.position)
  const available = media.filter((m) => !items.some((i) => i.media_id === m.id))

  return (
    <>
      <AdminPageHeader title={gallery.label} back={{ href: '/admin/galleries', label: 'Galleries' }} />

      <Panel title="Add a photo">
        {available.length === 0 ? (
          <p className="text-sm text-muted-foreground">Every photo in the library is already in this gallery. Add more in the photo library.</p>
        ) : (
          <form action={addGalleryItem.bind(null, key)} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="media_id" className="sr-only">
              Photo to add
            </label>
            <select id="media_id" name="media_id" required className={nativeSelect}>
              <option value="">Choose a photo…</option>
              {available.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.alt.length > 80 ? `${m.alt.slice(0, 80)}…` : m.alt}
                </option>
              ))}
            </select>
            <Button type="submit">Add</Button>
          </form>
        )}
      </Panel>

      {sorted.length === 0 ? (
        <EmptyState>This gallery is empty.</EmptyState>
      ) : (
        <ol className="flex flex-col gap-3">
          {sorted.map((item, index) => {
            const m = mediaById.get(item.media_id)
            return (
              <li key={item.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="w-6 shrink-0 text-center text-sm tabular-nums text-muted-foreground">{index + 1}</span>
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {m && <img src={m.url} alt="" className="size-full object-cover" />}
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-sm">{m?.alt ?? 'Missing photo'}</span>
                    <StatusPill value={item.status} className="self-start" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <form action={moveGalleryItem.bind(null, item.id, 'up')}>
                    <Button type="submit" variant="outline" size="sm" disabled={index === 0} aria-label={`Move photo ${index + 1} up`}>
                      Up
                    </Button>
                  </form>
                  <form action={moveGalleryItem.bind(null, item.id, 'down')}>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={index === sorted.length - 1}
                      aria-label={`Move photo ${index + 1} down`}
                    >
                      Down
                    </Button>
                  </form>
                  <form action={toggleGalleryItem.bind(null, item.id)}>
                    <Button type="submit" variant="outline" size="sm">
                      {item.status === 'published' ? 'Hide' : 'Show'}
                    </Button>
                  </form>
                  <form action={removeGalleryItem.bind(null, item.id)}>
                    <Button type="submit" variant="ghost" size="sm">
                      Remove
                    </Button>
                  </form>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </>
  )
}

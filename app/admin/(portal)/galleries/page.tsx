import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/ui'
import { STATIC_GALLERIES } from '@/lib/admin/collections'
import { getAdminDb } from '@/lib/dbs'
import type { GalleryItem } from '@/lib/types'

export default async function GalleriesPage() {
  const db = await getAdminDb()
  const items = await db.list<GalleryItem>('gallery_items')
  return (
    <>
      <AdminPageHeader title="Galleries" description="Choose which photos appear in each gallery and in what order." />
      <ul className="grid gap-3 md:grid-cols-3">
        {STATIC_GALLERIES.map((g) => {
          const count = items.filter((i) => i.gallery_key === g.key && i.status === 'published').length
          return (
            <li key={g.key}>
              <Link href={`/admin/galleries/${g.key}`} className="flex flex-col gap-1 rounded-xl border border-border bg-card p-5 hover:border-primary">
                <span className="font-medium">{g.label}</span>
                <span className="text-sm text-muted-foreground">
                  {count} published photo{count === 1 ? '' : 's'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

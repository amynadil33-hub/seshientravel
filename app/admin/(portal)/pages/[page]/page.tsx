import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageContentForm } from '@/components/admin/page-content-form'
import { AdminPageHeader } from '@/components/admin/ui'
import { Button } from '@/components/ui/button'
import { loadMediaOptions } from '@/lib/admin/lookups'
import { PAGE_DEF_MAP } from '@/lib/content-defs'
import { getAdminDb } from '@/lib/dbs'
import type { ContentBlock } from '@/lib/types'

export default async function PageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const def = PAGE_DEF_MAP[page]
  if (!def) notFound()

  const db = await getAdminDb()
  const [blocks, media] = await Promise.all([db.list<ContentBlock>('content_blocks', { page }), loadMediaOptions(db)])
  const values = Object.fromEntries(
    def.fields.map((f) => {
      const block = blocks.find((b) => b.key === f.key)
      if (!block) return [f.key, f.default]
      return [f.key, (f.type === 'image' ? block.media_id : block.value) ?? '']
    }),
  )

  return (
    <>
      <AdminPageHeader
        title={def.title}
        back={{ href: '/admin/pages', label: 'Page content' }}
        actions={
          def.path ? (
            <Button variant="outline" nativeButton={false} render={<Link href={def.path} target="_blank" />}>
              View page
            </Button>
          ) : undefined
        }
      />
      <PageContentForm page={page} fields={def.fields} values={values} media={media} />
    </>
  )
}

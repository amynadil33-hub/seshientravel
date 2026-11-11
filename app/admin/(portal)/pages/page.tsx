import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/ui'
import { PAGE_DEFS } from '@/lib/content-defs'

export default function PagesIndex() {
  return (
    <>
      <AdminPageHeader
        title="Page content"
        description="Edit headings, introductions and hero photos for each page. Listings such as rooms and packages are edited in their own sections."
      />
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {PAGE_DEFS.map((p) => (
          <li key={p.page}>
            <Link
              href={`/admin/pages/${p.page}`}
              className="flex h-full flex-col gap-1 rounded-xl border border-border bg-card p-5 hover:border-primary"
            >
              <span className="font-medium">{p.title}</span>
              <span className="text-sm text-muted-foreground">
                {p.path ?? 'Used across the site'} · {p.fields.length} field{p.fields.length === 1 ? '' : 's'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

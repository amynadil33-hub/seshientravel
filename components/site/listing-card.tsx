import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Photo } from '@/components/site/photo'
import { DemoBadge } from '@/components/site/demo-badge'
import type { ResolvedImage } from '@/lib/queries'

export function ListingCard({
  href,
  image,
  title,
  summary,
  meta,
  price,
  demo,
}: {
  href: string
  image: ResolvedImage | null
  title: string
  summary: string
  meta?: string
  price?: string | null
  demo?: boolean
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-navy/5">
      <div className="relative">
        <Photo image={image} className="aspect-[4/3]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        {demo && <DemoBadge className="absolute top-3 left-3" />}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {meta && <p className="text-xs font-semibold uppercase tracking-widest text-ocean">{meta}</p>}
        <h3 className="text-xl font-bold text-balance">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <p className="leading-relaxed text-pretty text-muted-foreground">{summary}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-sm font-semibold">{price ?? 'Price on request'}</span>
          <ArrowUpRight className="size-5 text-ocean transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Photo } from '@/components/site/photo'
import { MEDIA } from '@/lib/demo-data'
import { toImage } from '@/lib/queries'
import type { Media } from '@/lib/types'

const TILES = [
  { href: '/guesthouses', label: 'Stay', title: 'Partner guesthouses', media: MEDIA.stayExterior },
  { href: '/surf', label: 'Surf', title: 'Boat trips to the reef', media: MEDIA.surfBoat },
  { href: '/activities', label: 'Explore', title: 'Snorkel, sandbanks & fishing', media: MEDIA.snorkel },
  { href: '/restaurant', label: 'Eat', title: 'Our restaurant', media: MEDIA.grill },
]

export function PlanTiles({ media }: { media: Map<string, Media> }) {
  return (
    <section aria-labelledby="plan-heading" className="mx-auto max-w-6xl px-5 pt-16 md:pt-20">
      <h2 id="plan-heading" className="sr-only">
        Plan your trip
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {TILES.map((t) => (
          <li key={t.href} className="group relative overflow-hidden rounded-2xl">
            <Photo image={toImage(media, t.media)} className="aspect-[3/4] md:aspect-[4/5]" sizes="(min-width: 768px) 25vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-navy-foreground">
              <span className="text-xs font-semibold uppercase tracking-widest text-sunset">{t.label}</span>
              <Link href={t.href} className="flex items-center justify-between gap-2 font-heading text-base font-bold text-balance after:absolute after:inset-0 md:text-lg">
                {t.title}
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

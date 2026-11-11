import type { Metadata } from 'next'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { ListingCard } from '@/components/site/listing-card'
import { money } from '@/lib/format'
import { getContent, getMediaMap, listSurfBreaks, listSurfPackages, toImage } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Surf packages',
  description: 'Surf packages from Huraa island — boat trips to the North Malé Atoll reef breaks, with guesthouse stays.',
}

export default async function SurfPage() {
  const [{ text, images }, packages, breaks, media] = await Promise.all([
    getContent('surf'),
    listSurfPackages(),
    listSurfBreaks(),
    getMediaMap(),
  ])
  const current = packages.filter((p) => !p.is_legacy)
  const legacy = packages.filter((p) => p.is_legacy)

  return (
    <>
      <PageHero eyebrow="Surf" title={text.hero_title} subtitle={text.hero_subtitle} image={images.hero_image} compact />
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-16 md:py-20">
        <SectionHeading title="Packages" intro="Every package is tailored to the swell, your level and your dates — send an enquiry and we'll reply with a quote." />
        <PackageGrid packages={current} media={media} />
        {legacy.length > 0 && (
          <div className="flex flex-col gap-6 border-t border-border pt-10">
            <SectionHeading title="Classic packages" intro="Packages from our previous site, still available on request." />
            <PackageGrid packages={legacy} media={media} />
          </div>
        )}
      </section>

      {breaks.length > 0 && (
        <section className="bg-navy text-navy-foreground">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-16 md:py-24">
            <div className="flex max-w-2xl flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-sunset">Breaks</p>
              <h2 className="text-3xl font-bold text-balance md:text-5xl">{text.breaks_title}</h2>
              <p className="text-lg leading-relaxed text-navy-foreground/75">{text.breaks_intro}</p>
            </div>
            <dl className="grid gap-px overflow-hidden rounded-2xl bg-navy-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
              {breaks.map((b) => (
                <div key={b.id} className="flex flex-col gap-2 bg-navy p-6">
                  <dt className="font-heading text-xl font-bold">{b.name}</dt>
                  <dd className="text-xs font-semibold uppercase tracking-widest text-sunset">{b.wave}</dd>
                  <dd className="leading-relaxed text-navy-foreground/75">{b.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}
    </>
  )
}

function PackageGrid({ packages, media }: { packages: Awaited<ReturnType<typeof listSurfPackages>>; media: Awaited<ReturnType<typeof getMediaMap>> }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((p) => (
        <ListingCard
          key={p.id}
          href={`/surf/${p.slug}`}
          image={toImage(media, p.cover_media_id)}
          title={p.title}
          summary={p.summary}
          meta={p.duration_label}
          price={p.price_from !== null ? `From ${money(p.price_from)}` : 'Price on request'}
          demo={p.is_demo}
        />
      ))}
    </div>
  )
}

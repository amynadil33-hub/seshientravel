import Link from 'next/link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { ListingCard } from '@/components/site/listing-card'
import { Photo } from '@/components/site/photo'
import { RichText } from '@/components/site/rich-text'
import { GalleryStrip } from '@/components/home/gallery-strip'
import { PlanTiles } from '@/components/home/plan-tiles'
import { cta } from '@/components/site/cta'
import { money } from '@/lib/format'
import {
  fromRate,
  getContent,
  getGallery,
  getMediaMap,
  listGuesthouses,
  listRooms,
  listSurfPackages,
  toImage,
} from '@/lib/queries'

export default async function HomePage() {
  const [{ text, images }, guesthouses, rooms, packages, media, gallery] = await Promise.all([
    getContent('home'),
    listGuesthouses(),
    listRooms(),
    listSurfPackages(),
    getMediaMap(),
    getGallery('gallery'),
  ])
  const surf = packages.filter((p) => !p.is_legacy).slice(0, 3)

  return (
    <>
      <PageHero eyebrow="Huraa · North Malé Atoll" title={text.hero_title} subtitle={text.hero_subtitle} image={images.hero_image}>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/guesthouses" className={cta('primary', 'lg')}>
            Book a stay
          </Link>
          <Link href="/surf" className={cta('light', 'lg')}>
            Surf packages
          </Link>
        </div>
      </PageHero>

      <PlanTiles media={media} />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
        <Photo image={images.intro_image} className="aspect-[4/5] rounded-3xl" />
        <div className="flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">The island</p>
          <h2 className="text-3xl font-bold text-balance md:text-5xl">{text.intro_title}</h2>
          <RichText text={text.intro_body} className="text-lg text-muted-foreground" />
          <Link href="/discover-huraa" className={cta('outline', 'md', 'self-start')}>
            Discover Huraa
          </Link>
        </div>
      </section>

      {guesthouses.length > 0 && (
        <section className="bg-sand">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 md:py-24">
            <SectionHeading
              eyebrow="Stay"
              title="Partner guesthouses"
              intro="Send a booking request online — we confirm availability with the guesthouse and reply by email."
              action={
                <Link href="/guesthouses" className={cta('outline', 'sm')}>
                  All guesthouses
                </Link>
              }
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guesthouses.slice(0, 3).map((g) => {
                const rate = fromRate(rooms.filter((r) => r.guesthouse_id === g.id))
                return (
                  <ListingCard
                    key={g.id}
                    href={`/guesthouses/${g.slug}`}
                    image={toImage(media, g.cover_media_id)}
                    title={g.name}
                    summary={g.summary}
                    meta={g.location}
                    price={rate !== null ? `From ${money(rate)} / night` : null}
                    demo={g.is_demo}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      {surf.length > 0 && (
        <section className="bg-navy text-navy-foreground">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 md:py-24">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex max-w-2xl flex-col gap-3">
                <p className="text-sm font-semibold uppercase tracking-widest text-sunset">Surf</p>
                <h2 className="text-3xl font-bold text-balance md:text-5xl">Reef breaks on the horizon</h2>
                <p className="text-lg leading-relaxed text-navy-foreground/75">
                  Stay on Huraa, ride the boat out each morning, and let the crew pick the break that is working.
                </p>
              </div>
              <Link href="/surf" className={cta('light', 'sm', 'self-start md:self-auto')}>
                Surf packages & breaks
              </Link>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-2xl bg-navy-foreground/15 md:grid-cols-3">
              {surf.map((p) => (
                <li key={p.id} className="flex flex-col gap-3 bg-navy p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-navy-foreground/60">{p.duration_label}</p>
                  <h3 className="text-xl font-bold">
                    <Link href={`/surf/${p.slug}`} className="hover:text-sunset">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="leading-relaxed text-navy-foreground/75">{p.summary}</p>
                  <p className="mt-auto pt-2 text-sm font-semibold text-sunset">
                    {p.price_from !== null ? `From ${money(p.price_from)}` : 'Price on request'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
        <div className="order-2 flex flex-col gap-5 md:order-1">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">Restaurant</p>
          <h2 className="text-3xl font-bold text-balance md:text-5xl">{text.restaurant_title}</h2>
          <RichText text={text.restaurant_body} className="text-lg text-muted-foreground" />
          <div className="flex flex-wrap gap-3">
            <Link href="/restaurant" className={cta('navy', 'md')}>
              Menu & hours
            </Link>
            <Link href="/restaurant#reserve" className={cta('outline', 'md')}>
              Reserve a table
            </Link>
          </div>
        </div>
        <Photo image={images.restaurant_image} className="order-1 aspect-[4/3] rounded-3xl md:order-2" />
      </section>

      {gallery.length > 0 && <GalleryStrip images={gallery.slice(0, 6)} />}
    </>
  )
}

import type { Metadata } from 'next'
import { PageHero } from '@/components/site/page-hero'
import { ListingCard } from '@/components/site/listing-card'
import { money } from '@/lib/format'
import { fromRate, getContent, getMediaMap, listGuesthouses, listRooms, toImage } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Guesthouses on Huraa',
  description: 'Partner guesthouses on Huraa island, Maldives. Check prices and send a booking request online.',
}

export default async function GuesthousesPage() {
  const [{ text, images }, guesthouses, rooms, media] = await Promise.all([
    getContent('guesthouses'),
    listGuesthouses(),
    listRooms(),
    getMediaMap(),
  ])
  return (
    <>
      <PageHero eyebrow="Stay" title={text.hero_title} subtitle={text.hero_subtitle} image={images.hero_image} compact />
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        {guesthouses.length === 0 ? (
          <p className="text-lg text-muted-foreground">Guesthouse listings are being updated. Please contact us for availability.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guesthouses.map((g) => {
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
        )}
      </section>
    </>
  )
}

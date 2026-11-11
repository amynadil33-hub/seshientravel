import type { Metadata } from 'next'
import { PageHero } from '@/components/site/page-hero'
import { ListingCard } from '@/components/site/listing-card'
import { money } from '@/lib/format'
import { getContent, getMediaMap, listActivities, toImage } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Activities & excursions',
  description: 'Snorkelling, sandbank picnics, sunset fishing and diving trips from Huraa island.',
}

export default async function ActivitiesPage() {
  const [{ text, images }, activities, media] = await Promise.all([getContent('activities'), listActivities(), getMediaMap()])
  return (
    <>
      <PageHero eyebrow="Explore" title={text.hero_title} subtitle={text.hero_subtitle} image={images.hero_image} compact />
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <ListingCard
              key={a.id}
              href={`/activities/${a.slug}`}
              image={toImage(media, a.cover_media_id)}
              title={a.title}
              summary={a.summary}
              meta={a.duration_label}
              price={a.price_from !== null ? `From ${money(a.price_from)}` : 'Price on request'}
              demo={a.is_demo}
            />
          ))}
        </div>
      </section>
    </>
  )
}

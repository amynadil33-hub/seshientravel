import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BedDouble, Check, MapPin, Ruler, Users } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Photo } from '@/components/site/photo'
import { RichText } from '@/components/site/rich-text'
import { DemoNotice } from '@/components/site/demo-badge'
import { StayForm } from '@/components/booking/stay-form'
import { money } from '@/lib/format'
import { getGuesthouse, getMediaMap, getSettings, listRooms, toImage } from '@/lib/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await getGuesthouse((await params).slug)
  return g ? { title: g.name, description: g.summary } : { title: 'Guesthouse not found' }
}

export default async function GuesthousePage({ params }: Props) {
  const { slug } = await params
  const g = await getGuesthouse(slug)
  if (!g) notFound()
  const [rooms, media, settings] = await Promise.all([listRooms(), getMediaMap(), getSettings()])
  const own = rooms.filter((r) => r.guesthouse_id === g.id).sort((a, b) => a.sort - b.sort)

  return (
    <>
      <PageHero eyebrow={g.location} title={g.name} subtitle={g.summary} image={toImage(media, g.cover_media_id)} compact />
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-14 md:py-20">
        {g.is_demo && (
          <DemoNotice>
            This is a sample listing with demo rooms and rates so you can try the booking flow. Real partner guesthouses are added in the admin area.
          </DemoNotice>
        )}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold">About the guesthouse</h2>
            <RichText text={g.description} className="text-lg text-muted-foreground" />
          </div>
          <aside className="flex flex-col gap-5 rounded-2xl bg-sand p-6">
            {g.amenities.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="font-heading text-lg font-bold">Amenities</h2>
                <ul className="grid gap-2 text-sm">
                  {g.amenities.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-ocean" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {g.house_rules && (
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-lg font-bold">House rules</h2>
                <RichText text={g.house_rules} className="text-sm text-muted-foreground" />
              </div>
            )}
            {g.map_link && (
              <a href={g.map_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:underline">
                <MapPin className="size-4" aria-hidden="true" />
                View on map
              </a>
            )}
          </aside>
        </div>

        <section aria-labelledby="rooms-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="rooms-heading" className="text-3xl font-bold">
              Rooms & rates
            </h2>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              {settings.booking_notice}
            </p>
          </div>
          {own.length === 0 && <p className="text-muted-foreground">Rooms are being updated — please contact us for availability.</p>}
          {own.map((room) => (
            <article key={room.id} className="grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <Photo image={toImage(media, room.cover_media_id)} className="aspect-[4/3] md:aspect-auto md:min-h-72" sizes="(min-width: 768px) 40vw, 100vw" />
              <div className="flex flex-col gap-5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-bold">{room.name}</h3>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-1.5">
                        <BedDouble className="size-4" aria-hidden="true" />
                        {room.bed_config}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Users className="size-4" aria-hidden="true" />
                        {`Up to ${room.max_occupancy} guests`}
                      </li>
                      {room.size_sqm && (
                        <li className="flex items-center gap-1.5">
                          <Ruler className="size-4" aria-hidden="true" />
                          {`${room.size_sqm} m²`}
                        </li>
                      )}
                    </ul>
                  </div>
                  <p className="text-right">
                    <span className="block text-xs text-muted-foreground">from</span>
                    <span className="font-heading text-2xl font-bold">{money(room.base_rate)}</span>
                    <span className="text-sm text-muted-foreground"> / night</span>
                  </p>
                </div>
                <p className="leading-relaxed text-muted-foreground">{room.description}</p>
                {room.amenities.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {room.amenities.map((a) => (
                      <li key={a} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t border-border pt-5">
                  <StayForm room={room} />
                  {room.min_nights > 1 && <p className="pt-3 text-xs text-muted-foreground">{`Minimum stay ${room.min_nights} nights.`}</p>}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  )
}

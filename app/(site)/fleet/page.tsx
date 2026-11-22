import type { Metadata } from 'next'
import Link from 'next/link'
import { Anchor, Plane, Waves } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Photo } from '@/components/site/photo'
import { RichText } from '@/components/site/rich-text'
import { cta } from '@/components/site/cta'
import { MEDIA } from '@/lib/demo-data'
import { getContent, getMediaMap, toImage } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Our fleet',
  description: 'Speedboat transfers, surf departures and island excursions arranged from Huraa across North Malé Atoll.',
}

const services = [
  {
    icon: Plane,
    title: 'Airport & Malé transfers',
    body: 'Tell us your arrival details and we will confirm the available transfer option, meeting point and timing.',
  },
  {
    icon: Waves,
    title: 'Surf departures',
    body: 'Daily boat plans are matched to the swell, wind and the break that best suits the group.',
  },
  {
    icon: Anchor,
    title: 'Island excursions',
    body: 'Snorkelling, sandbank and fishing outings are arranged with the appropriate local boat and crew.',
  },
]

export default async function FleetPage() {
  const [{ text, images }, media] = await Promise.all([getContent('fleet'), getMediaMap()])
  const fleetPhotos = [
    { image: toImage(media, MEDIA.speedboatCruise), caption: 'Passenger speedboat crossing the atoll' },
    { image: toImage(media, MEDIA.speedboatFleet), caption: 'Boats underway across North Malé Atoll' },
    { image: toImage(media, MEDIA.workingHarbour), caption: 'Departures from the working island harbour' },
  ]

  return (
    <>
      <PageHero eyebrow="Fleet" title={text.hero_title} subtitle={text.hero_subtitle} image={images.hero_image} compact>
        <Link href="/contact" className={cta('primary', 'lg')}>
          Ask about a transfer
        </Link>
      </PageHero>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <Photo image={images.intro_image} className="aspect-[4/3] rounded-3xl" />
        <div className="flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">On the water</p>
          <h2 className="text-3xl font-bold text-balance md:text-5xl">{text.intro_title}</h2>
          <RichText text={text.intro_body} className="text-lg text-muted-foreground" />
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <ul className="grid gap-5 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <li key={service.title} className="rounded-2xl border border-border bg-card p-6">
                  <Icon className="mb-5 size-7 text-ocean" aria-hidden="true" />
                  <h2 className="text-xl font-bold">{service.title}</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{service.body}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">At sea & in harbour</p>
          <h2 className="mt-3 text-3xl font-bold text-balance md:text-5xl">Meet the fleet in motion</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {fleetPhotos.map((item, index) => (
            <figure key={item.caption} className={index === 0 ? 'md:row-span-2' : ''}>
              <Photo image={item.image} className={index === 0 ? 'aspect-[4/5] rounded-3xl md:h-full md:aspect-auto' : 'aspect-[16/9] rounded-3xl'} />
              <figcaption className="mt-2 text-sm text-muted-foreground">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-5 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-sunset">Plan your journey</p>
            <h2 className="mt-3 text-3xl font-bold text-balance md:text-4xl">Tell us where you need to go</h2>
            <p className="mt-3 text-lg leading-relaxed text-navy-foreground/75">
              Share your dates, arrival details and group size. We will confirm the suitable boat and timing.
            </p>
          </div>
          <Link href="/contact" className={cta('light', 'lg', 'shrink-0')}>
            Contact the Huraa team
          </Link>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { Clock, MapPin } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Photo } from '@/components/site/photo'
import { RichText } from '@/components/site/rich-text'
import { DemoBadge } from '@/components/site/demo-badge'
import { EnquiryForm } from '@/components/site/enquiry-form'
import { money } from '@/lib/format'
import { getContent, getGallery, listMenu } from '@/lib/queries'
import type { MenuItem } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Restaurant',
  description: 'Maldivian home cooking, fresh reef fish and island breakfasts at the Sea Shine restaurant on Huraa.',
}

export default async function RestaurantPage() {
  const [{ text, images }, menu, gallery] = await Promise.all([getContent('restaurant'), listMenu(), getGallery('restaurant')])
  const categories = menu.reduce<Map<string, MenuItem[]>>((acc, item) => {
    acc.set(item.category, [...(acc.get(item.category) ?? []), item])
    return acc
  }, new Map())
  const hasDemo = menu.some((m) => m.is_demo)

  return (
    <>
      <PageHero eyebrow="Eat" title={text.hero_title} subtitle={text.hero_subtitle} image={images.hero_image} compact />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.3fr_1fr] md:py-20">
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-balance md:text-4xl">{text.story_title}</h2>
          <RichText text={text.story_body} className="text-lg text-muted-foreground" />
        </div>
        <aside className="flex flex-col gap-5 self-start rounded-2xl bg-sand p-6">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 size-5 shrink-0 text-ocean" aria-hidden="true" />
            <div>
              <h3 className="font-heading font-bold">Opening hours</h3>
              <RichText text={text.hours} className="text-sm text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 size-5 shrink-0 text-ocean" aria-hidden="true" />
            <div>
              <h3 className="font-heading font-bold">Location</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text.location}</p>
            </div>
          </div>
        </aside>
      </section>

      {gallery.length > 0 && (
        <section aria-label="Restaurant photos" className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.slice(0, 4).map((img) => (
              <Photo key={img.id} image={img} className="aspect-square rounded-2xl" sizes="(min-width: 768px) 25vw, 50vw" />
            ))}
          </div>
        </section>
      )}

      {categories.size > 0 && (
        <section aria-labelledby="menu-heading" className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 md:py-20">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="menu-heading" className="text-3xl font-bold md:text-4xl">
              Menu
            </h2>
            {hasDemo && <DemoBadge label="Sample menu" />}
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {[...categories].map(([category, items]) => (
              <div key={category} className="flex flex-col gap-4">
                <h3 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-widest text-ocean">{category}</h3>
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-heading text-lg font-bold">{item.name}</span>
                        {item.price !== null && <span className="shrink-0 font-medium">{money(item.price)}</span>}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      {item.dietary.length > 0 && (
                        <p className="text-xs uppercase tracking-wider text-ocean">{item.dietary.join(' · ')}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="reserve" aria-labelledby="reserve-heading" className="scroll-mt-24 bg-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
          <div className="flex flex-col gap-4">
            <h2 id="reserve-heading" className="text-3xl font-bold md:text-4xl">
              Reserve a table
            </h2>
            <RichText text={text.reservation_note} className="text-lg text-muted-foreground" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <EnquiryForm
              kind="restaurant"
              subjectTitle="Table reservation"
              dateLabel="Date"
              partyLabel="Guests"
              messagePlaceholder="Preferred time, occasion, dietary requirements…"
              submitLabel="Request a table"
            />
          </div>
        </div>
      </section>
    </>
  )
}

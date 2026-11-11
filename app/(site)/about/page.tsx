import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Photo } from '@/components/site/photo'
import { RichText } from '@/components/site/rich-text'
import { getContent } from '@/lib/queries'
import { lines } from '@/lib/format'

export const metadata: Metadata = {
  title: 'About us',
  description: 'Sea Shine is a local, island-based team on Huraa offering guesthouse stays, surf trips, excursions and a restaurant.',
}

export default async function AboutPage() {
  const { text, images } = await getContent('about')
  return (
    <>
      <PageHero eyebrow="About" title={text.hero_title} image={images.hero_image} compact />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-8">
          <RichText text={text.body} className="text-lg text-muted-foreground" />
          {lines(text.values).length > 0 && (
            <ul className="flex flex-col gap-3 rounded-2xl bg-sand p-6">
              {lines(text.values).map((v) => (
                <li key={v} className="flex items-start gap-3 leading-relaxed">
                  <Check className="mt-1 size-4 shrink-0 text-ocean" aria-hidden="true" />
                  {v}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Photo image={images.side_image} className="aspect-[4/5] self-start rounded-3xl" />
      </section>
    </>
  )
}

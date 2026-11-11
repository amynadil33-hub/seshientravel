import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/site/page-hero'
import { Photo } from '@/components/site/photo'
import { RichText } from '@/components/site/rich-text'
import { cta } from '@/components/site/cta'
import { getContent, getGallery } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Discover Huraa',
  description: 'Island life, beaches, mangroves and culture on Huraa, a local island in North Malé Atoll, Maldives.',
}

export default async function DiscoverPage() {
  const [{ text, images }, gallery] = await Promise.all([getContent('discover'), getGallery('huraa')])
  const chapters = [
    { title: text.life_title, body: text.life_body, image: images.life_image },
    { title: text.beaches_title, body: text.beaches_body, image: images.beaches_image },
    { title: text.culture_title, body: text.culture_body, image: images.culture_image },
  ]
  return (
    <>
      <PageHero eyebrow="Discover" title={text.hero_title} subtitle={text.hero_subtitle} image={images.hero_image} />
      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-5 py-16 md:gap-28 md:py-24">
        {chapters.map((c, i) => (
          <section key={c.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <Photo image={c.image} className={cn('aspect-[4/3] rounded-3xl', i % 2 === 1 && 'md:order-2')} />
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">{c.title}</h2>
              <RichText text={c.body} className="text-lg text-muted-foreground" />
            </div>
          </section>
        ))}
      </div>
      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[1fr_1.5fr] md:py-20">
          <h2 className="text-3xl font-bold md:text-4xl">Getting here & practical info</h2>
          <div className="flex flex-col gap-6">
            <RichText text={text.travel_info} className="text-lg text-navy-foreground/80" />
            <Link href="/contact" className={cta('primary', 'md', 'self-start')}>
              Ask about transfers
            </Link>
          </div>
        </div>
      </section>
      {gallery.length > 0 && (
        <section aria-label="Huraa photos" className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 py-16 md:grid-cols-4">
          {gallery.map((img) => (
            <Photo key={img.id} image={img} className="aspect-square rounded-2xl" sizes="(min-width: 768px) 25vw, 50vw" />
          ))}
        </section>
      )}
    </>
  )
}

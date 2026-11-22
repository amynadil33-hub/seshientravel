import type { Metadata } from 'next'
import { PageHero } from '@/components/site/page-hero'
import { Photo } from '@/components/site/photo'
import { getContent, getGallery } from '@/lib/queries'

const portraitPhotos = new Set([11, 12, 13, 14])

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos of Huraa island, surf trips, excursions and the Sea Shine restaurant.',
}

export default async function GalleryPage() {
  const [{ text }, gallery] = await Promise.all([getContent('gallery'), getGallery('gallery')])
  return (
    <>
      <PageHero eyebrow="Gallery" title={text.hero_title} subtitle={text.hero_subtitle} />
      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        {gallery.length === 0 ? (
          <p className="text-muted-foreground">Photos coming soon.</p>
        ) : (
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {gallery.map((img, index) => (
              <li key={img.id} className="mb-4 break-inside-avoid">
                <figure className="flex flex-col gap-2">
                  <Photo
                    image={img}
                    className={portraitPhotos.has(index) ? 'aspect-[4/5] rounded-2xl' : index % 5 === 0 ? 'aspect-square rounded-2xl' : 'aspect-[4/3] rounded-2xl'}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {img.caption && <figcaption className="text-sm text-muted-foreground">{img.caption}</figcaption>}
                </figure>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

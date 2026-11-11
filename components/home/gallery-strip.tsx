import Link from 'next/link'
import { Photo } from '@/components/site/photo'
import { SectionHeading } from '@/components/site/section-heading'
import { cta } from '@/components/site/cta'
import type { ResolvedImage } from '@/lib/queries'

export function GalleryStrip({ images }: { images: (ResolvedImage & { id: string })[] }) {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pb-20 md:pb-28">
      <SectionHeading
        eyebrow="Gallery"
        title="Moments from Huraa"
        action={
          <Link href="/gallery" className={cta('outline', 'sm')}>
            View gallery
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((img, i) => (
          <Photo
            key={img.id}
            image={img}
            className={i === 0 ? 'col-span-2 aspect-[2/1] rounded-2xl md:row-span-2 md:aspect-auto' : 'aspect-square rounded-2xl'}
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        ))}
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OfferDetail } from '@/components/site/offer-detail'
import { getMediaMap, getSurfPackage, toImage } from '@/lib/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getSurfPackage((await params).slug)
  return p ? { title: p.title, description: p.summary } : { title: 'Package not found' }
}

export default async function SurfPackagePage({ params }: Props) {
  const p = await getSurfPackage((await params).slug)
  if (!p) notFound()
  const media = await getMediaMap()
  return (
    <OfferDetail
      kind="surf"
      id={p.id}
      eyebrow="Surf package"
      title={p.title}
      summary={p.summary}
      description={p.description}
      durationLabel={p.duration_label}
      inclusions={p.inclusions}
      extraList={{ title: 'Accommodation options', items: p.accommodation_options }}
      priceFrom={p.price_from}
      priceNote={p.price_note}
      image={toImage(media, p.cover_media_id)}
      demo={p.is_demo}
      back={{ href: '/surf', label: 'All surf packages' }}
    />
  )
}

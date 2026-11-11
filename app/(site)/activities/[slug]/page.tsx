import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OfferDetail } from '@/components/site/offer-detail'
import { getActivity, getMediaMap, toImage } from '@/lib/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getActivity((await params).slug)
  return a ? { title: a.title, description: a.summary } : { title: 'Activity not found' }
}

export default async function ActivityPage({ params }: Props) {
  const a = await getActivity((await params).slug)
  if (!a) notFound()
  const media = await getMediaMap()
  return (
    <OfferDetail
      kind="activity"
      id={a.id}
      eyebrow="Activity"
      title={a.title}
      summary={a.summary}
      description={a.description}
      durationLabel={a.duration_label}
      inclusions={a.inclusions}
      priceFrom={a.price_from}
      priceNote={a.price_note}
      image={toImage(media, a.cover_media_id)}
      demo={a.is_demo}
      back={{ href: '/activities', label: 'All activities' }}
    />
  )
}

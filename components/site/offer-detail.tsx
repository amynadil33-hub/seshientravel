import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { RichText } from '@/components/site/rich-text'
import { DemoNotice } from '@/components/site/demo-badge'
import { EnquiryForm } from '@/components/site/enquiry-form'
import { money } from '@/lib/format'
import type { ResolvedImage } from '@/lib/queries'
import type { EnquiryKind } from '@/lib/types'

export function OfferDetail({
  kind,
  id,
  eyebrow,
  title,
  summary,
  description,
  durationLabel,
  inclusions,
  extraList,
  priceFrom,
  priceNote,
  image,
  demo,
  back,
}: {
  kind: EnquiryKind
  id: string
  eyebrow: string
  title: string
  summary: string
  description: string
  durationLabel: string
  inclusions: string[]
  extraList?: { title: string; items: string[] }
  priceFrom: number | null
  priceNote: string | null
  image: ResolvedImage | null
  demo: boolean
  back: { href: string; label: string }
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={summary} image={image} compact />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:py-20">
        <Link href={back.href} className="inline-flex items-center gap-2 self-start text-sm font-medium text-ocean hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {back.label}
        </Link>
        {demo && <DemoNotice>Sample listing with illustrative pricing. Edit or remove it in the admin area.</DemoNotice>}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-8">
            <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-sand p-5">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Duration</dt>
                <dd className="font-heading text-lg font-bold">{durationLabel}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Price</dt>
                <dd className="font-heading text-lg font-bold">{priceFrom !== null ? `From ${money(priceFrom)}` : 'On request'}</dd>
                {priceNote && <dd className="text-xs text-muted-foreground">{priceNote}</dd>}
              </div>
            </dl>
            <RichText text={description} className="text-lg text-muted-foreground" />
            {inclusions.length > 0 && <CheckList title="What's included" items={inclusions} />}
            {extraList && extraList.items.length > 0 && <CheckList title={extraList.title} items={extraList.items} />}
          </div>
          <section aria-labelledby="enquire-heading" className="flex flex-col gap-4 self-start rounded-2xl border border-border bg-card p-5 md:p-6 lg:sticky lg:top-24">
            <h2 id="enquire-heading" className="font-heading text-xl font-bold">
              Enquire about this
            </h2>
            <p className="text-sm text-muted-foreground">Send your dates and group size — we reply with availability and a quote.</p>
            <EnquiryForm kind={kind} subjectId={id} subjectTitle={title} dateLabel="Preferred start date" />
          </section>
        </div>
      </div>
    </>
  )
}

function CheckList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 leading-relaxed">
            <Check className="mt-1 size-4 shrink-0 text-ocean" aria-hidden="true" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

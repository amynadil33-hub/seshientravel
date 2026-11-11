import type { Metadata } from 'next'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { EnquiryForm } from '@/components/site/enquiry-form'
import { getContent, getSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Sea Shine on Huraa island — phone, WhatsApp, email and enquiry form.',
}

export default async function ContactPage() {
  const [{ text }, s] = await Promise.all([getContent('contact'), getSettings()])
  const wa = s.whatsapp.replace(/\D/g, '')
  const items = [
    s.phone && { icon: Phone, label: 'Phone', value: s.phone, href: `tel:${s.phone.replace(/\s/g, '')}` },
    wa && { icon: MessageCircle, label: 'WhatsApp', value: s.whatsapp, href: `https://wa.me/${wa}` },
    s.email && { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    s.address && { icon: MapPin, label: 'Address', value: s.address, href: s.map_link || null },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string | null }[]

  return (
    <>
      <PageHero eyebrow="Contact" title={text.hero_title} subtitle={text.hero_subtitle} />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1fr_1.4fr] md:py-16">
        <ul className="flex flex-col gap-5">
          {items.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-ocean">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
                {href ? (
                  <a href={href} className="font-medium hover:text-ocean" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {value}
                  </a>
                ) : (
                  <span className="font-medium">{value}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="pb-4 font-heading text-xl font-bold">Send us a message</h2>
          <EnquiryForm kind="contact" showParty={false} dateLabel="Travel dates (optional)" />
        </div>
      </section>
    </>
  )
}

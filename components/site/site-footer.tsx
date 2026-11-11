import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { getSettings } from '@/lib/queries'
import { NAV_LINKS } from '@/lib/site'

export async function SiteFooter() {
  const s = await getSettings()
  const social = [
    { href: s.instagram, label: 'Instagram' },
    { href: s.facebook, label: 'Facebook' },
  ].filter((x) => x.href)
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="font-heading text-2xl font-bold">{s.business_name}</p>
          <p className="max-w-sm leading-relaxed text-navy-foreground/75">{s.tagline}</p>
          <ul className="flex flex-col gap-2 text-sm text-navy-foreground/85">
            {s.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sunset" aria-hidden="true" />
                <span>{s.address}</span>
              </li>
            )}
            {s.phone && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-sunset" aria-hidden="true" />
                <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="hover:underline">
                  {s.phone}
                </a>
              </li>
            )}
            {s.email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-sunset" aria-hidden="true" />
                <a href={`mailto:${s.email}`} className="hover:underline">
                  {s.email}
                </a>
              </li>
            )}
          </ul>
        </div>
        <nav aria-label="Footer">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-navy-foreground/60">Explore</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-navy-foreground/85 hover:text-navy-foreground hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy-foreground/60">Info</p>
          <Link href="/booking-terms" className="text-navy-foreground/85 hover:underline">
            Booking terms
          </Link>
          <Link href="/privacy" className="text-navy-foreground/85 hover:underline">
            Privacy policy
          </Link>
          {social.map((x) => (
            <a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer" className="text-navy-foreground/85 hover:underline">
              {x.label}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-navy-foreground/60">
          {`© ${new Date().getFullYear()} ${s.business_name}. Huraa, North Malé Atoll, Maldives.`}
        </p>
      </div>
    </footer>
  )
}

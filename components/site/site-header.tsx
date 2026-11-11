import Image from 'next/image'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/site'
import { cta } from '@/components/site/cta'
import { MobileNav } from '@/components/site/mobile-nav'
import { NavLink } from '@/components/site/nav-link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex shrink-0 items-center rounded-md" aria-label="Sea Shine Travel & Tours — home">
          <Image src="/images/seashine-logo.png" alt="" width={96} height={48} className="h-10 w-auto" priority />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/guesthouses" className={cta('primary', 'sm', 'hidden sm:inline-flex')}>
            Book a stay
          </Link>
          <MobileNav links={NAV_LINKS.map((l) => ({ href: l.href, label: l.label }))} />
        </div>
      </div>
    </header>
  )
}

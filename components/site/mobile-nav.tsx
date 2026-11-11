'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cta } from '@/components/site/cta'
import { NavLink } from '@/components/site/nav-link'

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader>
          <SheetTitle className="font-heading">Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4" onClick={() => setOpen(false)}>
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} className="rounded-xl px-4 py-3 text-base">
              {link.label}
            </NavLink>
          ))}
          <Link href="/guesthouses" className={cta('primary', 'md', 'mt-4')}>
            Book a stay
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

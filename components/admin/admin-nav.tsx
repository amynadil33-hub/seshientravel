'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export type NavGroup = { label: string; items: { href: string; label: string; badge?: number }[] }

export function AdminNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))

  return (
    <nav aria-label="Admin" className="flex gap-6 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
      {groups.map((group) => (
        <div key={group.label} className="flex shrink-0 flex-col gap-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
          <ul className="flex gap-1 lg:flex-col">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  {item.label}
                  {!!item.badge && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 text-xs font-semibold',
                        isActive(item.href) ? 'bg-primary-foreground text-primary' : 'bg-accent text-accent-foreground',
                      )}
                    >
                      {item.badge}
                      <span className="sr-only"> need attention</span>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

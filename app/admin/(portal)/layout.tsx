import type { Metadata } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import { signOut } from '@/app/actions/admin'
import { AdminNav, type NavGroup } from '@/components/admin/admin-nav'
import { Button } from '@/components/ui/button'
import { COLLECTIONS } from '@/lib/admin/collections'
import { requireAdminPage } from '@/lib/auth'
import { getAdminDb } from '@/lib/dbs'
import type { Booking, Enquiry } from '@/lib/types'

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection()
  const session = await requireAdminPage()
  const db = await getAdminDb()
  const [pending, fresh] = await Promise.all([
    db.list<Booking>('bookings', { status: 'pending' }).catch(() => []),
    db.list<Enquiry>('enquiries', { status: 'new' }).catch(() => []),
  ])

  const groups: NavGroup[] = [
    {
      label: 'Inbox',
      items: [
        { href: '/admin', label: 'Overview' },
        { href: '/admin/bookings', label: 'Bookings', badge: pending.length },
        { href: '/admin/enquiries', label: 'Enquiries', badge: fresh.length },
      ],
    },
    ...(['Stays', 'Experiences', 'Restaurant'] as const).map((group) => ({
      label: group,
      items: COLLECTIONS.filter((c) => c.group === group).map((c) => ({ href: `/admin/c/${c.key}`, label: c.title })),
    })),
    {
      label: 'Website',
      items: [
        { href: '/admin/pages', label: 'Page content' },
        { href: '/admin/media', label: 'Photo library' },
        { href: '/admin/galleries', label: 'Galleries' },
      ],
    },
  ]

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-serif text-lg font-semibold">
            Sea Shine
            <span className="rounded-md bg-muted px-2 py-0.5 font-sans text-xs font-medium text-muted-foreground">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{session.email}</span>
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/" target="_blank" />}>
              View site
            </Button>
            {!session.demo && (
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            )}
          </div>
        </div>
        {session.demo && (
          <p className="bg-accent px-4 py-2 text-center text-sm text-accent-foreground">
            Preview mode: changes are kept in memory only and reset when the server restarts. Connect Supabase to save for real.
          </p>
        )}
      </header>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:flex-row lg:gap-10 lg:py-10">
        <aside className="lg:w-56 lg:shrink-0">
          <AdminNav groups={groups} />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col gap-8">{children}</main>
      </div>
    </div>
  )
}

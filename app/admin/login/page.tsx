import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/login-form'
import { Button } from '@/components/ui/button'
import { getAdminSession } from '@/lib/auth'
import { DEMO_MODE } from '@/lib/site'

export const metadata: Metadata = { title: 'Admin sign in', robots: { index: false, follow: false } }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, session] = await Promise.all([searchParams, getAdminSession()])
  if (session) redirect('/admin')
  const productionWithoutDb = DEMO_MODE && process.env.VERCEL_ENV === 'production'

  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col gap-1">
          <p className="font-serif text-xl font-semibold">Sea Shine Admin</p>
          <p className="text-sm text-muted-foreground">Manage bookings, enquiries and website content.</p>
        </div>
        {productionWithoutDb ? (
          <p className="text-sm leading-relaxed text-destructive">
            The admin portal is disabled until the database is connected for this deployment.
          </p>
        ) : DEMO_MODE ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              No database is connected, so this preview runs on sample data with an open demo admin.
            </p>
            <Button nativeButton={false} render={<Link href="/admin" />}>Open demo admin</Button>
          </div>
        ) : (
          <LoginForm initialError={error === 'unauthorized' ? 'Please sign in with an admin account.' : undefined} />
        )}
        <Link href="/" className="text-center text-sm text-muted-foreground hover:text-foreground">
          Back to website
        </Link>
      </div>
    </main>
  )
}

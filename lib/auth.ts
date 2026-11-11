import { redirect } from 'next/navigation'
import { DEMO_MODE } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

export type AdminSession = { demo: boolean; email: string }

export async function getAdminSession(): Promise<AdminSession | null> {
  // Demo admin (in-memory data) is never exposed on a production deployment without Supabase.
  if (DEMO_MODE) return process.env.VERCEL_ENV === 'production' ? null : { demo: true, email: 'demo@preview' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!data) return null
  return { demo: false, email: user.email ?? '' }
}

/** Use in admin pages. */
export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login?error=unauthorized')
  return session
}

/** Use in admin server actions. */
export async function requireAdminAction(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) throw new Error('Not authorised')
  return session
}

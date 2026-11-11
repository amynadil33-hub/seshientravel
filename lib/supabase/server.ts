import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { createClient as createPlainClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Session-aware client (admin portal). Respects RLS as the signed-in user. */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(url(), anonKey(), {
    cookieOptions: { secure: process.env.NODE_ENV === 'production' },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component; the proxy refreshes the session.
        }
      },
    },
  })
}

/** Anonymous client for public reads. Only sees published rows via RLS. */
export function createPublicClient() {
  return createPlainClient(url(), anonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** Service-role client. Server-only: bypasses RLS for validated server actions. */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createPlainClient(url(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

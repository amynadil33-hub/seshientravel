import { demoDb, supabaseDb, type Db } from '@/lib/db'
import { DEMO_MODE } from '@/lib/site'
import { createClient, createPublicClient, createServiceClient } from '@/lib/supabase/server'

/** Public reads (published content only, enforced by RLS + query filters). */
export function getPublicDb(): Db {
  return DEMO_MODE ? demoDb() : supabaseDb(createPublicClient())
}

/** Privileged server-side writes after validation (booking requests, enquiries, availability). */
export function getServiceDb(): Db | null {
  if (DEMO_MODE) return demoDb()
  const client = createServiceClient()
  return client ? supabaseDb(client) : null
}

/** Admin portal: acts as the signed-in user so RLS `is_admin()` policies apply. */
export async function getAdminDb(): Promise<Db> {
  if (DEMO_MODE) return demoDb()
  return supabaseDb(await createClient())
}

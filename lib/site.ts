export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

export const isServiceRoleConfigured = Boolean(
  isSupabaseConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY,
)

export const DEMO_MODE = !isSupabaseConfigured

export const CURRENCY = 'USD'

export const NAV_LINKS = [
  { href: '/discover-huraa', label: 'Discover Huraa' },
  { href: '/guesthouses', label: 'Guesthouses' },
  { href: '/surf', label: 'Surf' },
  { href: '/activities', label: 'Activities' },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

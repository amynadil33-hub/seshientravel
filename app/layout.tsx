import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sea Shine Travel & Tours | Huraa, Maldives',
    template: '%s | Sea Shine Huraa',
  },
  description:
    'Your Huraa adventure starts here. Partner guesthouse stays, surf packages, island activities and the Sea Shine restaurant on Huraa, North Malé Atoll, Maldives.',
  openGraph: {
    type: 'website',
    siteName: 'Sea Shine Travel & Tours',
    title: 'Sea Shine Travel & Tours | Huraa, Maldives',
    description:
      'Partner guesthouse stays, surf packages, island activities and the Sea Shine restaurant on Huraa, Maldives.',
    images: ['/images/hero-huraa.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0d2438',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${manrope.variable} bg-background`}>
      <body className="font-sans">
        {children}
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

import Link from 'next/link'
import { cta } from '@/components/site/cta'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-start gap-5 px-5 py-24 md:py-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-ocean">404</p>
      <h1 className="text-4xl font-bold text-balance md:text-5xl">This page drifted out to sea</h1>
      <p className="text-lg text-muted-foreground">The page you are looking for may have moved. Try one of these instead.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className={cta('primary', 'md')}>
          Home
        </Link>
        <Link href="/guesthouses" className={cta('outline', 'md')}>
          Guesthouses
        </Link>
      </div>
    </section>
  )
}

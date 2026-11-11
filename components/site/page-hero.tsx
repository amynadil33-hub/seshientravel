import Image from 'next/image'
import type { ResolvedImage } from '@/lib/queries'
import { cn } from '@/lib/utils'

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
  compact,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  image?: ResolvedImage | null
  children?: React.ReactNode
  compact?: boolean
}) {
  if (!image) {
    return (
      <section className="bg-sand">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pt-14 pb-14 md:pt-20">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-ocean">{eyebrow}</p>}
          <h1 className="max-w-3xl text-4xl font-bold text-balance md:text-6xl">{title}</h1>
          {subtitle && <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">{subtitle}</p>}
          {children}
        </div>
      </section>
    )
  }
  return (
    <section className={cn('relative isolate flex items-end overflow-hidden bg-navy', compact ? 'min-h-[58svh]' : 'min-h-[72svh]')}>
      <Image src={image.url} alt={image.alt} fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/45 to-navy/20" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 pt-24 pb-12 text-navy-foreground md:pb-16">
        {eyebrow && <p className="reveal text-sm font-semibold uppercase tracking-widest text-sunset">{eyebrow}</p>}
        <h1 className="reveal reveal-1 max-w-3xl text-4xl font-bold text-balance md:text-6xl">{title}</h1>
        {subtitle && <p className="reveal reveal-2 max-w-2xl text-lg leading-relaxed text-pretty text-navy-foreground/85">{subtitle}</p>}
        {children && <div className="reveal reveal-3">{children}</div>}
      </div>
    </section>
  )
}

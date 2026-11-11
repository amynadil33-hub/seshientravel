import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AdminPageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string
  description?: string
  back?: { href: string; label: string }
  actions?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1">
        {back && (
          <Link href={back.href} className="text-sm text-muted-foreground hover:text-foreground">
            {'← '}
            {back.label}
          </Link>
        )}
        <h1 className="font-serif text-2xl font-semibold text-balance md:text-3xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

const PILL: Record<string, string> = {
  pending: 'bg-accent text-accent-foreground',
  new: 'bg-accent text-accent-foreground',
  confirmed: 'bg-primary text-primary-foreground',
  published: 'bg-primary text-primary-foreground',
  paid: 'bg-primary text-primary-foreground',
  in_progress: 'bg-secondary text-secondary-foreground',
  deposit_paid: 'bg-secondary text-secondary-foreground',
  declined: 'bg-destructive/10 text-destructive',
  cancelled: 'bg-destructive/10 text-destructive',
  refunded: 'bg-destructive/10 text-destructive',
}

export function StatusPill({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize whitespace-nowrap',
        PILL[value] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {value.replace('_', ' ')}
    </span>
  )
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'success' | 'error'; children: React.ReactNode }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-lg border px-4 py-3 text-sm leading-relaxed',
        tone === 'error' && 'border-destructive/30 bg-destructive/5 text-destructive',
        tone === 'success' && 'border-primary/30 bg-primary/5 text-foreground',
        tone === 'info' && 'border-border bg-muted text-foreground',
      )}
    >
      {children}
    </div>
  )
}

export function Panel({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('flex flex-col gap-4 rounded-xl border border-border bg-card p-5', className)}>
      {title && <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>}
      {children}
    </section>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">{children}</p>
}

export const inputClass =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

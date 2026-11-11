import { cn } from '@/lib/utils'

export function DemoBadge({ className, label = 'Demo content' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-sunset/50 bg-sunset/15 px-2.5 py-0.5 text-xs font-semibold text-foreground',
        className,
      )}
    >
      {label}
    </span>
  )
}

export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-sunset/40 bg-sunset/10 px-4 py-3 text-sm leading-relaxed text-foreground">
      <strong className="font-semibold">Demo preview: </strong>
      {children}
    </p>
  )
}

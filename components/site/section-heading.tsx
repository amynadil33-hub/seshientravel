import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
  action,
}: {
  eyebrow?: string
  title: string
  intro?: string
  className?: string
  action?: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="flex max-w-2xl flex-col gap-3">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-ocean">{eyebrow}</p>}
        <h2 className="text-3xl font-bold text-balance md:text-4xl">{title}</h2>
        {intro && <p className="leading-relaxed text-pretty text-muted-foreground">{intro}</p>}
      </div>
      {action}
    </div>
  )
}

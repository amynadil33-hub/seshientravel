import { cn } from '@/lib/utils'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0'

const variants = {
  primary: 'bg-sunset text-sunset-foreground hover:bg-sunset/90',
  navy: 'bg-navy text-navy-foreground hover:bg-navy/90',
  ocean: 'bg-ocean text-ocean-foreground hover:bg-ocean/90',
  outline: 'border border-navy/20 bg-transparent text-foreground hover:bg-navy/5',
  light: 'border border-navy-foreground/40 bg-navy-foreground/10 text-navy-foreground backdrop-blur hover:bg-navy-foreground/20',
} as const

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
} as const

export function cta(variant: keyof typeof variants = 'primary', size: keyof typeof sizes = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

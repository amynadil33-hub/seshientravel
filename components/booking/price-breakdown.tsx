import { money, formatDate } from '@/lib/format'
import type { PriceBreakdown } from '@/lib/types'

export function PriceBreakdownView({ breakdown }: { breakdown: PriceBreakdown }) {
  const nights = breakdown.nights.length
  const groups = new Map<string, { label: string; rate: number; count: number; first: string }>()
  for (const n of breakdown.nights) {
    const key = `${n.label}|${n.rate}`
    const g = groups.get(key)
    if (g) g.count++
    else groups.set(key, { label: n.label, rate: n.rate, count: 1, first: n.date })
  }
  const c = breakdown.currency
  return (
    <dl className="flex flex-col gap-2 text-sm">
      {[...groups.values()].map((g) => (
        <div key={`${g.label}-${g.first}`} className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">
            {`${g.count} night${g.count > 1 ? 's' : ''} × ${money(g.rate, c)}`}
            {breakdown.units > 1 && ` × ${breakdown.units} rooms`}
            <span className="block text-xs">{g.label === 'Standard rate' ? `from ${formatDate(g.first)}` : g.label}</span>
          </dt>
          <dd className="tabular-nums">{money(g.rate * g.count * breakdown.units, c)}</dd>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-t border-border pt-2">
        <dt>{`Accommodation (${nights} night${nights > 1 ? 's' : ''})`}</dt>
        <dd className="tabular-nums">{money(breakdown.accommodation, c)}</dd>
      </div>
      {breakdown.fees.map((f) => (
        <div key={f.label} className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{f.label}</dt>
          <dd className="tabular-nums">{money(f.amount, c)}</dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
        <dt className="font-heading text-base font-bold">Estimated total</dt>
        <dd className="font-heading text-xl font-bold tabular-nums">{money(breakdown.total, c)}</dd>
      </div>
    </dl>
  )
}

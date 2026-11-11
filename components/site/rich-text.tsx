import { cn } from '@/lib/utils'

/** Plain-text renderer: blank lines split paragraphs, lines starting with "# " become headings. */
export function RichText({ text, className }: { text: string | null | undefined; className?: string }) {
  const blocks = (text ?? '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return (
    <div className={cn('flex flex-col gap-4 leading-relaxed text-pretty', className)}>
      {blocks.map((block, i) => {
        const [first, ...rest] = block.split('\n')
        if (first.startsWith('# ')) {
          return (
            <div key={i} className="flex flex-col gap-2">
              <h2 className="pt-2 text-xl font-bold">{first.slice(2)}</h2>
              {rest.length > 0 && <p>{rest.join(' ')}</p>}
            </div>
          )
        }
        return <p key={i}>{block.replace(/\n/g, ' ')}</p>
      })}
    </div>
  )
}

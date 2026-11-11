import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import type { ResolvedImage } from '@/lib/queries'
import { cn } from '@/lib/utils'

export function Photo({
  image,
  className,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority,
}: {
  image: ResolvedImage | null | undefined
  className?: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {image ? (
        <Image src={image.url} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground" aria-hidden="true">
          <ImageIcon className="size-8" />
        </div>
      )}
    </div>
  )
}

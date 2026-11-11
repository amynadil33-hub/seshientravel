import { RichText } from '@/components/site/rich-text'
import { getContent } from '@/lib/queries'

export async function LegalPage({ page, title }: { page: 'privacy' | 'terms'; title: string }) {
  const { text } = await getContent(page)
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-16 md:py-24">
      <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
      <RichText text={text.body} className="text-muted-foreground" />
    </article>
  )
}

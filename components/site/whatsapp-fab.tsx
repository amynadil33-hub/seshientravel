import { MessageCircle } from 'lucide-react'
import { getSettings } from '@/lib/queries'

export async function WhatsAppFab() {
  const { whatsapp } = await getSettings()
  const digits = whatsapp.replace(/\D/g, '')
  if (!digits) return null
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-ocean px-5 text-sm font-semibold text-ocean-foreground shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span>WhatsApp us</span>
    </a>
  )
}

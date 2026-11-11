import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'

export const metadata: Metadata = { title: 'Booking terms' }

export default function TermsPage() {
  return <LegalPage page="terms" title="Booking terms" />
}

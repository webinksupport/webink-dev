import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import SuccessContent from './SuccessContent'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Order Confirmed | Webink Solutions',
  description: 'Your order has been confirmed. Welcome to Webink Solutions managed services.',
  robots: { index: false, follow: false },
}

interface CheckoutSuccessProps {
  searchParams: Promise<{ session_id?: string; product?: string; tier?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessProps) {
  const sp = await searchParams

  return (
    <main className="bg-[#0A0A0A] text-white font-urbanist antialiased overflow-x-hidden min-h-screen">
      <NavI />
      <SuccessContent sessionId={sp.session_id} />
      <FooterI />
    </main>
  )
}

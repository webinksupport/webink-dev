import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import PricingContent from './PricingContent'

export const metadata: Metadata = {
  title: 'Pricing — Digital Marketing Services | Webink Solutions',
  description:
    'Transparent pricing for web hosting, SEO, social media marketing, and more. Sarasota & Tampa digital marketing plans starting at $31/mo.',
}

export default function PricingPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <PricingContent />
      <FooterI />
    </main>
  )
}

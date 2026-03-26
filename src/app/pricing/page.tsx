import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import PricingContent from './PricingContent'
import { getPageContent } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Pricing — Digital Marketing Services | Webink Solutions',
  description:
    'Transparent pricing for web hosting, SEO, social media marketing, and more. Sarasota & Tampa digital marketing plans starting at $31/mo.',
  keywords: ['web design pricing Sarasota', 'SEO pricing Florida', 'digital marketing costs', 'website hosting prices'],
  openGraph: {
    title: 'Pricing — Digital Marketing Services | Webink Solutions',
    description: 'Transparent pricing for web hosting, SEO, social media, and more. Plans starting at $31/mo.',
    url: 'https://webink.solutions/pricing',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default async function PricingPage() {
  const content = await getPageContent('pricing')

  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <PricingContent content={content} />
      <FooterI />
    </main>
  )
}

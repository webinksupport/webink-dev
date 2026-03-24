import NavI from '@/components/variant-i/NavI'
import HeroI from '@/components/variant-i/HeroI'
import MarqueeI from '@/components/variant-i/MarqueeI'
import ServicesI from '@/components/variant-i/ServicesI'
import AboutI from '@/components/variant-i/AboutI'
import FounderI from '@/components/variant-i/FounderI'
import LocalI from '@/components/variant-i/LocalI'
import StatsI from '@/components/variant-i/StatsI'
import TestimonialsI from '@/components/variant-i/TestimonialsI'
import PricingI from '@/components/variant-i/PricingI'
import CTAI from '@/components/variant-i/CTAI'
import FooterI from '@/components/variant-i/FooterI'
import { getPageContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Digital Marketing Agency Sarasota | Webink Solutions',
  description:
    'Webink Solutions is Sarasota\'s premiere digital marketing agency — web design, SEO, paid ads, social media & hosting for local businesses in Sarasota, Tampa & Bradenton, FL.',
  openGraph: {
    title: 'Digital Marketing Agency Sarasota | Webink Solutions',
    description:
      'Web design, SEO, and digital marketing for local businesses in Sarasota, Tampa & Bradenton. Real results from a local team.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Agency Sarasota | Webink Solutions',
  },
}

export default async function HomePage() {
  const content = await getPageContent('home')

  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <HeroI content={content} />
      <MarqueeI />
      <ServicesI />
      <AboutI />
      <FounderI />
      <LocalI />
      <StatsI />
      <TestimonialsI />
      <PricingI />
      <CTAI />
      <FooterI />
    </main>
  )
}

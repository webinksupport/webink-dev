import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicesHubContent from './ServicesHubContent'

export const metadata: Metadata = {
  title: 'Digital Marketing Services Sarasota | Webink Solutions',
  description:
    'Full-service digital marketing agency in Sarasota, FL — web design, SEO, social media, PPC, AI marketing, and custom CRM development for Tampa & Bradenton businesses.',
  openGraph: {
    title: 'Digital Marketing Services Sarasota | Webink Solutions',
    description:
      'Web design, SEO, social media, PPC, and AI-powered marketing services in Sarasota, Tampa & Bradenton.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default function ServicesPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicesHubContent />
      <FooterI />
    </main>
  )
}

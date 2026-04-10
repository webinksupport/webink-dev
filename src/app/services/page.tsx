import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicesHubContent from './ServicesHubContent'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageContent } from '@/lib/content'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Digital Marketing Services Sarasota & Tampa | Webink Solutions',
  description:
    'Full-service digital marketing: web design, SEO, social media, PPC, hosting, AI marketing, and custom CRM. Serving Sarasota, Tampa & Bradenton.',
  keywords: ['digital marketing services Sarasota', 'web design Tampa', 'SEO services Florida', 'social media marketing Bradenton'],
  openGraph: {
    title: 'Digital Marketing Services | Webink Solutions',
    description:
      'Web design, SEO, social media, PPC, and more for Florida businesses.',
    url: 'https://webink.solutions/services',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default async function ServicesPage() {
  const content = await getPageContent('services')

  return (
    <PageEditorWrapper pageSlug="services" initialContent={content}>
      <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
        <NavI />
        <ServicesHubContent />
        <FooterI />
      </main>
    </PageEditorWrapper>
  )
}

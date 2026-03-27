import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import { getPageContent } from '@/lib/content'
import ContactContent from './ContactContent'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact Webink Solutions | Sarasota Digital Marketing Agency',
  description:
    'Get in touch with Webink Solutions — Sarasota\'s premiere digital marketing agency. Call (941) 840-1381 or fill out our contact form for a free consultation.',
  keywords: ['web design agency Sarasota FL', 'contact Webink Solutions', 'digital marketing consultation Sarasota', 'free web design quote'],
  openGraph: {
    title: 'Contact Webink Solutions | Sarasota Digital Marketing Agency',
    description: 'Get a free consultation from Webink Solutions — web design, SEO, and digital marketing in Sarasota, FL.',
    url: 'https://webink.solutions/contact',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default async function ContactPage() {
  const content = await getPageContent('contact')

  return (
    <PageEditorWrapper pageSlug="contact" initialContent={content}>
      <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
        <NavI />
        <ContactContent content={content} />
        <FooterI />
      </main>
    </PageEditorWrapper>
  )
}

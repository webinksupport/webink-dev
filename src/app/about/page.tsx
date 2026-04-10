import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import { getPageContent } from '@/lib/content'
import AboutContent from './AboutContent'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'About Webink Solutions | Sarasota Digital Marketing Agency',
  description:
    'Meet Sean Rowe and the Webink Solutions team — a Sarasota-based digital agency founded on real results. From firefighter to agency founder, we bring grit and strategy to every project.',
  keywords: ['Webink Solutions Sarasota', 'Sean Rowe web designer', 'digital marketing agency Florida', 'Sarasota web design company'],
  openGraph: {
    title: 'About Webink Solutions | Sarasota Digital Marketing Agency',
    description: 'Meet the team behind Webink Solutions — Sarasota\'s premiere digital agency.',
    url: 'https://webink.solutions/about',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default async function AboutPage() {
  const content = await getPageContent('about')

  return (
    <PageEditorWrapper pageSlug="about" initialContent={content}>
      <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
        <NavI />
        <AboutContent content={content} />
        <FooterI />
      </main>
    </PageEditorWrapper>
  )
}

import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageContent } from '@/lib/content'
import PortfolioContent from './PortfolioContent'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Portfolio — Our Work | Webink Solutions',
  description: 'See real results from Webink Solutions — web design, SEO, and digital marketing projects for businesses in Sarasota, Tampa, and Bradenton.',
}

export default async function PortfolioPage() {
  const content = await getPageContent('portfolio')

  return (
    <PageEditorWrapper pageSlug="portfolio" initialContent={content}>
      <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
        <NavI />
        <PortfolioContent />
        <FooterI />
      </main>
    </PageEditorWrapper>
  )
}

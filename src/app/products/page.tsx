import type { Metadata } from 'next'
import Link from 'next/link'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageContent } from '@/lib/content'
import { prisma } from '@/lib/prisma'
import ProductsContent from './ProductsContent'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Products & Plans — Digital Marketing Solutions | Webink Solutions',
  description:
    'Browse web hosting, SEO, social media marketing, PPC, and more. Transparent pricing for Sarasota, Tampa & Bradenton businesses.',
  openGraph: {
    title: 'Products & Plans | Webink Solutions',
    description:
      'Transparent pricing for web hosting, SEO, social media marketing, and digital growth solutions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default async function ProductsPage() {
  const content = await getPageContent('products')
  const products = await prisma.product.findMany({
    where: { active: true, status: 'ACTIVE' },
    include: { variants: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <PageEditorWrapper pageSlug="products" initialContent={content}>
      <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
        <NavI />
        <ProductsContent products={JSON.parse(JSON.stringify(products))} />
        <FooterI />
      </main>
    </PageEditorWrapper>
  )
}

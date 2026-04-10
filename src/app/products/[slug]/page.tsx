import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ProductPageClient from './ProductPageClient'
import { prisma } from '@/lib/prisma'
import { getProductContent, type TierKey } from '@/lib/product-content'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tier?: string; billing?: string; checkout?: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findFirst({
    where: { slug, active: true, status: 'ACTIVE' },
  })

  if (!product) {
    return { title: 'Product Not Found | Webink Solutions' }
  }

  const description = product.shortDescription || product.description
  const truncatedDesc =
    description.length > 160 ? description.slice(0, 160).trimEnd() + '...' : description

  return {
    title: `${product.name} — Webink Solutions`,
    description: truncatedDesc,
    openGraph: {
      title: `${product.name} | Webink Solutions`,
      description: truncatedDesc,
      type: 'website',
      locale: 'en_US',
      siteName: 'Webink Solutions',
    },
  }
}

const VALID_TIERS: TierKey[] = ['basic', 'pro', 'ultimate']

export default async function ProductDetailPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params
  const sp = await searchParams

  let product
  try {
    product = await prisma.product.findFirst({
      where: { slug, active: true, status: 'ACTIVE' },
      include: { variants: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
    })
  } catch (err) {
    console.error('Product page DB error:', err)
    throw err
  }

  if (!product) notFound()

  // Read URL params for preselection
  const initialTier: TierKey = VALID_TIERS.includes(sp.tier as TierKey)
    ? (sp.tier as TierKey)
    : 'basic'
  const initialBilling: 'monthly' | 'annual' = sp.billing === 'annual' ? 'annual' : 'monthly'
  const openCheckout = sp.checkout === 'pending'

  // Get rich content config for this product
  const content = getProductContent(slug)

  return (
    <main className="bg-[#0A0A0A] text-white font-urbanist antialiased overflow-x-hidden">
      <NavI />

      <ProductPageClient
        product={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          category: product.category,
          setupFee: product.setupFee,
          type: product.type,
        }}
        variants={product.variants.map(v => ({
          id: v.id,
          name: v.name,
          priceMonthly: v.priceMonthly,
          priceAnnual: v.priceAnnual,
          priceOneTime: v.priceOneTime,
          salePrice: v.salePrice,
          setupFee: v.setupFee,
          billingInterval: v.billingInterval,
          contactOnly: v.contactOnly,
          stripePriceId: v.stripePriceId,
        }))}
        content={content}
        initialTier={initialTier}
        initialBilling={initialBilling}
        openCheckout={openCheckout}
      />

      <FooterI />
    </main>
  )
}

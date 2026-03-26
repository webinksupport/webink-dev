import type { Metadata } from 'next'
import Link from 'next/link'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import { prisma } from '@/lib/prisma'

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

function formatPrice(cents: number | null): string {
  if (cents === null) return '—'
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

const categoryLabels: Record<string, string> = {
  hosting: 'Web Hosting',
  seo: 'Search Engine Optimization',
  social: 'Social Media Marketing',
  video: 'Video Marketing',
  advertising: 'Paid Advertising',
  'web-design': 'Web Design',
  crm: 'Custom CRM & SaaS',
  other: 'Additional Services',
}

const categoryOrder = ['web-design', 'hosting', 'seo', 'social', 'video', 'advertising', 'crm', 'other']

const typeLabels: Record<string, string> = {
  SIMPLE: 'One-Time',
  SUBSCRIPTION: 'Subscription',
  VARIABLE: 'Variable',
  VARIABLE_SUBSCRIPTION: 'Subscription',
  ONE_TIME: 'One-Time',
}

const typeBadgeColors: Record<string, string> = {
  SIMPLE: 'bg-[#14EAEA]/10 text-[#0e9d9d]',
  SUBSCRIPTION: 'bg-[#F813BE]/10 text-[#c00f96]',
  VARIABLE: 'bg-[#14EAEA]/10 text-[#0e9d9d]',
  VARIABLE_SUBSCRIPTION: 'bg-[#F813BE]/10 text-[#c00f96]',
  ONE_TIME: 'bg-[#14EAEA]/10 text-[#0e9d9d]',
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true, status: 'ACTIVE' },
    include: { variants: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  })

  // Group products by category
  const grouped: Record<string, typeof products> = {}
  for (const product of products) {
    const cat = product.category || 'other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(product)
  }

  // Sort categories by predefined order
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const aIdx = categoryOrder.indexOf(a)
    const bIdx = categoryOrder.indexOf(b)
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx)
  })

  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />

      {/* Hero Header */}
      <section className="bg-[#0F0F0F] pt-36 pb-20 lg:pb-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4">
            Our Products
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Solutions for Every Business
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            From managed web hosting to full-service SEO and social media marketing,
            we have the tools and expertise to grow your business online.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 md:px-16 lg:px-24 py-20 lg:py-32 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto">
          {sortedCategories.map((category, catIdx) => (
            <div key={category} className={catIdx > 0 ? 'mt-20' : ''}>
              <p
                className={`text-xs font-bold tracking-[3px] uppercase mb-3 ${
                  catIdx % 2 === 0 ? 'text-[#14EAEA]' : 'text-[#F813BE]'
                }`}
              >
                {categoryLabels[category] || category}
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-10">
                {categoryLabels[category] || category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {grouped[category].map((product) => {
                  // Determine price display
                  const cheapestVariant = product.variants[0]
                  let priceDisplay = 'Contact for Pricing'
                  let priceSuffix = ''

                  if (cheapestVariant) {
                    if (cheapestVariant.contactOnly) {
                      priceDisplay = 'Contact for Pricing'
                    } else if (cheapestVariant.salePrice !== null) {
                      priceDisplay = formatPrice(cheapestVariant.salePrice)
                      priceSuffix =
                        cheapestVariant.billingInterval === 'ONE_TIME' ? '' : '/mo'
                    } else if (cheapestVariant.priceMonthly !== null) {
                      priceDisplay = formatPrice(cheapestVariant.priceMonthly)
                      priceSuffix = '/mo'
                    } else if (cheapestVariant.priceOneTime !== null) {
                      priceDisplay = formatPrice(cheapestVariant.priceOneTime)
                    } else if (cheapestVariant.priceAnnual !== null) {
                      priceDisplay = formatPrice(cheapestVariant.priceAnnual)
                      priceSuffix = '/yr'
                    }
                  }

                  const hasMultipleVariants = product.variants.length > 1
                  const description =
                    product.shortDescription || product.description || ''
                  const truncatedDesc =
                    description.length > 120
                      ? description.slice(0, 120).trimEnd() + '...'
                      : description

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="bg-white border border-[#E5E5E5] rounded-2xl p-8
                        hover:border-[#14EAEA] hover:shadow-[0_8px_40px_rgba(20,234,234,0.15)]
                        transition-all duration-300 flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h3 className="text-xl font-bold text-[#1A1A1A]">
                          {product.name}
                        </h3>
                        <span
                          className={`text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full whitespace-nowrap ${
                            typeBadgeColors[product.type] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {typeLabels[product.type] || product.type}
                        </span>
                      </div>

                      <p className="text-[16px] leading-relaxed text-[#333333] mb-6 flex-1">
                        {truncatedDesc}
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1 mb-4">
                          {priceDisplay === 'Contact for Pricing' ? (
                            <span className="text-[#F813BE] font-semibold text-lg">
                              Contact for Pricing
                            </span>
                          ) : (
                            <>
                              <span className="text-3xl font-bold text-[#1A1A1A]">
                                {priceDisplay}
                              </span>
                              {priceSuffix && (
                                <span className="text-[#333333] text-sm">
                                  {priceSuffix}
                                </span>
                              )}
                              {hasMultipleVariants && (
                                <span className="text-[#333333] text-sm ml-1">
                                  starting
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <span className="inline-flex items-center text-[#14EAEA] font-semibold text-sm">
                          View Details
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#333333] text-lg">
                No products available at this time. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0F0F0F] px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4">
            Get Started
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Not Sure Which Plan Is Right for You?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Let us help you find the perfect solution for your business.
            Schedule a free consultation and we will build a custom plan tailored to your goals.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full
              hover:bg-[#d10fa3] transition-colors duration-200"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </section>

      <FooterI />
    </main>
  )
}

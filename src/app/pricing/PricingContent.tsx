'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useEditor } from '@/components/editor/EditorContext'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProductVariant {
  id: string
  productId: string
  name: string
  priceMonthly: number | null
  priceAnnual: number | null
  priceOneTime: number | null
  salePrice: number | null
  billingInterval: string
  stripePriceId: string | null
  stripeProductId: string | null
  contactOnly: boolean
  active: boolean
  sortOrder: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  type: 'ONE_TIME' | 'SUBSCRIPTION' | 'SIMPLE' | 'VARIABLE' | 'VARIABLE_SUBSCRIPTION'
  active: boolean
  sortOrder: number
  variants: ProductVariant[]
}

/* ------------------------------------------------------------------ */
/*  Fallback data (shown when DB is empty or API fails)                */
/* ------------------------------------------------------------------ */

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fb-hosting',
    name: 'Managed Web Hosting',
    slug: 'managed-web-hosting',
    description:
      'Fast, secure, fully managed WordPress & Next.js hosting with daily backups, SSL, and 24/7 monitoring.',
    category: 'hosting',
    type: 'SUBSCRIPTION',
    active: true,
    sortOrder: 0,
    variants: [
      { id: 'fb-h1', productId: 'fb-hosting', name: 'Basic - Monthly', priceMonthly: 3100, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 0 },
      { id: 'fb-h2', productId: 'fb-hosting', name: 'Pro - Monthly', priceMonthly: 3900, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 1 },
      { id: 'fb-h3', productId: 'fb-hosting', name: 'Ultimate - Monthly', priceMonthly: 5900, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 2 },
    ],
  },
  {
    id: 'fb-seo',
    name: 'Fully Managed SEO',
    slug: 'fully-managed-seo',
    description:
      'Comprehensive search engine optimization — keyword research, on-page, technical SEO, link building, and monthly reporting.',
    category: 'seo',
    type: 'SUBSCRIPTION',
    active: true,
    sortOrder: 1,
    variants: [
      { id: 'fb-s1', productId: 'fb-seo', name: 'Basic', priceMonthly: 110300, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 0 },
      { id: 'fb-s2', productId: 'fb-seo', name: 'Pro', priceMonthly: 149300, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 1 },
      { id: 'fb-s3', productId: 'fb-seo', name: 'Ultimate', priceMonthly: 199300, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 2 },
    ],
  },
  {
    id: 'fb-social',
    name: 'Social Media Marketing',
    slug: 'social-media-marketing',
    description:
      'Done-for-you social media management — content creation, scheduling, engagement, and analytics across all platforms.',
    category: 'social',
    type: 'SUBSCRIPTION',
    active: true,
    sortOrder: 2,
    variants: [
      { id: 'fb-sm1', productId: 'fb-social', name: 'Basic', priceMonthly: 49300, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 0 },
      { id: 'fb-sm2', productId: 'fb-social', name: 'Pro', priceMonthly: 79300, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 1 },
      { id: 'fb-sm3', productId: 'fb-social', name: 'Ultimate', priceMonthly: 99300, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 2 },
    ],
  },
  {
    id: 'fb-lsa',
    name: 'Google Local Service Ads (LSA) Management & Optimization',
    slug: 'google-lsa-management',
    description:
      'Secure top-of-Google placement and qualified leads with professional management of your Local Service Ads.',
    category: 'other',
    type: 'SUBSCRIPTION',
    active: true,
    sortOrder: 3,
    variants: [
      { id: 'fb-lsa1', productId: 'fb-lsa', name: 'Monthly Management', priceMonthly: 25000, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 0 },
    ],
  },
  {
    id: 'fb-gbp',
    name: 'Google Business Profile Optimization',
    slug: 'google-business-profile-optimization',
    description:
      'One-time, comprehensive optimization of your Google Business Profile for maximum local search visibility.',
    category: 'other',
    type: 'ONE_TIME',
    active: true,
    sortOrder: 4,
    variants: [
      { id: 'fb-gbp1', productId: 'fb-gbp', name: 'Full Optimization', priceMonthly: null, priceAnnual: null, priceOneTime: 20000, salePrice: null, billingInterval: 'ONE_TIME', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 0 },
    ],
  },
  {
    id: 'fb-seoprimer',
    name: 'SEO Primer',
    slug: 'seo-primer',
    description:
      'A foundational SEO audit and implementation package — perfect for businesses just getting started with search.',
    category: 'seo',
    type: 'ONE_TIME',
    active: true,
    sortOrder: 5,
    variants: [
      { id: 'fb-sp1', productId: 'fb-seoprimer', name: 'SEO Primer', priceMonthly: null, priceAnnual: null, priceOneTime: 65300, salePrice: 55300, billingInterval: 'ONE_TIME', stripePriceId: null, stripeProductId: null, contactOnly: false, active: true, sortOrder: 0 },
    ],
  },
  {
    id: 'fb-ppc',
    name: 'Paid Advertising',
    slug: 'paid-advertising',
    description:
      'Expert pay-per-click campaign management across Google Ads, Meta Ads, and more. Custom pricing based on ad spend and goals.',
    category: 'other',
    type: 'SUBSCRIPTION',
    active: true,
    sortOrder: 6,
    variants: [
      { id: 'fb-ppc1', productId: 'fb-ppc', name: 'Custom Package', priceMonthly: null, priceAnnual: null, priceOneTime: null, salePrice: null, billingInterval: 'MONTHLY', stripePriceId: null, stripeProductId: null, contactOnly: true, active: true, sortOrder: 0 },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Category display order & labels                                    */
/* ------------------------------------------------------------------ */

const CATEGORY_ORDER = ['hosting', 'seo', 'social', 'video', 'other']

const CATEGORY_LABELS: Record<string, string> = {
  hosting: 'Web Hosting',
  seo: 'Search Engine Optimization',
  social: 'Social Media',
  video: 'Video Marketing',
  other: 'Additional Services',
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatPrice(cents: number): string {
  const dollars = cents / 100
  return dollars % 1 === 0
    ? `$${dollars.toLocaleString()}`
    : `$${dollars.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function isRecommendedVariant(variant: ProductVariant, variants: ProductVariant[]): boolean {
  if (variant.name.toLowerCase() === 'pro') return true
  if (variants.length === 3) return variant.sortOrder === 1
  if (variants.length >= 4) {
    const mid = Math.floor(variants.length / 2)
    return variant.sortOrder === variants[mid]?.sortOrder
  }
  return false
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  viewport: { once: true, margin: '-60px' },
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    q: 'Are there any long-term contracts?',
    a: 'No. All our plans are month-to-month with no long-term commitments. Cancel anytime.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards through Stripe. Invoices are processed securely.',
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Absolutely. You can change your plan at any time from your dashboard. Changes take effect on your next billing cycle.',
  },
  {
    q: 'Do you offer custom packages?',
    a: 'Yes. For businesses with specific needs, we offer custom packages. Contact us to discuss your requirements.',
  },
  {
    q: 'What happens after I sign up?',
    a: 'You will receive a welcome email with next steps. For SEO and marketing services, we schedule a kickoff call within 48 hours.',
  },
]

/* ------------------------------------------------------------------ */
/*  Component: PriceDisplay                                            */
/* ------------------------------------------------------------------ */

function PriceDisplay({
  variant,
  annual,
}: {
  variant: ProductVariant
  annual: boolean
}) {
  if (variant.contactOnly) {
    return (
      <div className="mb-6">
        <span className="text-2xl font-black text-[#1A1A1A]">Contact for Pricing</span>
      </div>
    )
  }

  // One-time product
  if (variant.priceOneTime !== null) {
    const hasDiscount = variant.salePrice !== null
    return (
      <div className="mb-6 flex items-baseline gap-3">
        {hasDiscount && (
          <span className="text-lg line-through text-[#333]/30">
            {formatPrice(variant.priceOneTime)}
          </span>
        )}
        <span className={`text-4xl font-black ${hasDiscount ? 'text-[#F813BE]' : 'text-[#1A1A1A]'}`}>
          {formatPrice(hasDiscount ? variant.salePrice! : variant.priceOneTime)}
        </span>
        <span className="text-base font-normal text-[#333]/50">one-time</span>
      </div>
    )
  }

  // Annual toggle active + annual price available
  if (annual && variant.priceAnnual !== null) {
    return (
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-4xl font-black text-[#1A1A1A]">
          {formatPrice(variant.priceAnnual)}
        </span>
        <span className="text-base font-normal text-[#333]/50">/yr</span>
      </div>
    )
  }

  // Monthly
  if (variant.priceMonthly !== null) {
    return (
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-4xl font-black text-[#1A1A1A]">
          {formatPrice(variant.priceMonthly)}
        </span>
        <span className="text-base font-normal text-[#333]/50">/mo</span>
      </div>
    )
  }

  return null
}

/* ------------------------------------------------------------------ */
/*  Component: FAQ Item                                                */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[#E5E5E5]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-lg font-semibold text-[#1A1A1A]">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#333]/50 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-40 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-[16px] leading-relaxed text-[#333333]">{a}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component: Skeleton loader                                         */
/* ------------------------------------------------------------------ */

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#F8F8F8] rounded-2xl p-8 animate-pulse">
          <div className="h-6 bg-[#E5E5E5] rounded w-1/2 mb-4" />
          <div className="h-10 bg-[#E5E5E5] rounded w-2/3 mb-6" />
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-[#E5E5E5] rounded w-full" />
            <div className="h-4 bg-[#E5E5E5] rounded w-5/6" />
            <div className="h-4 bg-[#E5E5E5] rounded w-4/6" />
          </div>
          <div className="h-12 bg-[#E5E5E5] rounded-full" />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface PricingContentProps {
  content?: Record<string, string>
}

export default function PricingContent({ content }: PricingContentProps = {}) {
  const { editMode } = useEditor()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [annual, setAnnual] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/pricing')
        if (!res.ok) throw new Error('API error')
        const data: Product[] = await res.json()
        setProducts(data.length > 0 ? data : FALLBACK_PRODUCTS)
      } catch {
        setProducts(FALLBACK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Group products by category
  const grouped = products.reduce<Record<string, Product[]>>((acc, product) => {
    const cat = product.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(product)
    return acc
  }, {})

  // Check if any product has annual pricing
  const hasAnnualPricing = products.some((p) =>
    p.variants.some((v) => v.priceAnnual !== null)
  )

  // Ordered categories
  const orderedCategories = CATEGORY_ORDER.filter((cat) => grouped[cat])

  return (
    <>
      {/* HERO */}
      <section className="relative bg-[#0F0F0F] pt-40 pb-20 lg:pb-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              data-page="pricing" data-block="hero_eyebrow"
              className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
            >
              {content?.hero_eyebrow || 'Pricing'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1
              data-page="pricing" data-block="hero_headline"
              className="text-white font-light text-5xl md:text-6xl lg:text-7xl mb-6"
              style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}
            >
              {content?.hero_headline || 'Transparent Pricing'}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p
              data-page="pricing" data-block="hero_subtext"
              className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto"
            >
              {content?.hero_subtext || 'No hidden fees. No long-term contracts. Just straightforward plans built to grow your business.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* BILLING TOGGLE + PRODUCT SECTIONS */}
      <section className="px-6 md:px-16 lg:px-24 py-20 lg:py-32 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto">
          {/* Toggle */}
          {hasAnnualPricing && (
            <motion.div {...fadeUp} className="flex items-center justify-center gap-3 mb-16">
              <div className="inline-flex items-center bg-[#1A1A1A] rounded-full p-1 border border-[#333]">
                <button
                  onClick={() => setAnnual(false)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                    !annual
                      ? 'bg-[#14EAEA] text-[#0A0A0A]'
                      : 'bg-transparent text-[#666] hover:text-[#999]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                    annual
                      ? 'bg-[#14EAEA] text-[#0A0A0A]'
                      : 'bg-transparent text-[#666] hover:text-[#999]'
                  }`}
                >
                  Annual
                  <span className={`text-[10px] font-bold ${
                    annual ? 'text-[#0A0A0A]/70' : 'text-[#14EAEA]'
                  }`}>
                    Save 10%
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="w-8 h-8 text-[#14EAEA] animate-spin" />
              <SkeletonCards />
            </div>
          )}

          {/* Product sections */}
          {!loading &&
            orderedCategories.map((category, catIdx) => {
              const categoryProducts = grouped[category]
              const eyebrowColor = catIdx % 2 === 0 ? '#14EAEA' : '#F813BE'

              return (
                <div key={category} className="mb-20 last:mb-0">
                  <motion.div {...fadeUp}>
                    <p
                      className="text-xs font-bold tracking-[3px] uppercase mb-4"
                      style={{ color: eyebrowColor }}
                    >
                      {CATEGORY_LABELS[category] || category}
                    </p>
                  </motion.div>

                  {categoryProducts.map((product) => (
                    <div key={product.id} className="mb-16 last:mb-0">
                      <motion.div {...fadeUp}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-3">
                          {product.name}
                        </h2>
                        <p className="text-[17px] leading-relaxed text-[#333333] max-w-2xl mb-10">
                          {product.description}
                        </p>
                      </motion.div>

                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        className={`grid gap-6 ${
                          product.variants.length === 1
                            ? 'grid-cols-1 max-w-md'
                            : product.variants.length === 2
                              ? 'grid-cols-1 md:grid-cols-2 max-w-3xl'
                              : product.variants.length <= 4
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}
                      >
                        {product.variants.map((variant) => {
                          const recommended = isRecommendedVariant(variant, product.variants)

                          return (
                            <motion.div
                              key={variant.id}
                              variants={staggerItem}
                              className={`bg-white rounded-2xl p-8 border-2 relative transition-all duration-300 hover:shadow-[0_8px_40px_rgba(20,234,234,0.15)] ${
                                recommended
                                  ? 'border-[#14EAEA] shadow-lg'
                                  : 'border-[#E5E5E5] hover:border-[#14EAEA]'
                              }`}
                            >
                              {recommended && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#14EAEA] text-[#0A0A0A] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                                  Recommended
                                </span>
                              )}

                              <h3 className="font-black text-xl text-[#1A1A1A] mb-2">
                                {variant.name}
                              </h3>

                              <PriceDisplay variant={variant} annual={annual} />

                              {variant.contactOnly ? (
                                <Link
                                  href="/contact"
                                  className="block w-full text-center border-2 border-[#14EAEA] text-[#14EAEA] font-semibold py-4 rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-colors"
                                >
                                  Get a Quote
                                </Link>
                              ) : (
                                <Link
                                  href="/contact"
                                  className="block w-full text-center bg-[#F813BE] text-white font-semibold py-4 rounded-full hover:bg-[#d10fa3] transition-colors"
                                >
                                  Get Started
                                </Link>
                              )}
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    </div>
                  ))}
                </div>
              )
            })}

          {/* Empty state */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p
                data-page="pricing" data-block="pricing_empty_state"
                className="text-xl text-[#333]/60 mb-6"
              >
                Pricing information is currently being updated.
              </p>
              <Link
                href="/contact"
                onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }}
                className="inline-block bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors"
              >
                <span data-page="pricing" data-block="pricing_empty_cta">Contact Us for Pricing</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative bg-[#0F0F0F] px-6 md:px-16 lg:px-24 py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            data-page="pricing" data-block="cta_bg_image"
            src="/images/photoshoot/DSC04566.jpg"
            alt="CTA background"
            fill
            className="object-cover opacity-10"
            style={{ objectPosition: 'center' }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0F0F0F]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-4 hidden lg:block overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="relative h-[320px]">
              <Image
                data-page="pricing" data-block="cta_sean_image"
                src="/images/photoshoot/SquareSean2.jpg"
                alt="Sean Rowe — founder of Webink Solutions, ready to help grow your business"
                fill
                className="object-cover"
                style={{ objectPosition: 'top center' }}
                sizes="33vw"
              />
            </div>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="lg:col-span-8 text-center lg:text-left"
          >
            <p
              data-page="pricing" data-block="cta_eyebrow"
              className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4"
            >
              {content?.cta_eyebrow || 'Ready to Grow?'}
            </p>
            <h2
              data-page="pricing" data-block="cta_heading"
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
            >
              {content?.cta_heading || 'Not sure which plan is right for you?'}
            </h2>
            <p
              data-page="pricing" data-block="cta_subtext"
              className="text-white/60 text-lg mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {content?.cta_subtext || 'Schedule a free consultation and we will build a custom strategy tailored to your business goals and budget.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/contact"
                onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }}
                className="bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors"
              >
                <span data-page="pricing" data-block="pricing_cta_button_1">{content?.pricing_cta_button_1 || 'Get a Free Consultation'}</span>
              </Link>
              <a
                href="tel:+19418401381"
                onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }}
                className="border border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-[#0A0A0A] transition-colors"
              >
                <span data-page="pricing" data-block="pricing_cta_button_2">{content?.pricing_cta_button_2 || 'Call (941) 840-1381'}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-16 lg:px-24 py-20 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p
              data-page="pricing" data-block="pricing_faq_eyebrow"
              className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
            >
              {content?.pricing_faq_eyebrow || 'FAQ'}
            </p>
            <h2
              data-page="pricing" data-block="pricing_faq_heading"
              className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-10"
            >
              {content?.pricing_faq_heading || 'Frequently Asked Questions'}
            </h2>
          </motion.div>

          <motion.div {...fadeUp}>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}

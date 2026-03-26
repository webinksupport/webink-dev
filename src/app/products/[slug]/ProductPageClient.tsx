'use client'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight, Shield, Lock, RefreshCcw, Star, CreditCard,
  CheckCircle2, ArrowRight,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import {
  type ProductContent,
  type TierKey,
  formatPrice,
  getAnnualSavings,
} from '@/lib/product-content'

const ease = [0.25, 0.46, 0.45, 0.94]

interface VariantData {
  id: string
  name: string
  priceMonthly: number | null
  priceAnnual: number | null
  priceOneTime: number | null
  salePrice: number | null
  setupFee: number | null
  billingInterval: string
  contactOnly: boolean
  stripePriceId: string | null
}

interface ProductData {
  name: string
  slug: string
  description: string
  shortDescription: string | null
  category: string
  setupFee: number | null
  type: string
}

interface ProductPageClientProps {
  product: ProductData
  variants: VariantData[]
  content: ProductContent | null
  initialTier: TierKey
  initialBilling: 'monthly' | 'annual'
  openCheckout: boolean
}

// Map variant names to tier keys
function variantToTierKey(name: string): TierKey | null {
  const lower = name.toLowerCase()
  if (lower.includes('basic') || lower.includes('starter')) return 'basic'
  if (lower.includes('pro')) return 'pro'
  if (lower.includes('ultimate') || lower.includes('premium')) return 'ultimate'
  return null
}

export default function ProductPageClient({
  product,
  variants,
  content,
  initialTier,
  initialBilling,
  openCheckout,
}: ProductPageClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedTier, setSelectedTier] = useState<TierKey>(initialTier)
  const [billing, setBilling] = useState<'monthly' | 'annual'>(initialBilling)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  // Parse variants into tier groups
  const tierVariants = useMemo(() => {
    const map: Partial<Record<TierKey, { monthly?: VariantData; annual?: VariantData }>> = {}
    for (const v of variants) {
      const tier = variantToTierKey(v.name)
      if (!tier) continue
      if (!map[tier]) map[tier] = {}
      if (v.billingInterval === 'ANNUAL') {
        map[tier]!.annual = v
      } else {
        map[tier]!.monthly = v
      }
    }
    return map
  }, [variants])

  // Get ordered tier keys that have variants
  const availableTiers = useMemo(() => {
    const order: TierKey[] = ['basic', 'pro', 'ultimate']
    return order.filter((t) => tierVariants[t])
  }, [tierVariants])

  // Selected variant for the current tier + billing
  const selectedVariant = useMemo(() => {
    const group = tierVariants[selectedTier]
    if (!group) return null
    return billing === 'annual' ? (group.annual || group.monthly) : (group.monthly || group.annual)
  }, [tierVariants, selectedTier, billing])

  // Has billing choice (both monthly and annual variants exist)
  const hasBillingChoice = useMemo(() => {
    return variants.some((v) => v.billingInterval === 'ANNUAL') &&
      variants.some((v) => v.billingInterval === 'MONTHLY')
  }, [variants])

  // Update URL silently when tier/billing changes
  const updateUrl = useCallback(
    (tier: TierKey, bill: 'monthly' | 'annual') => {
      const url = `/products/${product.slug}?tier=${tier}&billing=${bill}`
      router.replace(url, { scroll: false })
    },
    [router, product.slug]
  )

  function handleTierSelect(tier: TierKey) {
    setSelectedTier(tier)
    updateUrl(tier, billing)
  }

  function handleBillingChange(value: 'monthly' | 'annual') {
    setBilling(value)
    updateUrl(selectedTier, value)
  }

  // Price display helpers
  const displayPrice = useMemo(() => {
    if (!selectedVariant) return null
    if (billing === 'annual' && selectedVariant.priceAnnual) {
      return Math.round(selectedVariant.priceAnnual / 12)
    }
    return selectedVariant.priceMonthly
  }, [selectedVariant, billing])

  const annualTotal = useMemo(() => {
    if (!selectedVariant) return null
    if (billing === 'annual' && selectedVariant.priceAnnual) return selectedVariant.priceAnnual
    return null
  }, [selectedVariant, billing])

  const setupFee = selectedVariant?.setupFee ?? product.setupFee

  const savings = useMemo(() => {
    if (!selectedVariant?.priceMonthly) return 0
    return getAnnualSavings(selectedVariant.priceMonthly)
  }, [selectedVariant])

  // Get tier content for features display
  const tierContent = content?.tiers[selectedTier]

  // Build product display label for auth page
  const productDisplayName = `${product.name} — ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}`

  // Direct checkout — requires auth, goes to Stripe
  async function handleCheckout() {
    if (!selectedVariant) return

    if (!session?.user) {
      const productLabel = encodeURIComponent(productDisplayName)
      const priceLabel = encodeURIComponent(
        `${formatPrice(displayPrice)}/${billing === 'annual' ? 'mo (billed annually)' : 'mo'}`
      )
      const returnUrl = encodeURIComponent(
        `/products/${product.slug}?tier=${selectedTier}&billing=${billing}&checkout=pending`
      )
      router.push(
        `/auth/checkout?callbackUrl=${returnUrl}&product=${productLabel}&price=${priceLabel}`
      )
      return
    }

    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          tier: selectedTier,
          billing,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          const productLabel = encodeURIComponent(productDisplayName)
          const priceLabel = encodeURIComponent(
            `${formatPrice(displayPrice)}/${billing === 'annual' ? 'mo (billed annually)' : 'mo'}`
          )
          const returnUrl = encodeURIComponent(
            `/products/${product.slug}?tier=${selectedTier}&billing=${billing}`
          )
          router.push(
            `/auth/checkout?callbackUrl=${returnUrl}&product=${productLabel}&price=${priceLabel}`
          )
          return
        }
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Auto-trigger checkout when returning from sign-in with checkout=pending
  const autoCheckoutRef = useRef(false)
  useEffect(() => {
    if (openCheckout && session?.user && selectedVariant && !autoCheckoutRef.current) {
      autoCheckoutRef.current = true
      handleCheckout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCheckout, session, selectedVariant])

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          CHECKOUT PAGE — Simple, focused, conversion-optimized
      ════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0A0A0A] pt-32 pb-20 lg:pb-32 px-6 md:px-16 lg:px-24 min-h-[80vh]">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#14EAEA]/[0.03] blur-[200px]" />

        <div className="relative max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 text-white/30 text-xs mb-10"
          >
            <Link href="/services" className="hover:text-white/50 transition-colors">Services</Link>
            <ChevronRight size={12} />
            <span className="text-white/50">{product.name}</span>
            <ChevronRight size={12} />
            <span className="text-[#14EAEA]">Checkout</span>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            {/* ── LEFT: Order Summary (3 cols) ──────────────── */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4">
                  Your Selection
                </p>
                <h1
                  className="font-urbanist font-black text-white leading-tight mb-2"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
                >
                  {product.name}
                </h1>

                {/* Tier selector pills */}
                {availableTiers.length > 1 && (
                  <div className="flex gap-2 mt-6 mb-2">
                    {availableTiers.map((tierKey) => (
                      <button
                        key={tierKey}
                        onClick={() => handleTierSelect(tierKey)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                          selectedTier === tierKey
                            ? 'bg-[#14EAEA] text-[#0A0A0A]'
                            : 'border border-white/15 text-white/50 hover:border-[#14EAEA]/50 hover:text-white/80'
                        }`}
                      >
                        {tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}
                        {tierKey === 'pro' && (
                          <span className="ml-1.5 text-[9px] bg-[#F813BE] text-white px-1.5 py-0.5 rounded-full font-bold align-middle">
                            POPULAR
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tier description */}
                {tierContent && (
                  <motion.p
                    key={selectedTier}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="font-urbanist text-white/40 text-sm leading-relaxed mt-3 mb-6 max-w-lg"
                  >
                    {tierContent.tagline} — {tierContent.perfectFor}
                  </motion.p>
                )}

                {/* Features included */}
                {tierContent && tierContent.highlightedFeatures.length > 0 && (
                  <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 mt-4">
                    <p className="font-urbanist font-bold text-white/70 text-sm mb-4">
                      What&rsquo;s included:
                    </p>
                    <ul className="space-y-2.5">
                      {tierContent.highlightedFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <CheckCircle2 size={14} className="text-[#14EAEA] flex-shrink-0 mt-0.5" />
                          <span className="font-urbanist text-[13px] text-white/55 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Back to service page link */}
                <Link
                  href={`/services/${product.slug === 'managed-web-hosting' ? 'web-hosting' : product.slug}`}
                  className="inline-flex items-center gap-1.5 text-white/25 text-xs mt-6 hover:text-white/50 transition-colors"
                >
                  ← Compare all plans
                </Link>
              </motion.div>
            </div>

            {/* ── RIGHT: Price Card + CTA (2 cols) ──────────── */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease }}
                className="bg-[#111111] border border-white/10 rounded-2xl p-8 sticky top-28"
              >
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard size={16} className="text-[#14EAEA]" />
                  <h2 className="font-urbanist font-bold text-white text-sm">Order Summary</h2>
                </div>

                {/* Product + tier */}
                <div className="border-b border-white/8 pb-4 mb-4">
                  <p className="font-urbanist font-bold text-white text-lg">
                    {productDisplayName}
                  </p>
                  <p className="font-urbanist text-white/35 text-sm mt-1">
                    {billing === 'annual' ? 'Annual billing' : 'Monthly billing'}
                  </p>
                </div>

                {/* Billing toggle */}
                {hasBillingChoice && (
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => handleBillingChange('monthly')}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                        billing === 'monthly'
                          ? 'bg-white/10 text-white border-white/20'
                          : 'text-white/35 border-white/8 hover:border-white/15'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => handleBillingChange('annual')}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                        billing === 'annual'
                          ? 'bg-white/10 text-white border-white/20'
                          : 'text-white/35 border-white/8 hover:border-white/15'
                      }`}
                    >
                      Annual
                      {savings > 0 && (
                        <span className="block text-[9px] text-[#B9FF33] font-bold mt-0.5">
                          Save {formatPrice(savings)}/yr
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* Price */}
                {selectedVariant?.contactOnly ? (
                  <div className="mb-6">
                    <span className="font-urbanist text-2xl font-black text-[#F813BE]">
                      Contact for Pricing
                    </span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-urbanist text-4xl font-black text-white">
                        {formatPrice(displayPrice)}
                      </span>
                      <span className="font-urbanist text-sm text-white/40">/mo</span>
                    </div>
                    {billing === 'annual' && annualTotal && (
                      <p className="font-urbanist text-xs text-white/30 mt-1">
                        billed {formatPrice(annualTotal)}/yr
                      </p>
                    )}
                    {setupFee !== null && setupFee > 0 && (
                      <p className="font-urbanist text-xs text-white/30 mt-2">
                        + {formatPrice(setupFee)} one-time setup fee
                      </p>
                    )}
                  </div>
                )}

                {/* Error message */}
                {checkoutError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
                    {checkoutError}
                  </div>
                )}

                {/* CTA Button */}
                {selectedVariant?.contactOnly ? (
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full bg-[#F813BE] text-white font-urbanist font-bold text-sm px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || !selectedVariant}
                    className="flex items-center justify-center gap-2 w-full bg-[#14EAEA] text-[#0A0A0A] font-urbanist font-bold text-sm px-8 py-4 rounded-full hover:bg-white transition-colors duration-200 shadow-lg shadow-[#14EAEA]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutLoading ? (
                      'Redirecting to Stripe...'
                    ) : (
                      <>Proceed to Checkout <ArrowRight size={16} /></>
                    )}
                  </button>
                )}

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-5 mt-5">
                  <div className="flex items-center gap-1.5 text-white/20">
                    <Lock size={11} />
                    <span className="font-urbanist text-[10px]">Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/20">
                    <RefreshCcw size={11} />
                    <span className="font-urbanist text-[10px]">Cancel anytime</span>
                  </div>
                </div>

                {/* Powered by Stripe badge */}
                <div className="flex items-center justify-center gap-1.5 mt-4 pt-4 border-t border-white/5">
                  <Shield size={12} className="text-white/15" />
                  <span className="font-urbanist text-[10px] text-white/15">
                    Payments secured by Stripe
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Shield, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/product-content'

interface OrderSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  tierName: string
  billing: 'monthly' | 'annual'
  priceMonthly: number | null
  priceAnnual: number | null
  setupFee: number | null
  variantId: string
  productSlug: string
}

export default function OrderSummaryModal({
  isOpen,
  onClose,
  productName,
  tierName,
  billing,
  priceMonthly,
  priceAnnual,
  setupFee,
  variantId,
  productSlug,
}: OrderSummaryModalProps) {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [continueAsGuest, setContinueAsGuest] = useState(false)

  const isAnnual = billing === 'annual'
  const subscriptionPrice = isAnnual ? priceAnnual : priceMonthly
  const effectiveSetup = setupFee && setupFee > 0 ? setupFee : 0
  const totalToday = (subscriptionPrice || 0) + effectiveSetup
  const renewalAmount = subscriptionPrice
  const renewalPeriod = isAnnual ? 'year' : 'month'

  // Show monthly equivalent when billing annually
  const monthlyEquivalent = isAnnual && priceAnnual ? Math.round(priceAnnual / 12) : null

  async function handleCheckout() {
    if (!session && guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          tier: tierName.toLowerCase(),
          billing,
          ...(guestEmail && !session && { email: guestEmail }),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          const returnUrl = encodeURIComponent(`/products/${productSlug}?tier=${tierName.toLowerCase()}&billing=${billing}&checkout=pending`)
          router.push(`/auth/signin?callbackUrl=${returnUrl}`)
          return
        }
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — full-screen on mobile, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed z-[101] inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md bg-[#0F0F0F] md:rounded-2xl border-0 md:border border-[#14EAEA]/30 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 md:py-4 pt-6 border-b border-white/10">
              <h3 className="font-urbanist font-bold text-white text-lg">Order Summary</h3>
              <button
                onClick={onClose}
                className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} className="md:w-4 md:h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="font-urbanist font-bold text-white text-lg mb-0.5">
                {productName} — {tierName}
              </p>
              <p className="font-urbanist text-sm text-white/40 mb-6">
                {isAnnual ? 'Annual' : 'Monthly'} billing
              </p>

              {/* Price breakdown */}
              <div className="space-y-3 mb-4">
                {effectiveSetup > 0 && (
                  <div className="flex justify-between">
                    <span className="font-urbanist text-sm text-white/50">One-time setup fee</span>
                    <span className="font-urbanist text-sm text-white/70 font-medium">{formatPrice(effectiveSetup)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-urbanist text-sm text-white/50">
                    {tierName} {isAnnual ? 'Annual' : 'Monthly'}
                  </span>
                  <span className="font-urbanist text-sm text-white/70 font-medium">
                    {formatPrice(subscriptionPrice)}{isAnnual ? '/yr' : '/mo'}
                  </span>
                </div>
                {monthlyEquivalent && (
                  <div className="flex justify-end">
                    <span className="font-urbanist text-xs text-[#14EAEA]/60">
                      {formatPrice(monthlyEquivalent)}/mo billed annually
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-3 mb-4">
                <div className="flex justify-between">
                  <span className="font-urbanist font-bold text-white">Total due today</span>
                  <span className="font-urbanist font-bold text-white text-lg">
                    {formatPrice(totalToday)}
                  </span>
                </div>
              </div>

              <p className="font-urbanist text-xs text-white/30 mb-2">
                Then {formatPrice(renewalAmount)}/{renewalPeriod} (renews {isAnnual ? 'annually' : 'monthly'})
              </p>
              <p className="font-urbanist text-xs text-white/30 mb-6">
                Cancel anytime. No lock-in contracts.
              </p>

              {/* Email — pre-filled if logged in, sign-in prompt or guest input if not */}
              {session?.user?.email ? (
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6">
                  <p className="font-urbanist text-xs text-white/40 mb-0.5">Billing email</p>
                  <p className="font-urbanist text-sm text-white/80">{session.user.email}</p>
                </div>
              ) : !continueAsGuest ? (
                <div className="mb-6">
                  <div className="bg-white/5 border border-[#14EAEA]/20 rounded-xl p-5 mb-3">
                    <p className="font-urbanist font-bold text-sm text-white mb-1">
                      Sign in for faster checkout
                    </p>
                    <p className="font-urbanist text-xs text-white/40 mb-4">
                      Your billing info and subscriptions will be saved to your account.
                    </p>
                    <button
                      onClick={() => {
                        const returnUrl = encodeURIComponent(
                          `/products/${productSlug}?tier=${tierName.toLowerCase()}&billing=${billing}&checkout=pending`
                        )
                        router.push(`/auth/signin?callbackUrl=${returnUrl}`)
                      }}
                      className="w-full font-urbanist font-bold text-sm px-5 py-3 rounded-full bg-white text-[#0A0A0A] hover:bg-[#14EAEA] transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  </div>
                  <button
                    onClick={() => setContinueAsGuest(true)}
                    className="w-full font-urbanist text-sm text-white/30 hover:text-white/50 transition-colors py-2"
                  >
                    Continue as guest
                  </button>
                </div>
              ) : (
                <div className="mb-6">
                  <label htmlFor="guest-email" className="block font-urbanist text-xs text-white/40 mb-2">
                    Email address
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    placeholder="you@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-urbanist text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#14EAEA]/50 transition-colors"
                  />
                  <p className="font-urbanist text-[10px] text-white/20 mt-1.5">
                    Receipt and onboarding details will be sent here
                  </p>
                </div>
              )}

              {error && (
                <p className="font-urbanist text-sm text-red-400 mb-4">{error}</p>
              )}

              {/* CTA buttons */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full font-urbanist font-bold text-base md:text-sm px-6 py-5 md:py-4 rounded-full bg-[#14EAEA] text-[#0A0A0A] hover:bg-white transition-colors duration-200 shadow-lg shadow-[#14EAEA]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Redirecting to Stripe...' : 'Confirm & Pay'}
              </button>

              <button
                onClick={onClose}
                className="w-full font-urbanist font-medium text-base md:text-sm text-white/40 hover:text-white/60 transition-colors mt-3 py-3 md:py-2"
              >
                Cancel
              </button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-white/25">
                  <Lock size={10} />
                  <span className="font-urbanist text-[10px]">Stripe</span>
                </div>
                <div className="flex items-center gap-1 text-white/25">
                  <Shield size={10} />
                  <span className="font-urbanist text-[10px]">SSL Secured</span>
                </div>
                <div className="flex items-center gap-1 text-white/25">
                  <RefreshCcw size={10} />
                  <span className="font-urbanist text-[10px]">Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

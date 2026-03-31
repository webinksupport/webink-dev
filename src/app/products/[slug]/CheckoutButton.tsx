'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckoutButtonProps {
  variantId: string
  contactOnly: boolean
  stripePriceId?: string | null
  isPopular?: boolean
  className?: string
}

export default function CheckoutButton({ variantId, contactOnly, stripePriceId, isPopular, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (contactOnly) {
    return (
      <a
        href="/contact"
        className={className || `inline-block font-semibold px-8 py-4 rounded-full transition-colors duration-200 w-full text-center border border-[#14EAEA] text-[#14EAEA] hover:bg-[#14EAEA] hover:text-[#0A0A0A]`}
      >
        Contact Us
      </a>
    )
  }

  // If no Stripe price ID is synced, show Contact Us instead of broken checkout
  if (!stripePriceId) {
    return (
      <a
        href="/contact"
        className={className || `inline-block font-semibold px-8 py-4 rounded-full transition-colors duration-200 w-full text-center bg-[#F813BE] text-white hover:bg-[#d10fa3]`}
      >
        Contact Us
      </a>
    )
  }

  async function handleCheckout() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          // Redirect to sign-in, preserving current page for return
          const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search)
          router.push(`/auth/signin?callbackUrl=${callbackUrl}`)
          return
        }
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      console.error('Checkout error:', err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const defaultClass = isPopular
    ? 'bg-[#F813BE] text-white hover:bg-[#d10fa3]'
    : 'border border-[#14EAEA] text-[#14EAEA] hover:bg-[#14EAEA] hover:text-[#0A0A0A]'

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={className || `inline-block font-semibold px-8 py-4 rounded-full transition-colors duration-200 w-full text-center ${defaultClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Loading...' : 'Get Started'}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  )
}

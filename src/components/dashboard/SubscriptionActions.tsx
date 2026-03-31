'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  status: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
  stripeSubscriptionId: string | null
  variant: {
    name: string
    priceMonthly: number | null
    product: { name: string }
  }
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default function SubscriptionActions({ subscription }: { subscription: Subscription }) {
  const router = useRouter()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const canCancel = subscription.status === 'ACTIVE' && !subscription.cancelAtPeriodEnd
  const canReactivate = subscription.cancelAtPeriodEnd && subscription.status !== 'CANCELED'

  async function handleAction(action: string, cancelImmediately = false) {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/subscriptions/${subscription.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, cancelImmediately }),
      })
      if (res.ok) {
        setShowCancelModal(false)
        router.refresh()
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#333]/50">
        {canCancel && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-sm text-red-400 border border-red-400/30 px-4 py-1.5 rounded-full hover:bg-red-400/10 transition-colors"
          >
            Cancel Subscription
          </button>
        )}

        {canReactivate && (
          <button
            onClick={() => handleAction('reactivate')}
            disabled={loading}
            className="text-sm text-[#14EAEA] border border-[#14EAEA]/30 px-4 py-1.5 rounded-full hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Reactivate'}
          </button>
        )}

        {subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
          <span className="text-xs text-yellow-400 ml-auto">
            Cancels {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-2">Cancel Subscription</h3>
            <p className="text-[#999] text-sm mb-1">
              <span className="text-white font-semibold">{subscription.variant.product.name}</span>
              {' '}&mdash; {subscription.variant.name}
              {subscription.variant.priceMonthly && ` (${formatCents(subscription.variant.priceMonthly)}/mo)`}
            </p>
            <p className="text-[#999] text-sm mb-6">
              Choose how you&apos;d like to cancel:
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleAction('cancel', false)}
                disabled={loading}
                className="w-full text-left bg-[#0F0F0F] border border-[#333] rounded-xl p-4 hover:border-[#14EAEA] transition-colors disabled:opacity-50"
              >
                <p className="text-white font-semibold text-sm">Cancel at end of billing period</p>
                <p className="text-[#999] text-xs mt-1">
                  Keep access until {subscription.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : 'period ends'}
                </p>
              </button>

              <button
                onClick={() => handleAction('cancel', true)}
                disabled={loading}
                className="w-full text-left bg-[#0F0F0F] border border-[#333] rounded-xl p-4 hover:border-red-400 transition-colors disabled:opacity-50"
              >
                <p className="text-red-400 font-semibold text-sm">Cancel immediately</p>
                <p className="text-[#999] text-xs mt-1">
                  Access ends now. No further charges.
                </p>
              </button>
            </div>

            <button
              onClick={() => setShowCancelModal(false)}
              className="w-full text-center text-[#999] text-sm hover:text-white transition-colors"
            >
              Keep my subscription
            </button>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  ExternalLink,
  AlertTriangle,
  Check,
} from 'lucide-react'

interface VariantOption {
  id: string
  name: string
  priceMonthly: number | null
  priceAnnual: number | null
  billingInterval: string
}

interface SubProps {
  id: string
  status: string
  cancelAtPeriodEnd: boolean
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  canceledAt: string | null
  createdAt: string
  stripeSubscriptionId: string | null
  variant: {
    id: string
    name: string
    priceMonthly: number | null
    priceAnnual: number | null
    billingInterval: string
    product: {
      name: string
      variants: VariantOption[]
    }
  }
}

interface OrderProps {
  id: string
  status: string
  totalAmount: number
  createdAt: string
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

const statusColors: Record<string, string> = {
  ACTIVE: 'text-[#14EAEA]',
  PAST_DUE: 'text-yellow-400',
  CANCELED: 'text-red-400',
  PAUSED: 'text-[#999]',
  PENDING: 'text-[#999]',
  UNPAID: 'text-red-400',
}

export default function CustomerSubscriptionDetail({
  subscription: sub,
  orders,
}: {
  subscription: SubProps
  orders: OrderProps[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const canCancel = sub.status === 'ACTIVE' && !sub.cancelAtPeriodEnd
  const canReactivate = sub.cancelAtPeriodEnd && sub.status !== 'CANCELED'

  async function handleAction(action: string, cancelImmediately = false) {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/subscriptions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, cancelImmediately }),
      })
      if (res.ok) {
        setShowCancelModal(false)
        setToast({ message: action === 'cancel' ? 'Subscription cancelled' : 'Subscription reactivated', type: 'success' })
        router.refresh()
      } else {
        const data = await res.json()
        setToast({ message: data.error || 'Failed', type: 'error' })
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function openPortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setToast({ message: 'Could not open billing portal', type: 'error' })
    } finally {
      setPortalLoading(false)
    }
  }

  // Auto-dismiss toast
  if (toast) {
    setTimeout(() => setToast(null), 4000)
  }

  const otherVariants = sub.variant.product.variants.filter(v => v.id !== sub.variant.id)

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === 'success'
            ? 'bg-[#14EAEA]/10 border border-[#14EAEA]/30 text-[#14EAEA]'
            : 'bg-[#F813BE]/10 border border-[#F813BE]/30 text-[#F813BE]'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/subscriptions" className="text-[#999] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{sub.variant.product.name}</h1>
          <p className="text-[#999] text-sm">{sub.variant.name} plan</p>
        </div>
        <span className={`text-xs font-bold tracking-[2px] uppercase ${statusColors[sub.status] || 'text-[#999]'}`}>
          {sub.cancelAtPeriodEnd ? 'CANCELING' : sub.status}
        </span>
      </div>

      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-[#14EAEA]" />
            <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#14EAEA]">Current Plan</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-[#999] mb-1">Plan</p>
              <p className="text-white font-semibold">{sub.variant.name}</p>
            </div>
            <div>
              <p className="text-[#999] mb-1">Price</p>
              <p className="text-white font-semibold">
                {sub.variant.priceMonthly ? formatCents(sub.variant.priceMonthly) + '/mo' : 'Custom'}
              </p>
            </div>
            <div>
              <p className="text-[#999] mb-1">Billing</p>
              <p className="text-white">{sub.variant.billingInterval === 'ANNUAL' ? 'Annual' : 'Monthly'}</p>
            </div>
            <div>
              <p className="text-[#999] mb-1">Next Payment</p>
              <p className="text-white">
                {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>

          {sub.cancelAtPeriodEnd && sub.currentPeriodEnd && (
            <div className="mt-4 pt-4 border-t border-[#333]">
              <p className="text-yellow-400 text-sm">
                ⚠️ Your subscription will cancel on {new Date(sub.currentPeriodEnd).toLocaleDateString()}.
                Service continues until then.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#F813BE] mb-4">Manage</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={openPortal} disabled={portalLoading}
              className="flex items-center gap-2 border border-[#14EAEA] text-[#14EAEA] font-semibold px-5 py-2.5 rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-colors text-sm disabled:opacity-50">
              <ExternalLink className="w-4 h-4" />
              {portalLoading ? 'Loading...' : 'Update Payment Method'}
            </button>

            {canCancel && (
              <button onClick={() => setShowCancelModal(true)}
                className="text-sm text-red-400 border border-red-400/30 px-5 py-2.5 rounded-full hover:bg-red-400/10 transition-colors">
                Cancel Subscription
              </button>
            )}

            {canReactivate && (
              <button onClick={() => handleAction('reactivate')} disabled={loading}
                className="text-sm text-[#14EAEA] border border-[#14EAEA]/30 px-5 py-2.5 rounded-full hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : 'Reactivate Subscription'}
              </button>
            )}
          </div>
        </div>

        {/* Other Plans */}
        {otherVariants.length > 0 && sub.status !== 'CANCELED' && (
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
            <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#B9FF33] mb-4">
              Available Plans
            </h2>
            <p className="text-[#999] text-xs mb-4">
              To upgrade or downgrade your plan, please contact us or use the billing portal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherVariants.map(v => {
                const isUpgrade = (v.priceMonthly || 0) > (sub.variant.priceMonthly || 0)
                return (
                  <div key={v.id} className="bg-[#0F0F0F] border border-[#333] rounded-xl p-4">
                    <p className="text-white text-sm font-semibold">{v.name}</p>
                    <p className="text-[#999] text-xs mt-1">
                      {v.priceMonthly ? formatCents(v.priceMonthly) + '/mo' : 'Custom'}
                      {' · '}
                      <span className={isUpgrade ? 'text-[#B9FF33]' : 'text-yellow-400'}>
                        {isUpgrade ? 'Upgrade' : 'Downgrade'}
                      </span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Billing History */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#14EAEA]" />
            <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#14EAEA]">Billing History</h2>
          </div>
          {orders.length === 0 ? (
            <p className="text-[#999] text-sm">No billing history yet</p>
          ) : (
            <div className="space-y-2">
              {orders.map(order => (
                <div key={order.id} className="flex items-center justify-between bg-[#0F0F0F] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold tracking-[1px] uppercase ${
                      order.status === 'PAID' ? 'text-[#14EAEA]' : order.status === 'FAILED' ? 'text-red-400' : 'text-[#999]'
                    }`}>{order.status}</span>
                    <span className="text-white text-sm font-semibold">{formatCents(order.totalAmount)}</span>
                  </div>
                  <span className="text-[#999] text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-2">Cancel Subscription</h3>
            <p className="text-[#999] text-sm mb-1">
              <span className="text-white font-semibold">{sub.variant.product.name}</span>
              {' '}&mdash; {sub.variant.name}
              {sub.variant.priceMonthly && ` (${formatCents(sub.variant.priceMonthly)}/mo)`}
            </p>
            <p className="text-[#999] text-sm mb-6">Choose how you&apos;d like to cancel:</p>

            <div className="space-y-3 mb-6">
              <button onClick={() => handleAction('cancel', false)} disabled={loading}
                className="w-full text-left bg-[#0F0F0F] border border-[#333] rounded-xl p-4 hover:border-[#14EAEA] transition-colors disabled:opacity-50">
                <p className="text-white font-semibold text-sm">Cancel at end of billing period</p>
                <p className="text-[#999] text-xs mt-1">
                  Keep access until {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'period ends'}
                </p>
              </button>

              <button onClick={() => handleAction('cancel', true)} disabled={loading}
                className="w-full text-left bg-[#0F0F0F] border border-[#333] rounded-xl p-4 hover:border-red-400 transition-colors disabled:opacity-50">
                <p className="text-red-400 font-semibold text-sm">Cancel immediately</p>
                <p className="text-[#999] text-xs mt-1">Access ends now. No further charges.</p>
              </button>
            </div>

            <button onClick={() => setShowCancelModal(false)}
              className="w-full text-center text-[#999] text-sm hover:text-white transition-colors">
              Keep my subscription
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

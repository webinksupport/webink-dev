'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  User,
  ExternalLink,
  Loader2,
  RefreshCw,
  MessageSquare,
  AlertTriangle,
  Check,
  Clock,
  ArrowUpDown,
  XCircle,
  Play,
  Pause,
  Send,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────

interface NoteData {
  id: string
  type: string
  message: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

interface VariantOption {
  id: string
  name: string
  priceMonthly: number | null
  priceAnnual: number | null
  billingInterval: string
}

interface SubData {
  id: string
  userId: string
  variantId: string
  stripeSubscriptionId: string | null
  status: string
  cancelAtPeriodEnd: boolean
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  canceledAt: string | null
  createdAt: string
  updatedAt: string
  user: { id: string; name: string | null; email: string; stripeCustomerId: string | null }
  variant: {
    id: string
    name: string
    priceMonthly: number | null
    priceAnnual: number | null
    billingInterval: string
    product: { id: string; name: string; slug: string }
  }
  notes: NoteData[]
}

interface OrderData {
  id: string
  status: string
  totalAmount: number
  stripeFeeAmount: number | null
  createdAt: string
}

interface PaymentMethodData {
  last4: string
  brand: string
  expMonth: number
  expYear: number
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-[#14EAEA]/10 text-[#14EAEA] border-[#14EAEA]/30',
  PAST_DUE: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  CANCELED: 'bg-red-400/10 text-red-400 border-red-400/30',
  PAUSED: 'bg-[#999]/10 text-[#999] border-[#999]/30',
  PENDING: 'bg-[#999]/10 text-[#999] border-[#999]/30',
  UNPAID: 'bg-red-400/10 text-red-400 border-red-400/30',
}

const noteTypeIcons: Record<string, { icon: React.ElementType; color: string }> = {
  CREATED: { icon: Check, color: '#14EAEA' },
  PAYMENT_SUCCESS: { icon: CreditCard, color: '#14EAEA' },
  PAYMENT_FAILED: { icon: AlertTriangle, color: '#F813BE' },
  PAYMENT_RETRY: { icon: RefreshCw, color: 'yellow' },
  UPGRADED: { icon: ArrowUpDown, color: '#B9FF33' },
  DOWNGRADED: { icon: ArrowUpDown, color: 'yellow' },
  CANCELLED: { icon: XCircle, color: '#F813BE' },
  REACTIVATED: { icon: Play, color: '#14EAEA' },
  INTERVAL_CHANGED: { icon: Calendar, color: '#B9FF33' },
  STATUS_CHANGED: { icon: Clock, color: 'yellow' },
  ADMIN_NOTE: { icon: MessageSquare, color: '#999' },
}

// ─── Component ───────────────────────────────────────────────────────

export default function SubscriptionDetail({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [sub, setSub] = useState<SubData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodData | null>(null)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [availableVariants, setAvailableVariants] = useState<VariantOption[]>([])
  const [noteText, setNoteText] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showChangeVariant, setShowChangeVariant] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${subscriptionId}`)
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setSub(data.subscription)
      setPaymentMethod(data.paymentMethod)
      setOrders(data.orders)
      setAvailableVariants(data.availableVariants)
    } catch {
      setToast({ message: 'Failed to load subscription', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [subscriptionId])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  async function handleAction(action: string, extra?: Record<string, unknown>) {
    setActionLoading(action)
    try {
      const res = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Action failed')
      setToast({ message: `Action "${action}" completed`, type: 'success' })
      await fetchData()
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed', type: 'error' })
    } finally {
      setActionLoading(null)
    }
  }

  async function addNote() {
    if (!noteText.trim()) return
    await handleAction('add_note', { message: noteText.trim() })
    setNoteText('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[#14EAEA] animate-spin" />
      </div>
    )
  }

  if (!sub) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Subscription not found</p>
        <Link href="/admin/subscriptions" className="text-[#14EAEA] text-sm mt-2 inline-block">
          ← Back to Subscriptions
        </Link>
      </div>
    )
  }

  const stripeUrl = sub.stripeSubscriptionId
    ? `https://dashboard.stripe.com/subscriptions/${sub.stripeSubscriptionId}`
    : null

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
        <Link href="/admin/subscriptions" className="text-[#999] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-1">Subscription</p>
          <h1 className="text-2xl font-bold text-white">
            {sub.variant.product.name} — {sub.variant.name}
          </h1>
        </div>
        <span className={`text-xs font-bold tracking-[2px] uppercase px-3 py-1.5 rounded-full border ${statusColors[sub.status] || statusColors.PENDING}`}>
          {sub.cancelAtPeriodEnd ? 'CANCELING' : sub.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Customer Info */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-[#14EAEA]" />
              <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#14EAEA]">Customer</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[#999] text-xs mb-1">Name</p>
                <Link href={`/admin/customers/${sub.user.id}`} className="text-white font-semibold hover:text-[#14EAEA] transition-colors">
                  {sub.user.name || '—'}
                </Link>
              </div>
              <div>
                <p className="text-[#999] text-xs mb-1">Email</p>
                <p className="text-white">{sub.user.email}</p>
              </div>
              <div>
                <p className="text-[#999] text-xs mb-1">Stripe Customer</p>
                <p className="text-[#999] text-xs font-mono">{sub.user.stripeCustomerId || '—'}</p>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-[#F813BE]" />
              <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#F813BE]">Subscription Details</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[#999] text-xs mb-1">Product</p>
                <p className="text-white font-semibold">{sub.variant.product.name}</p>
              </div>
              <div>
                <p className="text-[#999] text-xs mb-1">Plan</p>
                <p className="text-white">{sub.variant.name}</p>
              </div>
              <div>
                <p className="text-[#999] text-xs mb-1">Price</p>
                <p className="text-white font-semibold">
                  {sub.variant.priceMonthly ? formatCents(sub.variant.priceMonthly) + '/mo' : 'Custom'}
                </p>
              </div>
              <div>
                <p className="text-[#999] text-xs mb-1">Billing Interval</p>
                <p className="text-white">{sub.variant.billingInterval === 'ANNUAL' ? 'Annual' : 'Monthly'}</p>
              </div>
              <div>
                <p className="text-[#999] text-xs mb-1">Current Period Start</p>
                <p className="text-white">{sub.currentPeriodStart ? new Date(sub.currentPeriodStart).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-[#999] text-xs mb-1">Next Payment</p>
                <p className="text-white">{sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-[#999] text-xs mb-1">Created</p>
                <p className="text-white">{new Date(sub.createdAt).toLocaleDateString()}</p>
              </div>
              {sub.canceledAt && (
                <div>
                  <p className="text-[#999] text-xs mb-1">Canceled At</p>
                  <p className="text-red-400">{new Date(sub.canceledAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            {paymentMethod && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                <p className="text-[#999] text-xs mb-2">Payment Method</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#999]" />
                  <span className="text-white text-sm capitalize">{paymentMethod.brand}</span>
                  <span className="text-white text-sm">•••• {paymentMethod.last4}</span>
                  <span className="text-[#999] text-xs">Exp {paymentMethod.expMonth}/{paymentMethod.expYear}</span>
                </div>
              </div>
            )}

            {/* Stripe Link */}
            {stripeUrl && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                <a href={stripeUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#14EAEA] hover:underline">
                  <ExternalLink className="w-3 h-3" />
                  View in Stripe Dashboard
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
            <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#B9FF33] mb-4">Actions</h2>
            <div className="flex flex-wrap gap-2">
              {sub.status === 'ACTIVE' && !sub.cancelAtPeriodEnd && (
                <>
                  <button onClick={() => handleAction('cancel')} disabled={!!actionLoading}
                    className="flex items-center gap-1.5 text-xs text-yellow-400 border border-yellow-400/30 px-3 py-2 rounded-lg hover:bg-yellow-400/10 transition-colors disabled:opacity-50">
                    {actionLoading === 'cancel' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                    Cancel at Period End
                  </button>
                  <button onClick={() => handleAction('cancel_immediately')} disabled={!!actionLoading}
                    className="flex items-center gap-1.5 text-xs text-red-400 border border-red-400/30 px-3 py-2 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50">
                    {actionLoading === 'cancel_immediately' ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                    Cancel Immediately
                  </button>
                  <button onClick={() => handleAction('pause')} disabled={!!actionLoading}
                    className="flex items-center gap-1.5 text-xs text-[#999] border border-[#999]/30 px-3 py-2 rounded-lg hover:bg-[#999]/10 transition-colors disabled:opacity-50">
                    {actionLoading === 'pause' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pause className="w-3 h-3" />}
                    Put on Hold
                  </button>
                </>
              )}

              {sub.cancelAtPeriodEnd && sub.status !== 'CANCELED' && (
                <button onClick={() => handleAction('resume')} disabled={!!actionLoading}
                  className="flex items-center gap-1.5 text-xs text-[#14EAEA] border border-[#14EAEA]/30 px-3 py-2 rounded-lg hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50">
                  {actionLoading === 'resume' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  Resume Subscription
                </button>
              )}

              {sub.status === 'PAUSED' && (
                <button onClick={() => handleAction('unpause')} disabled={!!actionLoading}
                  className="flex items-center gap-1.5 text-xs text-[#14EAEA] border border-[#14EAEA]/30 px-3 py-2 rounded-lg hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50">
                  {actionLoading === 'unpause' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  Unpause
                </button>
              )}

              {sub.status === 'PAST_DUE' && (
                <button onClick={() => handleAction('retry_payment')} disabled={!!actionLoading}
                  className="flex items-center gap-1.5 text-xs text-[#F813BE] border border-[#F813BE]/30 px-3 py-2 rounded-lg hover:bg-[#F813BE]/10 transition-colors disabled:opacity-50">
                  {actionLoading === 'retry_payment' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  Retry Payment
                </button>
              )}

              <button onClick={() => setShowChangeVariant(!showChangeVariant)} disabled={!!actionLoading || sub.status === 'CANCELED'}
                className="flex items-center gap-1.5 text-xs text-[#B9FF33] border border-[#B9FF33]/30 px-3 py-2 rounded-lg hover:bg-[#B9FF33]/10 transition-colors disabled:opacity-50">
                <ArrowUpDown className="w-3 h-3" />
                Change Plan
              </button>
            </div>

            {/* Change Plan Panel */}
            {showChangeVariant && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                <p className="text-[#999] text-xs mb-3">Select a new plan (proration applied automatically via Stripe):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableVariants
                    .filter(v => v.id !== sub.variantId)
                    .map(v => {
                      const isUpgrade = (v.priceMonthly || 0) > (sub.variant.priceMonthly || 0)
                      return (
                        <button key={v.id}
                          onClick={() => { handleAction('change_variant', { newVariantId: v.id }); setShowChangeVariant(false) }}
                          disabled={!!actionLoading}
                          className="text-left bg-[#0F0F0F] border border-[#333] rounded-xl p-3 hover:border-[#14EAEA] transition-colors disabled:opacity-50">
                          <p className="text-white text-sm font-semibold">{v.name}</p>
                          <p className="text-[#999] text-xs">
                            {v.priceMonthly ? formatCents(v.priceMonthly) + '/mo' : 'Custom'}
                            {' · '}
                            <span className={isUpgrade ? 'text-[#B9FF33]' : 'text-yellow-400'}>
                              {isUpgrade ? 'Upgrade' : 'Downgrade'}
                            </span>
                          </p>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Related Orders */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
            <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#14EAEA] mb-4">Related Orders</h2>
            {orders.length === 0 ? (
              <p className="text-[#999] text-sm">No orders found</p>
            ) : (
              <div className="space-y-2">
                {orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between bg-[#0F0F0F] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold tracking-[1px] uppercase ${
                        order.status === 'PAID' ? 'text-[#14EAEA]' : order.status === 'FAILED' ? 'text-red-400' : 'text-[#999]'
                      }`}>{order.status}</span>
                      <span className="text-white text-sm font-semibold">{formatCents(order.totalAmount)}</span>
                      {order.stripeFeeAmount && (
                        <span className="text-[#999] text-xs">Fee: {formatCents(order.stripeFeeAmount)}</span>
                      )}
                    </div>
                    <span className="text-[#999] text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Notes Timeline */}
        <div className="space-y-6">
          {/* Add Note */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-[#F813BE]" />
              <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#F813BE]">Add Note</h2>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note about this subscription..."
              rows={3}
              className="w-full bg-[#0F0F0F] border border-[#333] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#666] focus:outline-none focus:border-[#14EAEA] transition-colors resize-none"
            />
            <button
              onClick={addNote}
              disabled={!noteText.trim() || !!actionLoading}
              className="mt-2 flex items-center gap-1.5 text-xs bg-[#14EAEA] text-[#0A0A0A] font-semibold px-4 py-2 rounded-lg hover:bg-[#14EAEA]/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              Add Note
            </button>
          </div>

          {/* Notes Timeline */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
            <h2 className="text-sm font-bold tracking-[2px] uppercase text-[#14EAEA] mb-4">Activity Timeline</h2>
            {sub.notes.length === 0 ? (
              <p className="text-[#999] text-sm">No activity yet</p>
            ) : (
              <div className="space-y-0">
                {sub.notes.map((note, i) => {
                  const noteConfig = noteTypeIcons[note.type] || noteTypeIcons.ADMIN_NOTE
                  const Icon = noteConfig.icon
                  const isLast = i === sub.notes.length - 1
                  return (
                    <div key={note.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${noteConfig.color}15` }}>
                          <Icon className="w-3 h-3" style={{ color: noteConfig.color }} />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-[#333] my-1" />}
                      </div>
                      <div className={`pb-4 ${isLast ? '' : ''}`}>
                        <p className="text-white text-sm">{note.message}</p>
                        <p className="text-[#666] text-xs mt-1">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

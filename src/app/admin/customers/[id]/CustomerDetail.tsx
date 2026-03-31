'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  CreditCard,
  Receipt,
  AlertTriangle,
  Shield,
  Save,
} from 'lucide-react'

interface CustomerData {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  suspended: boolean
  notes: string | null
  stripeCustomerId: string | null
  createdAt: string
  subscriptions: {
    id: string
    status: string
    cancelAtPeriodEnd: boolean
    canceledAt: string | null
    currentPeriodEnd: string | null
    createdAt: string
    stripeSubscriptionId: string | null
    variant: {
      name: string
      priceMonthly: number | null
      product: { name: string }
    }
  }[]
  orders: {
    id: string
    status: string
    totalAmount: number
    stripeFeeAmount: number | null
    createdAt: string
    items: {
      variant: { name: string; product: { name: string } }
      unitPrice: number
      quantity: number
      total: number
    }[]
  }[]
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
  PAID: 'text-[#14EAEA]',
  FAILED: 'text-red-400',
  REFUNDED: 'text-yellow-400',
}

export default function CustomerDetail({ customer }: { customer: CustomerData }) {
  const router = useRouter()
  const [notes, setNotes] = useState(customer.notes || '')
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const totalSpent = customer.orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const activeSubCount = customer.subscriptions.filter((s) => s.status === 'ACTIVE').length

  async function saveNotes() {
    setSaving(true)
    try {
      await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      setMessage('Notes saved')
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function toggleSuspend() {
    setActionLoading('suspend')
    try {
      await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspended: !customer.suspended }),
      })
      router.refresh()
    } catch {
      setMessage('Failed to update')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleSubscriptionAction(subId: string, action: string) {
    setActionLoading(subId)
    try {
      await fetch(`/api/admin/subscriptions/${subId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      router.refresh()
    } catch {
      setMessage('Failed to update subscription')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/customers"
          className="text-[#999] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">
            {customer.name || customer.email}
          </h1>
          <p className="text-[#999]">{customer.email}</p>
        </div>
        {customer.suspended && (
          <span className="text-xs font-bold tracking-[2px] uppercase text-red-400 bg-red-400/10 px-3 py-1 rounded-full">
            Suspended
          </span>
        )}
      </div>

      {message && (
        <div className="bg-[#14EAEA]/10 border border-[#14EAEA]/30 text-[#14EAEA] rounded-lg p-3 mb-6 text-sm">
          {message}
        </div>
      )}

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#14EAEA]/10 flex items-center justify-center">
              <User className="w-4 h-4 text-[#14EAEA]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#14EAEA]">Profile</p>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-[#999]">Name</p>
              <p className="text-white">{customer.name || '—'}</p>
            </div>
            <div>
              <p className="text-[#999]">Email</p>
              <p className="text-white">{customer.email}</p>
            </div>
            <div>
              <p className="text-[#999]">Phone</p>
              <p className="text-white">{customer.phone || '—'}</p>
            </div>
            <div>
              <p className="text-[#999]">Role</p>
              <p className={customer.role === 'ADMIN' ? 'text-[#F813BE] font-bold' : 'text-white'}>
                {customer.role}
              </p>
            </div>
            <div>
              <p className="text-[#999]">Joined</p>
              <p className="text-white">{new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[#999]">Stripe ID</p>
              <p className="text-white text-xs font-mono">{customer.stripeCustomerId || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#F813BE]/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#F813BE]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#F813BE]">Summary</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[#999] text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold text-white">{activeSubCount}</p>
            </div>
            <div>
              <p className="text-[#999] text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{customer.orders.length}</p>
            </div>
            <div>
              <p className="text-[#999] text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-white">{formatCents(totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#B9FF33]/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#B9FF33]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#B9FF33]">Actions</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={toggleSuspend}
              disabled={actionLoading === 'suspend'}
              className={`w-full text-sm font-semibold px-4 py-2 rounded-full transition-colors disabled:opacity-50 ${
                customer.suspended
                  ? 'border border-[#14EAEA]/30 text-[#14EAEA] hover:bg-[#14EAEA]/10'
                  : 'border border-red-400/30 text-red-400 hover:bg-red-400/10'
              }`}
            >
              {actionLoading === 'suspend'
                ? 'Processing...'
                : customer.suspended
                  ? 'Reactivate Account'
                  : 'Suspend Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold tracking-[2px] uppercase text-[#14EAEA]">Internal Notes</p>
          <button
            onClick={saveNotes}
            disabled={saving}
            className="flex items-center gap-2 text-sm text-[#14EAEA] border border-[#14EAEA]/30 px-4 py-1.5 rounded-full hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50"
          >
            <Save className="w-3 h-3" />
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add internal notes about this customer..."
          className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-[#666] resize-none"
        />
      </div>

      {/* Subscriptions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Subscriptions ({customer.subscriptions.length})
        </h2>
        {customer.subscriptions.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 text-center">
            <p className="text-[#999]">No subscriptions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {customer.subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">
                      {sub.variant.product.name} — {sub.variant.name}
                    </p>
                    <p className="text-[#999] text-xs mt-1">
                      {sub.variant.priceMonthly ? formatCents(sub.variant.priceMonthly) + '/mo' : 'Custom'}
                      {sub.currentPeriodEnd && ` · Next billing: ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`}
                    </p>
                    {sub.stripeSubscriptionId && (
                      <p className="text-[#666] text-xs font-mono mt-1">{sub.stripeSubscriptionId}</p>
                    )}
                  </div>
                  <span className={`text-xs font-bold tracking-[2px] uppercase ${statusColors[sub.status] || 'text-[#999]'}`}>
                    {sub.cancelAtPeriodEnd ? 'CANCELING' : sub.status}
                  </span>
                </div>

                {/* Subscription Actions */}
                {sub.stripeSubscriptionId && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-[#333]/50">
                    {sub.status === 'ACTIVE' && !sub.cancelAtPeriodEnd && (
                      <>
                        <button
                          onClick={() => handleSubscriptionAction(sub.id, 'cancel')}
                          disabled={actionLoading === sub.id}
                          className="text-xs text-yellow-400 border border-yellow-400/30 px-3 py-1 rounded-full hover:bg-yellow-400/10 transition-colors disabled:opacity-50"
                        >
                          Cancel at Period End
                        </button>
                        <button
                          onClick={() => handleSubscriptionAction(sub.id, 'cancel_immediately')}
                          disabled={actionLoading === sub.id}
                          className="text-xs text-red-400 border border-red-400/30 px-3 py-1 rounded-full hover:bg-red-400/10 transition-colors disabled:opacity-50"
                        >
                          Cancel Immediately
                        </button>
                        <button
                          onClick={() => handleSubscriptionAction(sub.id, 'pause')}
                          disabled={actionLoading === sub.id}
                          className="text-xs text-[#999] border border-[#333] px-3 py-1 rounded-full hover:bg-[#333]/50 transition-colors disabled:opacity-50"
                        >
                          Pause
                        </button>
                      </>
                    )}
                    {sub.cancelAtPeriodEnd && sub.status !== 'CANCELED' && (
                      <button
                        onClick={() => handleSubscriptionAction(sub.id, 'resume')}
                        disabled={actionLoading === sub.id}
                        className="text-xs text-[#14EAEA] border border-[#14EAEA]/30 px-3 py-1 rounded-full hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50"
                      >
                        Resume (Undo Cancel)
                      </button>
                    )}
                    {sub.status === 'PAUSED' && (
                      <button
                        onClick={() => handleSubscriptionAction(sub.id, 'unpause')}
                        disabled={actionLoading === sub.id}
                        className="text-xs text-[#14EAEA] border border-[#14EAEA]/30 px-3 py-1 rounded-full hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50"
                      >
                        Unpause
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders / Payment History */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Payment History ({customer.orders.length})
        </h2>
        {customer.orders.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 text-center">
            <p className="text-[#999]">No orders</p>
          </div>
        ) : (
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Date</th>
                  <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Service</th>
                  <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Amount</th>
                  <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Fee</th>
                  <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#333]/50 last:border-0">
                    <td className="px-6 py-4 text-[#999] text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white text-sm">
                      {order.items[0]?.variant.product.name || 'Payment'}
                      {order.items[0]?.variant.name && (
                        <span className="text-[#999]"> — {order.items[0].variant.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white text-sm font-semibold">
                      {formatCents(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-[#999] text-sm">
                      {order.stripeFeeAmount ? formatCents(order.stripeFeeAmount) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold tracking-[2px] uppercase ${statusColors[order.status] || 'text-[#999]'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

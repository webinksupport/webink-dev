'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, DollarSign, TrendingUp } from 'lucide-react'

interface SubscriptionData {
  id: string
  status: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
  createdAt: string
  stripeSubscriptionId: string | null
  user: { id: string; name: string | null; email: string }
  variant: {
    name: string
    priceMonthly: number | null
    product: { id: string; name: string }
  }
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

const statusFilters = ['ALL', 'ACTIVE', 'CANCELED', 'PAST_DUE', 'PAUSED', 'PENDING'] as const

export default function SubscriptionsManager({
  subscriptions,
  products,
  mrr,
}: {
  subscriptions: SubscriptionData[]
  products: { id: string; name: string }[]
  mrr: number
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [productFilter, setProductFilter] = useState<string>('ALL')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = subscriptions.filter((s) => {
    const matchesSearch =
      !search ||
      s.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user.email.toLowerCase().includes(search.toLowerCase()) ||
      s.variant.product.name.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
    const matchesProduct = productFilter === 'ALL' || s.variant.product.id === productFilter

    return matchesSearch && matchesStatus && matchesProduct
  })

  const activeCount = subscriptions.filter((s) => s.status === 'ACTIVE').length
  const canceledCount = subscriptions.filter((s) => s.status === 'CANCELED').length
  const pastDueCount = subscriptions.filter((s) => s.status === 'PAST_DUE').length

  async function handleAction(subId: string, action: string) {
    setActionLoading(subId)
    try {
      await fetch(`/api/admin/subscriptions/${subId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      router.refresh()
    } catch {
      // Error handling
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Subscriptions</h1>
      <p className="text-[#999] mb-8">Manage all customer subscriptions</p>

      {/* MRR & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-[#B9FF33]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#B9FF33]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#B9FF33]">MRR</p>
          </div>
          <p className="text-3xl font-bold text-white">{formatCents(mrr)}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-[#14EAEA]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#14EAEA]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#14EAEA]">Active</p>
          </div>
          <p className="text-3xl font-bold text-white">{activeCount}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5">
          <p className="text-xs font-bold tracking-[2px] uppercase text-yellow-400 mb-2">Past Due</p>
          <p className="text-3xl font-bold text-white">{pastDueCount}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5">
          <p className="text-xs font-bold tracking-[2px] uppercase text-red-400 mb-2">Canceled</p>
          <p className="text-3xl font-bold text-white">{canceledCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or product..."
            className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-[#666]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-bold tracking-[1px] uppercase transition-colors ${
                statusFilter === s
                  ? 'bg-[#14EAEA]/10 text-[#14EAEA] border border-[#14EAEA]/30'
                  : 'bg-[#1A1A1A] text-[#999] border border-[#333] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="bg-[#1A1A1A] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#14EAEA] transition-colors"
        >
          <option value="ALL">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <p className="text-[#999] text-xs mb-4">{filtered.length} subscriptions</p>

      {/* Subscriptions Table */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Customer</th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Product</th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Plan</th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Price</th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Status</th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Next Billing</th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id} className="border-b border-[#333]/50 last:border-0 hover:bg-[#0F0F0F]/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/admin/customers/${sub.user.id}`} className="hover:text-[#14EAEA] transition-colors">
                    <p className="text-white text-sm font-semibold">{sub.user.name || '—'}</p>
                    <p className="text-[#999] text-xs">{sub.user.email}</p>
                  </Link>
                </td>
                <td className="px-6 py-4 text-white text-sm">
                  {sub.variant.product.name}
                </td>
                <td className="px-6 py-4 text-white text-sm">
                  {sub.variant.name}
                </td>
                <td className="px-6 py-4 text-white text-sm font-semibold">
                  {sub.variant.priceMonthly ? formatCents(sub.variant.priceMonthly) + '/mo' : 'Custom'}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold tracking-[2px] uppercase ${statusColors[sub.status] || 'text-[#999]'}`}>
                    {sub.cancelAtPeriodEnd ? 'CANCELING' : sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#999] text-sm">
                  {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {sub.status === 'ACTIVE' && !sub.cancelAtPeriodEnd && (
                      <button
                        onClick={() => handleAction(sub.id, 'cancel')}
                        disabled={actionLoading === sub.id}
                        className="text-xs text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded-full hover:bg-yellow-400/10 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                    {sub.cancelAtPeriodEnd && sub.status !== 'CANCELED' && (
                      <button
                        onClick={() => handleAction(sub.id, 'resume')}
                        disabled={actionLoading === sub.id}
                        className="text-xs text-[#14EAEA] border border-[#14EAEA]/30 px-2 py-1 rounded-full hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50"
                      >
                        Resume
                      </button>
                    )}
                    {sub.status === 'PAUSED' && (
                      <button
                        onClick={() => handleAction(sub.id, 'unpause')}
                        disabled={actionLoading === sub.id}
                        className="text-xs text-[#14EAEA] border border-[#14EAEA]/30 px-2 py-1 rounded-full hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-50"
                      >
                        Unpause
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

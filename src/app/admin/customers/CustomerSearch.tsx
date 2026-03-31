'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'

interface Customer {
  id: string
  name: string | null
  email: string
  role: string
  suspended: boolean
  createdAt: string
  activeSubscriptions: { id: string; productName: string; variantName: string }[]
  totalSpent: number
  orderCount: number
  subscriptionCount: number
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default function CustomerSearch({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'no-subs' | 'suspended'>('all')

  const filtered = customers.filter((c) => {
    const matchesSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && c.activeSubscriptions.length > 0) ||
      (filter === 'no-subs' && c.activeSubscriptions.length === 0) ||
      (filter === 'suspended' && c.suspended)

    return matchesSearch && matchesFilter
  })

  return (
    <>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-[#666]"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'no-subs', 'suspended'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-[1px] uppercase transition-colors ${
                filter === f
                  ? 'bg-[#14EAEA]/10 text-[#14EAEA] border border-[#14EAEA]/30'
                  : 'bg-[#1A1A1A] text-[#999] border border-[#333] hover:text-white'
              }`}
            >
              {f === 'no-subs' ? 'No Subs' : f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[#999] text-xs mb-4">{filtered.length} results</p>

      {/* Customer Table */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Customer
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Status
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Active Subs
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Total Spent
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Joined
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-[#333]/50 last:border-0 hover:bg-[#0F0F0F]/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-white text-sm font-semibold">
                    {customer.name || '—'}
                  </p>
                  <p className="text-[#999] text-xs">{customer.email}</p>
                </td>
                <td className="px-6 py-4">
                  {customer.suspended ? (
                    <span className="text-xs font-bold tracking-[2px] uppercase text-red-400">
                      Suspended
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-bold tracking-[2px] uppercase ${
                        customer.role === 'ADMIN'
                          ? 'text-[#F813BE]'
                          : 'text-[#14EAEA]'
                      }`}
                    >
                      {customer.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {customer.activeSubscriptions.length > 0 ? (
                    <div className="space-y-1">
                      {customer.activeSubscriptions.slice(0, 2).map((sub) => (
                        <p key={sub.id} className="text-white text-xs">
                          {sub.productName} — {sub.variantName}
                        </p>
                      ))}
                      {customer.activeSubscriptions.length > 2 && (
                        <p className="text-[#999] text-xs">
                          +{customer.activeSubscriptions.length - 2} more
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#999] text-sm">None</span>
                  )}
                </td>
                <td className="px-6 py-4 text-white text-sm font-semibold">
                  {formatCents(customer.totalSpent)}
                </td>
                <td className="px-6 py-4 text-[#999] text-sm">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-[#14EAEA] hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

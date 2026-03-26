import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

function formatCents(cents: number | null): string {
  if (cents === null) return '—'
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

function getPriceRange(product: {
  variants: { priceMonthly: number | null; priceAnnual: number | null; priceOneTime: number | null; contactOnly: boolean }[]
}): string {
  const prices: number[] = []
  for (const v of product.variants) {
    if (v.contactOnly) continue
    if (v.priceMonthly !== null) prices.push(v.priceMonthly)
    if (v.priceAnnual !== null) prices.push(v.priceAnnual)
    if (v.priceOneTime !== null) prices.push(v.priceOneTime)
  }
  if (prices.length === 0) {
    const hasContactOnly = product.variants.some((v) => v.contactOnly)
    return hasContactOnly ? 'Contact for pricing' : '—'
  }
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return formatCents(min)
  return `${formatCents(min)} – ${formatCents(max)}`
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-[#14EAEA]/10 text-[#14EAEA] border-[#14EAEA]/20',
  INACTIVE: 'bg-red-500/10 text-red-400 border-red-500/20',
  DRAFT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
}

const typeBadgeColors: Record<string, string> = {
  SIMPLE: 'bg-[#333] text-[#999]',
  SUBSCRIPTION: 'bg-[#F813BE]/10 text-[#F813BE]',
  VARIABLE: 'bg-[#14EAEA]/10 text-[#14EAEA]',
  VARIABLE_SUBSCRIPTION: 'bg-[#B9FF33]/10 text-[#B9FF33]',
  ONE_TIME: 'bg-[#333] text-[#999]',
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type: filterType } = await searchParams

  const where = filterType && filterType !== 'all'
    ? { type: filterType.toUpperCase() as 'SIMPLE' | 'SUBSCRIPTION' | 'VARIABLE' | 'VARIABLE_SUBSCRIPTION' | 'ONE_TIME' }
    : undefined

  const products = await prisma.product.findMany({
    where,
    include: {
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  const allCount = await prisma.product.count()

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Simple', value: 'simple' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'Variable', value: 'variable' },
    { label: 'Variable Sub', value: 'variable_subscription' },
    { label: 'One-Time', value: 'one_time' },
  ]

  const activeTab = filterType || 'all'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-[#999]">
            {products.length} of {allCount} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-bold rounded-full px-6 py-3 hover:bg-[#12d4d4] transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === 'all' ? '/admin/products' : `/admin/products?type=${tab.value}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
              activeTab === tab.value
                ? 'bg-[#14EAEA] text-[#0A0A0A]'
                : 'bg-[#1A1A1A] border border-[#333] text-[#999] hover:text-white hover:border-[#14EAEA]/40'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-12 text-center">
          <p className="text-[#999] text-lg">No products found.</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 mt-4 text-[#14EAEA] hover:underline"
          >
            <Plus className="w-4 h-4" />
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 hover:border-[#14EAEA]/30 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white truncate">
                      {product.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase ${
                        typeBadgeColors[product.type] || 'bg-[#333] text-[#999]'
                      }`}
                    >
                      {product.type.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase border ${
                        statusColors[product.status] || statusColors.DRAFT
                      }`}
                    >
                      {product.status}
                    </span>
                    {product.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase bg-[#B9FF33]/10 text-[#B9FF33]">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-[#999] text-sm mb-2">
                    {product.category} &middot;{' '}
                    <span className="font-mono text-xs">{product.slug}</span>
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-[#999]">
                      Price: <span className="text-white font-semibold">{getPriceRange(product)}</span>
                    </span>
                    <span className="text-[#999]">
                      Variants: <span className="text-white font-semibold">{product.variants.length}</span>
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="inline-flex items-center gap-2 border border-[#333] text-[#999] hover:text-white hover:border-[#14EAEA]/40 font-semibold rounded-full px-5 py-2.5 text-sm transition-colors duration-200 shrink-0"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

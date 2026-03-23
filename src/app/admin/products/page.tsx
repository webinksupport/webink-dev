import { prisma } from '@/lib/prisma'

function formatCents(cents: number | null): string {
  if (cents === null) return '—'
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-[#999]">
            {products.length} products in catalog
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <p className="text-[#999] text-sm">
                  {product.category} &middot; {product.type.replace('_', ' ').toLowerCase()} &middot;{' '}
                  <span className="font-mono text-xs">{product.slug}</span>
                </p>
              </div>
              <span
                className={`text-xs font-bold tracking-[2px] uppercase ${
                  product.active ? 'text-[#14EAEA]' : 'text-red-400'
                }`}
              >
                {product.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <p className="text-[#999] text-sm mb-4">{product.description}</p>

            {/* Variants table */}
            <div className="bg-[#0F0F0F] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#F813BE] px-4 py-3">
                      Variant
                    </th>
                    <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#F813BE] px-4 py-3">
                      Monthly
                    </th>
                    <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#F813BE] px-4 py-3">
                      Annual
                    </th>
                    <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#F813BE] px-4 py-3">
                      One-Time
                    </th>
                    <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#F813BE] px-4 py-3">
                      Sale
                    </th>
                    <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#F813BE] px-4 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr
                      key={variant.id}
                      className="border-b border-[#333]/30 last:border-0"
                    >
                      <td className="px-4 py-3 text-white">
                        {variant.name}
                        {variant.contactOnly && (
                          <span className="ml-2 text-xs text-[#F813BE]">
                            (contact only)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#999]">
                        {formatCents(variant.priceMonthly)}
                      </td>
                      <td className="px-4 py-3 text-[#999]">
                        {formatCents(variant.priceAnnual)}
                      </td>
                      <td className="px-4 py-3 text-[#999]">
                        {formatCents(variant.priceOneTime)}
                      </td>
                      <td className="px-4 py-3 text-[#B9FF33]">
                        {formatCents(variant.salePrice)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs ${
                            variant.active ? 'text-[#14EAEA]' : 'text-red-400'
                          }`}
                        >
                          {variant.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

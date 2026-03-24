import { prisma } from '@/lib/prisma'

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { email: true, name: true } },
      items: { include: { variant: { include: { product: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
      <p className="text-[#999] mb-8">{orders.length} total orders</p>

      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Order ID
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Customer
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Product
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Amount
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Stripe Fee
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Status
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#333]/50 last:border-0"
              >
                <td className="px-6 py-4 text-[#999] text-xs font-mono">
                  {order.id.slice(0, 12)}...
                </td>
                <td className="px-6 py-4 text-white text-sm">
                  {order.user.name || order.user.email}
                </td>
                <td className="px-6 py-4 text-[#999] text-sm">
                  {order.items[0]?.variant.product.name || '—'}
                </td>
                <td className="px-6 py-4 text-white text-sm font-semibold">
                  {formatCents(order.totalAmount)}
                </td>
                <td className="px-6 py-4 text-[#999] text-sm">
                  {order.stripeFeeAmount
                    ? formatCents(order.stripeFeeAmount)
                    : '—'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold tracking-[2px] uppercase ${
                      order.status === 'PAID'
                        ? 'text-[#14EAEA]'
                        : order.status === 'FAILED'
                          ? 'text-red-400'
                          : order.status === 'REFUNDED'
                            ? 'text-yellow-400'
                            : 'text-[#999]'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#999] text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-[#999]">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

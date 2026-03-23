import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ManageSubscriptionButton from '@/components/dashboard/ManageSubscriptionButton'

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    include: {
      items: { include: { variant: { include: { product: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Billing History</h1>
          <p className="text-[#999]">View your payment history and invoices</p>
        </div>
        <ManageSubscriptionButton />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#1A1A1A] border border-[#333] rounded-2xl">
          <p className="text-[#999] text-lg">No payments yet.</p>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                  Date
                </th>
                <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                  Service
                </th>
                <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                  Amount
                </th>
                <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#333]/50 last:border-0">
                  <td className="px-6 py-4 text-[#999] text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-white text-sm">
                    {order.items[0]?.variant.product.name || 'Payment'}
                    {order.items[0]?.variant.name && (
                      <span className="text-[#999]">
                        {' '}
                        — {order.items[0].variant.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white text-sm font-semibold">
                    {formatCents(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold tracking-[2px] uppercase ${
                        order.status === 'PAID'
                          ? 'text-[#14EAEA]'
                          : order.status === 'FAILED'
                            ? 'text-red-400'
                            : 'text-[#999]'
                      }`}
                    >
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
  )
}

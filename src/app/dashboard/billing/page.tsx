import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ManageSubscriptionButton from '@/components/dashboard/ManageSubscriptionButton'
import { CreditCard, FileText } from 'lucide-react'

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { stripeCustomerId: true },
    }),
    prisma.order.findMany({
      where: { userId: session!.user.id },
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const totalSpent = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Payments</h1>
          <p className="text-[#999]">View your payment history and manage billing</p>
        </div>
        <ManageSubscriptionButton />
      </div>

      {/* Billing Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#14EAEA]/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#14EAEA]" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#14EAEA]">Payment Method</p>
            </div>
          </div>
          {user?.stripeCustomerId ? (
            <p className="text-[#999] text-sm">
              Manage your payment methods via the Stripe portal using the &quot;Manage Billing&quot; button above.
            </p>
          ) : (
            <p className="text-[#999] text-sm">No payment method on file yet.</p>
          )}
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#F813BE]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#F813BE]" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#F813BE]">Total Spent</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCents(totalSpent)}</p>
          <p className="text-[#999] text-xs mt-1">{orders.filter((o) => o.status === 'PAID').length} payments</p>
        </div>
      </div>

      {/* Payment History */}
      <h2 className="text-lg font-bold text-white mb-4">Payment History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#1A1A1A] border border-[#333] rounded-2xl">
          <p className="text-[#999] text-lg">No payments yet.</p>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
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
                  <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                    Invoice
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
                          {' '}&mdash; {order.items[0].variant.name}
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
                              : order.status === 'REFUNDED'
                                ? 'text-yellow-400'
                                : 'text-[#999]'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.stripePaymentId && order.status === 'PAID' ? (
                        <span className="text-[#999] text-xs">Via Stripe Portal</span>
                      ) : (
                        <span className="text-[#999] text-xs">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#333]/50">
            {orders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-sm font-semibold">
                    {order.items[0]?.variant.product.name || 'Payment'}
                  </p>
                  <span
                    className={`text-xs font-bold tracking-[2px] uppercase ${
                      order.status === 'PAID' ? 'text-[#14EAEA]'
                        : order.status === 'FAILED' ? 'text-red-400'
                        : 'text-[#999]'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[#999] text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {formatCents(order.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

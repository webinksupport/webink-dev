import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CreditCard, Receipt, ArrowRight } from 'lucide-react'

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const [subscriptions, recentOrders] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId: session!.user.id, status: 'ACTIVE' },
      include: { variant: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.findMany({
      where: { userId: session!.user.id },
      include: { items: { include: { variant: { include: { product: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Client Portal</h1>
      <p className="text-[#999] mb-8">
        Welcome back, {session!.user.name || session!.user.email}
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#14EAEA]/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#14EAEA]" />
            </div>
            <h2 className="text-lg font-bold text-white">Active Subscriptions</h2>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{subscriptions.length}</p>
          <Link
            href="/dashboard/subscriptions"
            className="text-[#14EAEA] text-sm flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#F813BE]/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-[#F813BE]" />
            </div>
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{recentOrders.length}</p>
          <Link
            href="/dashboard/billing"
            className="text-[#F813BE] text-sm flex items-center gap-1 hover:underline"
          >
            View billing <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Your Services</h2>
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-semibold">
                    {sub.variant.product.name} — {sub.variant.name}
                  </p>
                  <p className="text-[#999] text-sm">
                    {sub.variant.priceMonthly
                      ? `${formatCents(sub.variant.priceMonthly)}/mo`
                      : 'Custom pricing'}
                    {sub.currentPeriodEnd && (
                      <> &middot; Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <span className="text-xs font-bold tracking-[2px] uppercase text-[#14EAEA]">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-semibold">
                    {order.items[0]?.variant.product.name || 'Payment'}
                  </p>
                  <p className="text-[#999] text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {formatCents(order.totalAmount)}
                  </p>
                  <span
                    className={`text-xs font-bold tracking-[2px] uppercase ${
                      order.status === 'PAID' ? 'text-[#14EAEA]' : 'text-[#F813BE]'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subscriptions.length === 0 && recentOrders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#999] text-lg mb-4">
            You don&apos;t have any active services yet.
          </p>
          <Link
            href="/services"
            className="inline-flex bg-[#F813BE] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#d10fa3] transition-colors"
          >
            Browse Services
          </Link>
        </div>
      )}
    </div>
  )
}

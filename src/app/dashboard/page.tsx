import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CreditCard, Receipt, ArrowRight, Settings, FileText } from 'lucide-react'

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const [subscriptions, recentOrders, totalOrders] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId: session!.user.id, status: { in: ['ACTIVE', 'PAST_DUE'] } },
      include: { variant: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.findMany({
      where: { userId: session!.user.id },
      include: { items: { include: { variant: { include: { product: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.order.aggregate({
      where: { userId: session!.user.id, status: 'PAID' },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ])

  const pendingCancellations = subscriptions.filter((s) => s.cancelAtPeriodEnd).length
  const monthlySpend = subscriptions.reduce((sum, s) => sum + (s.variant.priceMonthly || 0), 0)

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Client Portal</h1>
      <p className="text-[#999] mb-8">
        Welcome back, {session!.user.name || session!.user.email}
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#14EAEA]/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#14EAEA]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#14EAEA]">Active</p>
          </div>
          <p className="text-3xl font-bold text-white">{subscriptions.length}</p>
          <p className="text-[#999] text-xs mt-1">subscriptions</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#F813BE]/10 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-[#F813BE]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#F813BE]">Monthly</p>
          </div>
          <p className="text-3xl font-bold text-white">{formatCents(monthlySpend)}</p>
          <p className="text-[#999] text-xs mt-1">recurring spend</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#B9FF33]/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#B9FF33]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#B9FF33]">Total Spent</p>
          </div>
          <p className="text-3xl font-bold text-white">{formatCents(totalOrders._sum.totalAmount || 0)}</p>
          <p className="text-[#999] text-xs mt-1">{totalOrders._count} payments</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#14EAEA]/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-[#14EAEA]" />
            </div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#14EAEA]">Quick Links</p>
          </div>
          <div className="space-y-1">
            <Link href="/dashboard/subscriptions" className="block text-sm text-[#999] hover:text-[#14EAEA] transition-colors">
              Manage Subscriptions
            </Link>
            <Link href="/dashboard/billing" className="block text-sm text-[#999] hover:text-[#F813BE] transition-colors">
              Billing History
            </Link>
            <Link href="/dashboard/settings" className="block text-sm text-[#999] hover:text-white transition-colors">
              Account Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Services</h2>
            <Link
              href="/dashboard/subscriptions"
              className="text-[#14EAEA] text-sm flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
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
                      <> &middot; {sub.cancelAtPeriodEnd ? 'Cancels' : 'Renews'} {new Date(sub.currentPeriodEnd).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <span className={`text-xs font-bold tracking-[2px] uppercase ${
                  sub.cancelAtPeriodEnd ? 'text-yellow-400' :
                  sub.status === 'PAST_DUE' ? 'text-yellow-400' :
                  'text-[#14EAEA]'
                }`}>
                  {sub.cancelAtPeriodEnd ? 'Canceling' : sub.status}
                </span>
              </div>
            ))}
          </div>
          {pendingCancellations > 0 && (
            <p className="text-yellow-400 text-xs mt-3">
              {pendingCancellations} subscription{pendingCancellations > 1 ? 's' : ''} pending cancellation
            </p>
          )}
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Payments</h2>
            <Link
              href="/dashboard/billing"
              className="text-[#F813BE] text-sm flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
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

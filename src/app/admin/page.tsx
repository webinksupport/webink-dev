import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, ShoppingCart, Users, DollarSign, ArrowRight } from 'lucide-react'

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default async function AdminPage() {
  const [
    productCount,
    activeSubCount,
    customerCount,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      include: {
        user: { select: { email: true, name: true } },
        items: { include: { variant: { include: { product: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const totalRevenue = revenueResult._sum.totalAmount || 0

  const stats = [
    {
      label: 'Products',
      value: productCount,
      icon: Package,
      color: '#14EAEA',
      href: '/admin/products',
    },
    {
      label: 'Active Subscriptions',
      value: activeSubCount,
      icon: ShoppingCart,
      color: '#F813BE',
      href: '/admin/orders',
    },
    {
      label: 'Customers',
      value: customerCount,
      icon: Users,
      color: '#B9FF33',
      href: '/admin/customers',
    },
    {
      label: 'Total Revenue',
      value: formatCents(totalRevenue),
      icon: DollarSign,
      color: '#14EAEA',
      href: '/admin/orders',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
      <p className="text-[#999] mb-8">Manage products, orders, and customers</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 hover:border-[#14EAEA] transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-[#999] text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
        <Link
          href="/admin/orders"
          className="text-[#14EAEA] text-sm flex items-center gap-1 hover:underline"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#333]">
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
                Status
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#333]/50 last:border-0"
              >
                <td className="px-6 py-4 text-white text-sm">
                  {order.user.name || order.user.email}
                </td>
                <td className="px-6 py-4 text-[#999] text-sm">
                  {order.items[0]?.variant.product.name || '—'}
                </td>
                <td className="px-6 py-4 text-white text-sm font-semibold">
                  {formatCents(order.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold tracking-[2px] uppercase ${
                      order.status === 'PAID' ? 'text-[#14EAEA]' : 'text-red-400'
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
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#999]">
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

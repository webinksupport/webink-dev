import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CustomerSearch from './CustomerSearch'

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        include: { variant: { include: { product: true } } },
      },
      orders: {
        where: { status: 'PAID' },
        select: { totalAmount: true },
      },
      _count: { select: { orders: true, subscriptions: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const serialized = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    role: c.role,
    suspended: c.suspended,
    createdAt: c.createdAt.toISOString(),
    activeSubscriptions: c.subscriptions.map((s) => ({
      id: s.id,
      productName: s.variant.product.name,
      variantName: s.variant.name,
    })),
    totalSpent: c.orders.reduce((sum, o) => sum + o.totalAmount, 0),
    orderCount: c._count.orders,
    subscriptionCount: c._count.subscriptions,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
          <p className="text-[#999]">{customers.length} registered users</p>
        </div>
      </div>

      <CustomerSearch customers={serialized} />
    </div>
  )
}

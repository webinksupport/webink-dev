import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CustomerDetail from './CustomerDetail'

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      subscriptions: {
        include: { variant: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      },
      orders: {
        include: { items: { include: { variant: { include: { product: true } } } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!customer) notFound()

  const serialized = {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    role: customer.role,
    suspended: customer.suspended,
    notes: customer.notes,
    stripeCustomerId: customer.stripeCustomerId,
    createdAt: customer.createdAt.toISOString(),
    subscriptions: customer.subscriptions.map((s) => ({
      id: s.id,
      status: s.status,
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
      canceledAt: s.canceledAt?.toISOString() || null,
      currentPeriodEnd: s.currentPeriodEnd?.toISOString() || null,
      createdAt: s.createdAt.toISOString(),
      stripeSubscriptionId: s.stripeSubscriptionId,
      variant: {
        name: s.variant.name,
        priceMonthly: s.variant.priceMonthly,
        product: { name: s.variant.product.name },
      },
    })),
    orders: customer.orders.map((o) => ({
      id: o.id,
      status: o.status,
      totalAmount: o.totalAmount,
      stripeFeeAmount: o.stripeFeeAmount,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({
        variant: { name: i.variant.name, product: { name: i.variant.product.name } },
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        total: i.total,
      })),
    })),
  }

  return <CustomerDetail customer={serialized} />
}

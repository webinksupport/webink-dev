import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import SubscriptionsManager from './SubscriptionsManager'

export default async function AdminSubscriptionsPage() {
  await requireAdmin()

  const [subscriptions, products] = await Promise.all([
    prisma.subscription.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        variant: { include: { product: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const mrr = subscriptions
    .filter((s) => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + (s.variant.priceMonthly || 0), 0)

  const serialized = subscriptions.map((s) => ({
    id: s.id,
    status: s.status,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    currentPeriodEnd: s.currentPeriodEnd?.toISOString() || null,
    createdAt: s.createdAt.toISOString(),
    stripeSubscriptionId: s.stripeSubscriptionId,
    user: s.user,
    variant: {
      name: s.variant.name,
      priceMonthly: s.variant.priceMonthly,
      product: s.variant.product,
    },
  }))

  return (
    <SubscriptionsManager
      subscriptions={serialized}
      products={products}
      mrr={mrr}
    />
  )
}

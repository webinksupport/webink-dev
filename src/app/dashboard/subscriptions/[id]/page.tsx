import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CustomerSubscriptionDetail from './CustomerSubscriptionDetail'

export default async function CustomerSubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const { id } = await params

  const subscription = await prisma.subscription.findFirst({
    where: { id, userId: session.user.id },
    include: {
      variant: {
        include: {
          product: {
            include: {
              variants: {
                where: { active: true },
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      },
    },
  })

  if (!subscription) redirect('/dashboard/subscriptions')

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      items: { some: { variantId: subscription.variantId } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <CustomerSubscriptionDetail
      subscription={{
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        currentPeriodStart: subscription.currentPeriodStart?.toISOString() || null,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
        canceledAt: subscription.canceledAt?.toISOString() || null,
        createdAt: subscription.createdAt.toISOString(),
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        variant: {
          id: subscription.variant.id,
          name: subscription.variant.name,
          priceMonthly: subscription.variant.priceMonthly,
          priceAnnual: subscription.variant.priceAnnual,
          billingInterval: subscription.variant.billingInterval,
          product: {
            name: subscription.variant.product.name,
            variants: subscription.variant.product.variants.map(v => ({
              id: v.id,
              name: v.name,
              priceMonthly: v.priceMonthly,
              priceAnnual: v.priceAnnual,
              billingInterval: v.billingInterval,
            })),
          },
        },
      }}
      orders={orders.map(o => ({
        id: o.id,
        status: o.status,
        totalAmount: o.totalAmount,
        createdAt: o.createdAt.toISOString(),
      }))}
    />
  )
}

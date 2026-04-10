import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { action, cancelImmediately } = await request.json()

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (!subscription.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No Stripe subscription linked' }, { status: 400 })
    }

    switch (action) {
      case 'cancel': {
        if (cancelImmediately) {
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
          await prisma.subscription.update({
            where: { id },
            data: { status: 'CANCELED', canceledAt: new Date() },
          })
        } else {
          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true,
          })
          await prisma.subscription.update({
            where: { id },
            data: { cancelAtPeriodEnd: true },
          })
        }
        break
      }

      case 'reactivate': {
        if (subscription.status === 'CANCELED') {
          return NextResponse.json(
            { error: 'Cannot reactivate a fully canceled subscription. Please purchase a new plan.' },
            { status: 400 }
          )
        }
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false,
        })
        await prisma.subscription.update({
          where: { id },
          data: { cancelAtPeriodEnd: false, canceledAt: null },
        })
        break
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error('Subscription action failed:', error)
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}

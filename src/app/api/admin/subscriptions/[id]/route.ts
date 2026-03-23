import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return null
  }
  return session
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { action } = await request.json()

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    if (!subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No Stripe subscription linked' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'cancel': {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        })
        await prisma.subscription.update({
          where: { id },
          data: { cancelAtPeriodEnd: true },
        })
        break
      }

      case 'cancel_immediately': {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
        await prisma.subscription.update({
          where: { id },
          data: { status: 'CANCELED', canceledAt: new Date() },
        })
        break
      }

      case 'resume': {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false,
        })
        await prisma.subscription.update({
          where: { id },
          data: { cancelAtPeriodEnd: false, canceledAt: null },
        })
        break
      }

      case 'pause': {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          pause_collection: { behavior: 'void' },
        })
        await prisma.subscription.update({
          where: { id },
          data: { status: 'PAUSED' },
        })
        break
      }

      case 'unpause': {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          pause_collection: '',
        })
        await prisma.subscription.update({
          where: { id },
          data: { status: 'ACTIVE' },
        })
        break
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error('Admin subscription action failed:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

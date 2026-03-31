import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripeAsync } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { addSubscriptionNote, formatCentsForNote } from '@/lib/subscription-notes'
import {
  sendCancellationEmail,
  sendAdminCancellationNotification,
} from '@/lib/email'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, stripeCustomerId: true } },
      variant: { include: { product: true } },
      notes: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  })

  if (!subscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
  }

  // Get payment method info from Stripe if available
  let paymentMethod: { last4: string; brand: string; expMonth: number; expYear: number } | null = null
  let stripeData: { status: string; currentPeriodEnd: number; cancelAt: number | null } | null = null

  if (subscription.stripeSubscriptionId) {
    try {
      const stripe = await getStripeAsync()
      const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId, {
        expand: ['default_payment_method'],
      })
      stripeData = {
        status: stripeSub.status,
        currentPeriodEnd: stripeSub.items.data[0]?.current_period_end || 0,
        cancelAt: stripeSub.cancel_at,
      }
      const pm = stripeSub.default_payment_method
      if (pm && typeof pm === 'object' && pm.type === 'card' && pm.card) {
        paymentMethod = {
          last4: pm.card.last4,
          brand: pm.card.brand,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
        }
      }
    } catch (err) {
      console.error('Failed to fetch Stripe subscription details:', err)
    }
  }

  // Get related orders
  const orders = await prisma.order.findMany({
    where: {
      userId: subscription.userId,
      items: { some: { variantId: subscription.variantId } },
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  // Get all variants for the same product (for upgrade/downgrade)
  const availableVariants = await prisma.productVariant.findMany({
    where: { productId: subscription.variant.productId, active: true },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json({
    subscription: {
      ...subscription,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
      currentPeriodStart: subscription.currentPeriodStart?.toISOString() || null,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      canceledAt: subscription.canceledAt?.toISOString() || null,
      notes: subscription.notes.map(n => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      })),
    },
    paymentMethod,
    stripeData,
    orders: orders.map(o => ({
      id: o.id,
      status: o.status,
      totalAmount: o.totalAmount,
      stripeFeeAmount: o.stripeFeeAmount,
      createdAt: o.createdAt.toISOString(),
    })),
    availableVariants: availableVariants.map(v => ({
      id: v.id,
      name: v.name,
      priceMonthly: v.priceMonthly,
      priceAnnual: v.priceAnnual,
      billingInterval: v.billingInterval,
    })),
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        variant: { include: { product: { select: { name: true } } } },
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (!subscription.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No Stripe subscription linked' }, { status: 400 })
    }

    const stripe = await getStripeAsync()

    switch (action) {
      case 'cancel': {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        })
        await prisma.subscription.update({
          where: { id },
          data: { cancelAtPeriodEnd: true },
        })
        await addSubscriptionNote({
          subscriptionId: id,
          type: 'CANCELLED',
          message: `Subscription set to cancel at period end (by admin: ${admin.user.email})`,
          metadata: { cancelledBy: 'admin', adminEmail: admin.user.email },
        })
        // Send cancellation email to customer
        try {
          await sendCancellationEmail({
            to: subscription.user.email,
            customerName: subscription.user.name || 'Customer',
            productName: subscription.variant.product.name,
            variantName: subscription.variant.name,
            periodEndDate: subscription.currentPeriodEnd,
          })
        } catch { /* non-critical */ }
        try {
          await sendAdminCancellationNotification({
            customerName: subscription.user.name || 'Customer',
            customerEmail: subscription.user.email,
            productName: subscription.variant.product.name,
            variantName: subscription.variant.name,
            cancelledBy: 'admin',
          })
        } catch { /* non-critical */ }
        break
      }

      case 'cancel_immediately': {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
        await prisma.subscription.update({
          where: { id },
          data: { status: 'CANCELED', canceledAt: new Date() },
        })
        await addSubscriptionNote({
          subscriptionId: id,
          type: 'CANCELLED',
          message: `Subscription cancelled immediately (by admin: ${admin.user.email})`,
          metadata: { cancelledBy: 'admin', immediate: true, adminEmail: admin.user.email },
        })
        try {
          await sendCancellationEmail({
            to: subscription.user.email,
            customerName: subscription.user.name || 'Customer',
            productName: subscription.variant.product.name,
            variantName: subscription.variant.name,
            periodEndDate: null,
          })
        } catch { /* non-critical */ }
        try {
          await sendAdminCancellationNotification({
            customerName: subscription.user.name || 'Customer',
            customerEmail: subscription.user.email,
            productName: subscription.variant.product.name,
            variantName: subscription.variant.name,
            cancelledBy: 'admin',
          })
        } catch { /* non-critical */ }
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
        await addSubscriptionNote({
          subscriptionId: id,
          type: 'REACTIVATED',
          message: `Subscription reactivated (by admin: ${admin.user.email})`,
          metadata: { reactivatedBy: 'admin', adminEmail: admin.user.email },
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
        await addSubscriptionNote({
          subscriptionId: id,
          type: 'STATUS_CHANGED',
          message: `Subscription paused (by admin: ${admin.user.email})`,
          metadata: { action: 'pause', adminEmail: admin.user.email },
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
        await addSubscriptionNote({
          subscriptionId: id,
          type: 'STATUS_CHANGED',
          message: `Subscription unpaused (by admin: ${admin.user.email})`,
          metadata: { action: 'unpause', adminEmail: admin.user.email },
        })
        break
      }

      case 'change_variant': {
        const { newVariantId } = body
        if (!newVariantId) {
          return NextResponse.json({ error: 'newVariantId required' }, { status: 400 })
        }
        const newVariant = await prisma.productVariant.findUnique({
          where: { id: newVariantId },
          include: { product: true },
        })
        if (!newVariant || !newVariant.stripePriceId) {
          return NextResponse.json({ error: 'Invalid variant or no Stripe price' }, { status: 400 })
        }

        // Get current Stripe subscription to find the item ID
        const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
        const itemId = stripeSub.items.data[0]?.id
        if (!itemId) {
          return NextResponse.json({ error: 'No subscription item found' }, { status: 400 })
        }

        // Update Stripe subscription (proration happens automatically)
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          items: [{ id: itemId, price: newVariant.stripePriceId }],
          proration_behavior: 'create_prorations',
        })

        const oldVariantName = subscription.variant.name
        await prisma.subscription.update({
          where: { id },
          data: { variantId: newVariantId },
        })

        const isUpgrade = (newVariant.priceMonthly || 0) > (subscription.variant.priceMonthly || 0)
        await addSubscriptionNote({
          subscriptionId: id,
          type: isUpgrade ? 'UPGRADED' : 'DOWNGRADED',
          message: `${isUpgrade ? 'Upgraded' : 'Downgraded'} from ${oldVariantName} to ${newVariant.name} (by admin: ${admin.user.email})`,
          metadata: {
            fromVariant: subscription.variantId,
            toVariant: newVariantId,
            fromPrice: subscription.variant.priceMonthly,
            toPrice: newVariant.priceMonthly,
            adminEmail: admin.user.email,
          },
        })
        break
      }

      case 'retry_payment': {
        // Get the latest unpaid invoice for this subscription
        const invoices = await stripe.invoices.list({
          subscription: subscription.stripeSubscriptionId,
          status: 'open',
          limit: 1,
        })
        if (invoices.data.length === 0) {
          return NextResponse.json({ error: 'No open invoice to retry' }, { status: 400 })
        }
        await stripe.invoices.pay(invoices.data[0].id)
        await addSubscriptionNote({
          subscriptionId: id,
          type: 'PAYMENT_RETRY',
          message: `Payment retry attempted (by admin: ${admin.user.email})`,
          metadata: { invoiceId: invoices.data[0].id, adminEmail: admin.user.email },
        })
        break
      }

      case 'add_note': {
        const { message } = body
        if (!message?.trim()) {
          return NextResponse.json({ error: 'Message required' }, { status: 400 })
        }
        await addSubscriptionNote({
          subscriptionId: id,
          type: 'ADMIN_NOTE',
          message: message.trim(),
          metadata: { adminEmail: admin.user.email },
        })
        break
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error('Admin subscription action failed:', error)
    const msg = error instanceof Error ? error.message : 'Failed to update subscription'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

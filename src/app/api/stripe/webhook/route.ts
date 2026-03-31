import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getStripeAsync } from '@/lib/stripe'
import { getSetting } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import {
  sendPurchaseConfirmation,
  sendAdminOrderNotification,
  sendCancellationEmail,
  sendAdminCancellationNotification,
  sendPaymentFailedEmail,
  sendAdminPaymentFailedNotification,
} from '@/lib/email'
import { addSubscriptionNote, formatCentsForNote } from '@/lib/subscription-notes'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = await getSetting('STRIPE_WEBHOOK_SECRET')
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not found in Settings DB or environment')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let stripe: Stripe
  try {
    stripe = await getStripeAsync()
  } catch (err) {
    console.error('Failed to initialize Stripe:', err)
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session, stripe)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, stripe)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, stripe)
        break
      default:
        break
    }
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session, stripe: Stripe) {
  const userId = session.metadata?.userId
  const variantId = session.metadata?.variantId
  if (!userId || !variantId) return

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  })
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (session.mode === 'payment') {
    await prisma.order.create({
      data: {
        userId,
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string | null,
        status: 'PAID',
        totalAmount: session.amount_total ?? 0,
        items: {
          create: {
            variantId,
            quantity: 1,
            unitPrice: session.amount_total ?? 0,
            total: session.amount_total ?? 0,
          },
        },
      },
    })
    console.log(`[webhook] Created order for user ${userId}, variant ${variantId}`)
  } else if (session.mode === 'subscription') {
    const stripeSubId = session.subscription as string | null

    if (stripeSubId) {
      const stripeSub = await stripe.subscriptions.retrieve(stripeSubId)
      const periodStart = new Date(stripeSub.start_date * 1000)
      const periodEnd = stripeSub.cancel_at ? new Date(stripeSub.cancel_at * 1000) : null

      const sub = await prisma.subscription.upsert({
        where: { stripeSubscriptionId: stripeSubId },
        update: {
          status: 'ACTIVE',
          variantId,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        },
        create: {
          userId,
          variantId,
          stripeSubscriptionId: stripeSubId,
          status: 'ACTIVE',
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        },
      })
      console.log(`[webhook] Created/updated subscription ${stripeSubId} for user ${userId}`)

      // Log subscription note
      await addSubscriptionNote({
        subscriptionId: sub.id,
        type: 'CREATED',
        message: `Subscription created: ${variant?.product.name} — ${variant?.name} (${formatCentsForNote(session.amount_total ?? 0)})`,
        metadata: { variantId, amount: session.amount_total },
      })

      try {
        await stripe.subscriptions.update(stripeSubId, {
          metadata: { variantId, userId },
        })
      } catch {
        // Non-critical
      }
    }

    await prisma.order.create({
      data: {
        userId,
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string | null,
        status: 'PAID',
        totalAmount: session.amount_total ?? 0,
        items: {
          create: {
            variantId,
            quantity: 1,
            unitPrice: session.amount_total ?? 0,
            total: session.amount_total ?? 0,
          },
        },
      },
    })
    console.log(`[webhook] Created initial order for subscription checkout, user ${userId}`)
  }

  // Send purchase confirmation email to customer
  if (user?.email && variant) {
    try {
      await sendPurchaseConfirmation({
        to: user.email,
        customerName: user.name || 'Customer',
        productName: variant.product.name,
        variantName: variant.name,
        amount: session.amount_total ?? 0,
        isSubscription: session.mode === 'subscription',
      })
      console.log(`[webhook] Sent purchase confirmation email to ${user.email}`)
    } catch (emailErr) {
      console.error('[webhook] Failed to send confirmation email:', emailErr)
    }
  }

  // Send admin notification
  if (user && variant) {
    try {
      await sendAdminOrderNotification({
        customerName: user.name || 'Customer',
        customerEmail: user.email,
        productName: variant.product.name,
        variantName: variant.name,
        amount: session.amount_total ?? 0,
        isSubscription: session.mode === 'subscription',
      })
      console.log(`[webhook] Sent admin order notification`)
    } catch (emailErr) {
      console.error('[webhook] Failed to send admin notification:', emailErr)
    }
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })
  if (!user) return

  const statusMap: Record<string, 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID' | 'PAUSED' | 'PENDING'> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    unpaid: 'UNPAID',
    paused: 'PAUSED',
    trialing: 'ACTIVE',
    incomplete: 'PENDING',
    incomplete_expired: 'CANCELED',
  }

  const status = statusMap[subscription.status] || 'PENDING'

  const existingSub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  const variantId = subscription.metadata?.variantId || existingSub?.variantId
  if (!variantId) return

  const periodStart = new Date(subscription.start_date * 1000)
  const periodEnd = subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    },
    create: {
      userId: user.id,
      variantId,
      stripeSubscriptionId: subscription.id,
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })

  // Log status change note if status changed
  if (existingSub && existingSub.status !== status) {
    await addSubscriptionNote({
      subscriptionId: existingSub.id,
      type: 'STATUS_CHANGED',
      message: `Status changed from ${existingSub.status} to ${status}`,
      metadata: { from: existingSub.status, to: status, stripeStatus: subscription.status },
    })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: {
      user: { select: { name: true, email: true } },
      variant: { include: { product: { select: { name: true } } } },
    },
  })

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'CANCELED', canceledAt: new Date() },
  })

  if (sub) {
    // Log cancellation note
    await addSubscriptionNote({
      subscriptionId: sub.id,
      type: 'CANCELLED',
      message: `Subscription cancelled via Stripe (customer.subscription.deleted)`,
      metadata: { cancelledBy: 'stripe' },
    })

    // Send cancellation email to customer
    try {
      await sendCancellationEmail({
        to: sub.user.email,
        customerName: sub.user.name || 'Customer',
        productName: sub.variant.product.name,
        variantName: sub.variant.name,
        periodEndDate: sub.currentPeriodEnd,
      })
      console.log(`[webhook] Sent cancellation email to ${sub.user.email}`)
    } catch (err) {
      console.error('[webhook] Failed to send cancellation email:', err)
    }

    // Send admin cancellation notification
    try {
      await sendAdminCancellationNotification({
        customerName: sub.user.name || 'Customer',
        customerEmail: sub.user.email,
        productName: sub.variant.product.name,
        variantName: sub.variant.name,
        cancelledBy: 'stripe',
      })
    } catch (err) {
      console.error('[webhook] Failed to send admin cancellation notification:', err)
    }
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, stripe: Stripe) {
  const isSubscriptionInvoice =
    invoice.billing_reason === 'subscription_create' ||
    invoice.billing_reason === 'subscription_cycle' ||
    invoice.billing_reason === 'subscription_update'

  if (!isSubscriptionInvoice) return

  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
  if (!user) return

  const invoiceId = invoice.id
  const existingOrder = await prisma.order.findFirst({ where: { stripePaymentId: invoiceId } })
  if (existingOrder) return

  let stripeFeeAmount: number | null = null
  try {
    const fullInvoice = await stripe.invoices.retrieve(invoiceId, {
      expand: ['charge.balance_transaction'],
    })
    const charge = (fullInvoice as unknown as Record<string, unknown>).charge
    if (charge && typeof charge === 'object' && charge !== null) {
      const bt = (charge as Record<string, unknown>).balance_transaction
      if (bt && typeof bt === 'object' && bt !== null) {
        stripeFeeAmount = (bt as { fee: number }).fee
      }
    }
  } catch {
    // Fee lookup failed
  }

  const subscriptionLineItem = invoice.lines?.data?.find((line) => line.subscription != null)
  const stripeSubId =
    typeof subscriptionLineItem?.subscription === 'string'
      ? subscriptionLineItem.subscription
      : subscriptionLineItem?.subscription?.id

  const sub = stripeSubId
    ? await prisma.subscription.findUnique({ where: { stripeSubscriptionId: stripeSubId } })
    : null

  await prisma.order.create({
    data: {
      userId: user.id,
      stripePaymentId: invoiceId,
      status: 'PAID',
      totalAmount: invoice.amount_paid,
      stripeFeeAmount,
      items: sub
        ? {
            create: {
              variantId: sub.variantId,
              quantity: 1,
              unitPrice: invoice.amount_paid,
              total: invoice.amount_paid,
            },
          }
        : undefined,
    },
  })

  // Log payment success note
  if (sub) {
    await addSubscriptionNote({
      subscriptionId: sub.id,
      type: 'PAYMENT_SUCCESS',
      message: `Payment of ${formatCentsForNote(invoice.amount_paid)} succeeded`,
      metadata: { amount: invoice.amount_paid, invoiceId, billingReason: invoice.billing_reason },
    })
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, stripe: Stripe) {
  const isSubscriptionInvoice =
    invoice.billing_reason === 'subscription_create' ||
    invoice.billing_reason === 'subscription_cycle' ||
    invoice.billing_reason === 'subscription_update'

  if (!isSubscriptionInvoice) return

  const failedLineItem = invoice.lines?.data?.find((line) => line.subscription != null)
  const failedSubId =
    typeof failedLineItem?.subscription === 'string'
      ? failedLineItem.subscription
      : failedLineItem?.subscription?.id

  if (!failedSubId) return

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: failedSubId },
    data: { status: 'PAST_DUE' },
  })

  // Get subscription details for notifications
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: failedSubId },
    include: {
      user: { select: { name: true, email: true } },
      variant: { include: { product: { select: { name: true } } } },
    },
  })

  // Get failure reason from Stripe
  let failureReason: string | undefined
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoiceAny = invoice as any
    if (invoiceAny.charge) {
      const chargeId = typeof invoiceAny.charge === 'string' ? invoiceAny.charge : invoiceAny.charge.id
      const charge = await stripe.charges.retrieve(chargeId)
      failureReason = charge.failure_code || charge.failure_message || undefined
    }
  } catch {
    // couldn't get failure reason
  }

  if (sub) {
    // Log payment failed note
    await addSubscriptionNote({
      subscriptionId: sub.id,
      type: 'PAYMENT_FAILED',
      message: `Payment of ${formatCentsForNote(invoice.amount_due)} failed${failureReason ? ` — ${failureReason.replace(/_/g, ' ')}` : ''}`,
      metadata: { amount: invoice.amount_due, failureReason, invoiceId: invoice.id },
    })

    // Send payment failed email to customer
    try {
      await sendPaymentFailedEmail({
        to: sub.user.email,
        customerName: sub.user.name || 'Customer',
        productName: sub.variant.product.name,
        amount: invoice.amount_due,
        failureReason,
      })
      console.log(`[webhook] Sent payment failed email to ${sub.user.email}`)
    } catch (err) {
      console.error('[webhook] Failed to send payment failed email:', err)
    }

    // Send admin payment failed notification
    try {
      await sendAdminPaymentFailedNotification({
        customerName: sub.user.name || 'Customer',
        customerEmail: sub.user.email,
        productName: sub.variant.product.name,
        amount: invoice.amount_due,
        failureReason,
      })
    } catch (err) {
      console.error('[webhook] Failed to send admin payment failed notification:', err)
    }
  }
}

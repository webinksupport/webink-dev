import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        // Unhandled event type — log and move on
        break
    }
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const variantId = session.metadata?.variantId

  if (!userId || !variantId) return

  if (session.mode === 'payment') {
    // One-time purchase — create order
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
  }
  // Subscription checkouts are handled by customer.subscription.created
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

  // Map Stripe status to our enum
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

  // Try to find variant from metadata or existing subscription
  const existingSub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  const variantId =
    subscription.metadata?.variantId || existingSub?.variantId

  if (!variantId) return

  // In Stripe API 2026+, current_period_start/end are on invoice items, not subscription.
  // Use start_date for period start, and cancel_at or next_pending_invoice for period end.
  const periodStart = new Date(subscription.start_date * 1000)
  const periodEnd = subscription.cancel_at
    ? new Date(subscription.cancel_at * 1000)
    : null

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
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
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  })
}

/**
 * On successful payment, record order with GROSS revenue.
 * Stripe fee is stored separately for later QBO expense entry.
 * Per CLAUDE.md Section 13: DO NOT sync Stripe fees as part of order —
 * record gross revenue, then create separate expense entry for the fee.
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Only process subscription-related invoices
  const isSubscriptionInvoice =
    invoice.billing_reason === 'subscription_create' ||
    invoice.billing_reason === 'subscription_cycle' ||
    invoice.billing_reason === 'subscription_update'

  if (!isSubscriptionInvoice) return

  const customerId =
    typeof invoice.customer === 'string'
      ? invoice.customer
      : invoice.customer?.id

  if (!customerId) return

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) return

  // Use invoice ID as the unique reference for dedup
  const invoiceId = invoice.id

  // Check if order already exists for this invoice
  const existingOrder = await prisma.order.findFirst({
    where: { stripePaymentId: invoiceId },
  })
  if (existingOrder) return

  // Retrieve Stripe fee from the invoice's payment via Stripe API
  let stripeFeeAmount: number | null = null

  try {
    // Expand the invoice to get charge/balance_transaction for fee info
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
    // Fee lookup failed — record order without fee info
  }

  // Find the subscription from the invoice line items
  const subscriptionLineItem = invoice.lines?.data?.find(
    (line) => line.subscription != null
  )

  const stripeSubId =
    typeof subscriptionLineItem?.subscription === 'string'
      ? subscriptionLineItem.subscription
      : subscriptionLineItem?.subscription?.id

  const sub = stripeSubId
    ? await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: stripeSubId },
      })
    : null

  await prisma.order.create({
    data: {
      userId: user.id,
      stripePaymentId: invoiceId,
      status: 'PAID',
      totalAmount: invoice.amount_paid, // GROSS revenue — full amount customer paid
      stripeFeeAmount, // Stored separately — will become QBO expense entry
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
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Only process subscription invoices
  const isSubscriptionInvoice =
    invoice.billing_reason === 'subscription_create' ||
    invoice.billing_reason === 'subscription_cycle' ||
    invoice.billing_reason === 'subscription_update'

  if (!isSubscriptionInvoice) return

  // Find subscription from line items
  const failedLineItem = invoice.lines?.data?.find(
    (line) => line.subscription != null
  )

  const failedSubId =
    typeof failedLineItem?.subscription === 'string'
      ? failedLineItem.subscription
      : failedLineItem?.subscription?.id

  if (!failedSubId) return

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: failedSubId },
    data: { status: 'PAST_DUE' },
  })
}

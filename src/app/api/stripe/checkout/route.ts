import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { authOptions } from '@/lib/auth'
import { getStripeAsync } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    const { variantId, tier, billing } = await request.json()

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      )
    }

    // Require authentication — no guest checkout
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in to make a purchase.', redirect: '/auth/signin' },
        { status: 401 }
      )
    }

    let stripe
    try {
      stripe = await getStripeAsync()
    } catch {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please contact support.' },
        { status: 500 }
      )
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    })

    if (!variant || !variant.active || variant.contactOnly) {
      return NextResponse.json(
        { error: 'Product not available for purchase' },
        { status: 400 }
      )
    }

    if (!variant.stripePriceId) {
      return NextResponse.json(
        { error: 'This product has not been synced to Stripe yet. Please contact support.' },
        { status: 400 }
      )
    }

    // Resolve Stripe customer for authenticated user
    let stripeCustomerId: string | undefined
    let userId: string | undefined

    if (session?.user?.id) {
      // Try by ID first, then fall back to email lookup (handles stale sessions after DB reset)
      let user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (!user && session.user.email) {
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
      }

      if (user) {
        userId = user.id

        if (user.stripeCustomerId) {
          stripeCustomerId = user.stripeCustomerId
        } else {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: { userId: user.id },
          })
          stripeCustomerId = customer.id

          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId },
          })
        }
      }
    }

    const isSubscription = variant.product.type === 'SUBSCRIPTION' || variant.product.type === 'VARIABLE_SUBSCRIPTION'
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'

    // Use synced stripePriceId if available, otherwise build price_data inline
    const useExistingPrice = !!variant.stripePriceId

    type LineItem = {
      price?: string
      price_data?: {
        currency: string
        product_data: { name: string; description?: string }
        unit_amount: number
        recurring?: { interval: 'month' | 'year' }
      }
      quantity: number
    }

    let lineItem: LineItem

    if (useExistingPrice) {
      lineItem = {
        price: variant.stripePriceId!,
        quantity: 1,
      }
    } else {
      // Fallback: build price inline
      const unitAmount =
        variant.salePrice ??
        variant.priceMonthly ??
        variant.priceOneTime ??
        0

      if (unitAmount === 0) {
        return NextResponse.json(
          { error: 'Invalid product pricing' },
          { status: 400 }
        )
      }

      lineItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${variant.product.name} — ${variant.name}`,
            description: variant.product.description || undefined,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      }

      if (isSubscription) {
        const interval =
          variant.billingInterval === 'ANNUAL' ? 'year' : 'month'
        lineItem.price_data!.recurring = { interval }
      }
    }

    // Add setup fee as a separate one-time line item if applicable
    const setupFeeAmount = variant.setupFee ?? variant.product.setupFee ?? 0
    const lineItems: LineItem[] = [lineItem]

    if (setupFeeAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${variant.product.name} — Setup Fee`,
          },
          unit_amount: setupFeeAmount,
        },
        quantity: 1,
      })
    }

    // Build checkout session options — authenticated user only
    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product=${variant.product.slug}`,
      cancel_url: `${baseUrl}/products/${variant.product.slug}?checkout=canceled${tier ? `&tier=${encodeURIComponent(tier)}` : ''}${billing ? `&billing=${encodeURIComponent(billing)}` : ''}`,
      metadata: {
        ...(userId && { userId }),
        variantId: variant.id,
        productId: variant.product.id,
      },
    }

    if (stripeCustomerId) {
      checkoutParams.customer = stripeCustomerId
    } else {
      // Auth is required but Stripe customer wasn't created — this shouldn't happen
      // since we create one above for authenticated users, but guard against edge cases
      return NextResponse.json(
        { error: 'Please sign in to make a purchase.', redirect: '/auth/signin' },
        { status: 401 }
      )
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams)

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

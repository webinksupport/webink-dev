import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { variantId } = await request.json()

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId

    if (!stripeCustomerId) {
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

    const isSubscription = variant.product.type === 'SUBSCRIPTION'
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'

    // Determine price in cents
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

    const lineItem: {
      price_data: {
        currency: string
        product_data: { name: string; description?: string }
        unit_amount: number
        recurring?: { interval: 'month' | 'year' }
      }
      quantity: number
    } = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${variant.product.name} — ${variant.name}`,
          description: variant.product.description,
        },
        unit_amount: unitAmount,
      },
      quantity: 1,
    }

    if (isSubscription) {
      const interval =
        variant.billingInterval === 'ANNUAL' ? 'year' : 'month'
      lineItem.price_data.recurring = { interval }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [lineItem],
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/services?checkout=canceled`,
      metadata: {
        userId: user.id,
        variantId: variant.id,
        productId: variant.product.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

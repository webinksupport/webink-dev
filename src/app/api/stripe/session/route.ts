import { NextResponse } from 'next/server'
import { getStripeAsync } from '@/lib/stripe'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
    }

    let stripe
    try {
      stripe = await getStripeAsync()
    } catch {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    })

    const lineItem = session.line_items?.data[0]
    const price = lineItem?.price
    const product = price?.product
    const productName = typeof product === 'object' && product !== null && 'name' in product
      ? (product as { name: string }).name
      : null

    return NextResponse.json({
      customerEmail: session.customer_details?.email || null,
      amountTotal: session.amount_total,
      currency: session.currency,
      productName,
      interval: price?.recurring?.interval || null,
      metadata: session.metadata,
    })
  } catch (error) {
    console.error('Stripe session retrieval error:', error)
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 })
  }
}

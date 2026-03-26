import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStripeAsync } from '@/lib/stripe'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let stripe
    try {
      stripe = await getStripeAsync()
    } catch {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add your Stripe keys in Settings > Integrations first.' },
        { status: 400 }
      )
    }

    const products = await prisma.product.findMany({
      where: { active: true, status: 'ACTIVE' },
      include: { variants: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
    })

    let created = 0
    let skipped = 0

    for (const product of products) {
      // Create or retrieve Stripe Product
      let stripeProductId = product.stripeProductId
      if (!stripeProductId) {
        const stripeProduct = await stripe.products.create({
          name: product.name,
          description: product.shortDescription || product.description || undefined,
        })
        stripeProductId = stripeProduct.id
        await prisma.product.update({
          where: { id: product.id },
          data: { stripeProductId },
        })
      }

      // Create Stripe Prices for each variant
      for (const variant of product.variants) {
        if (variant.stripePriceId || variant.contactOnly) {
          skipped++
          continue
        }

        const priceData: {
          product: string
          currency: string
          unit_amount?: number
          recurring?: { interval: 'month' | 'year' }
        } = {
          product: stripeProductId,
          currency: 'usd',
        }

        if (variant.billingInterval === 'ONE_TIME') {
          priceData.unit_amount = variant.priceOneTime || 0
        } else if (variant.billingInterval === 'MONTHLY') {
          priceData.unit_amount = variant.priceMonthly || 0
          priceData.recurring = { interval: 'month' }
        } else if (variant.billingInterval === 'ANNUAL') {
          priceData.unit_amount = variant.priceAnnual || 0
          priceData.recurring = { interval: 'year' }
        }

        if (!priceData.unit_amount) {
          skipped++
          continue
        }

        const stripePrice = await stripe.prices.create(priceData)
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: { stripePriceId: stripePrice.id, stripeProductId },
        })
        created++
      }
    }

    return NextResponse.json({
      message: `Synced to Stripe: ${created} price(s) created, ${skipped} skipped`,
      created,
      skipped,
    })
  } catch (err) {
    console.error('Stripe sync error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to sync products to Stripe' },
      { status: 500 }
    )
  }
}

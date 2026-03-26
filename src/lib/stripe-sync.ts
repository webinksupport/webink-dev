import { prisma } from '@/lib/prisma'
import { getStripeAsync } from '@/lib/stripe'
import type Stripe from 'stripe'

/**
 * Idempotent Stripe sync: reads products from DB, creates Stripe Products/Prices
 * only if they don't already exist. Safe to run multiple times.
 */
export async function syncProductsToStripe(): Promise<{
  created: number
  skipped: number
  linked: number
  errors: string[]
}> {
  let stripe: Stripe
  try {
    stripe = await getStripeAsync()
  } catch {
    return { created: 0, skipped: 0, linked: 0, errors: ['Stripe not configured'] }
  }

  const products = await prisma.product.findMany({
    where: { active: true, status: 'ACTIVE' },
    include: { variants: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
  })

  let created = 0
  let skipped = 0
  let linked = 0
  const errors: string[] = []

  for (const product of products) {
    try {
      let stripeProductId = product.stripeProductId

      // If no stripeProductId saved, try to find existing Stripe product by name
      if (!stripeProductId) {
        const existing = await stripe.products.search({
          query: `name:"${product.name.replace(/"/g, '\\"')}"`,
          limit: 1,
        })

        if (existing.data.length > 0) {
          stripeProductId = existing.data[0].id
          await prisma.product.update({
            where: { id: product.id },
            data: { stripeProductId },
          })
          linked++
        } else {
          // Create new Stripe Product
          const stripeProduct = await stripe.products.create({
            name: product.name,
            description: product.shortDescription || product.description || undefined,
            metadata: { dbProductId: product.id },
          })
          stripeProductId = stripeProduct.id
          await prisma.product.update({
            where: { id: product.id },
            data: { stripeProductId },
          })
          created++
        }
      } else {
        skipped++
      }

      // Sync variants → Stripe Prices
      for (const variant of product.variants) {
        if (variant.stripePriceId || variant.contactOnly) {
          continue
        }

        const priceData: Stripe.PriceCreateParams = {
          product: stripeProductId,
          currency: 'usd',
          metadata: { dbVariantId: variant.id },
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
          continue
        }

        // Check if a matching price already exists on Stripe
        const existingPrices = await stripe.prices.list({
          product: stripeProductId,
          active: true,
          limit: 100,
        })

        const matchingPrice = existingPrices.data.find(
          (p) =>
            p.unit_amount === priceData.unit_amount &&
            (priceData.recurring
              ? p.recurring?.interval === priceData.recurring.interval
              : !p.recurring)
        )

        if (matchingPrice) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { stripePriceId: matchingPrice.id, stripeProductId },
          })
          linked++
          continue
        }

        const stripePrice = await stripe.prices.create(priceData)
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: { stripePriceId: stripePrice.id, stripeProductId },
        })
        created++
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`${product.name}: ${msg}`)
      console.error(`Stripe sync error for "${product.name}":`, err)
    }
  }

  return { created, skipped, linked, errors }
}

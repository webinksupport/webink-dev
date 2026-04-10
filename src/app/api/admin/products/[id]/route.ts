import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { BillingInterval, VariantStatus } from '@/generated/prisma/enums'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const { variants, ...productData } = body

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check slug uniqueness if slug is being changed
    if (productData.slug && productData.slug !== existingProduct.slug) {
      const slugConflict = await prisma.product.findUnique({
        where: { slug: productData.slug },
      })
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Handle variant updates within a transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update the product fields
      const updatedProduct = await tx.product.update({
        where: { id },
        data: productData,
      })

      // Process variants if provided
      if (variants && Array.isArray(variants)) {
        const incomingIds = variants
          .filter((v: Record<string, unknown>) => v.id)
          .map((v: Record<string, unknown>) => v.id as string)

        // Delete variants that are no longer in the list
        const existingVariantIds = existingProduct.variants.map((v) => v.id)
        const idsToDelete = existingVariantIds.filter(
          (existingId) => !incomingIds.includes(existingId)
        )

        if (idsToDelete.length > 0) {
          await tx.productVariant.deleteMany({
            where: { id: { in: idsToDelete } },
          })
        }

        // Update existing variants and create new ones
        for (const variant of variants as Record<string, unknown>[]) {
          if (variant.id) {
            // Update existing variant
            await tx.productVariant.update({
              where: { id: variant.id as string },
              data: {
                name: variant.name as string,
                priceMonthly: (variant.priceMonthly as number) ?? null,
                priceAnnual: (variant.priceAnnual as number) ?? null,
                priceOneTime: (variant.priceOneTime as number) ?? null,
                salePrice: (variant.salePrice as number) ?? null,
                setupFee: (variant.setupFee as number) ?? null,
                billingInterval: (variant.billingInterval ?? 'MONTHLY') as BillingInterval,
                trialDays: (variant.trialDays as number) ?? null,
                stripePriceId: (variant.stripePriceId as string) ?? null,
                stripeProductId: (variant.stripeProductId as string) ?? null,
                contactOnly: (variant.contactOnly as boolean) ?? false,
                active: (variant.active as boolean) ?? true,
                status: (variant.status ?? 'ACTIVE') as VariantStatus,
                sortOrder: (variant.sortOrder as number) ?? 0,
              },
            })
          } else {
            // Create new variant
            await tx.productVariant.create({
              data: {
                productId: id,
                name: variant.name as string,
                priceMonthly: (variant.priceMonthly as number) ?? null,
                priceAnnual: (variant.priceAnnual as number) ?? null,
                priceOneTime: (variant.priceOneTime as number) ?? null,
                salePrice: (variant.salePrice as number) ?? null,
                setupFee: (variant.setupFee as number) ?? null,
                billingInterval: (variant.billingInterval ?? 'MONTHLY') as BillingInterval,
                trialDays: (variant.trialDays as number) ?? null,
                stripePriceId: (variant.stripePriceId as string) ?? null,
                stripeProductId: (variant.stripeProductId as string) ?? null,
                contactOnly: (variant.contactOnly as boolean) ?? false,
                active: (variant.active as boolean) ?? true,
                status: (variant.status ?? 'ACTIVE') as VariantStatus,
                sortOrder: (variant.sortOrder as number) ?? 0,
              },
            })
          }
        }
      }

      return updatedProduct
    })

    // Fetch the final product with updated variants
    const result = await prisma.product.findUnique({
      where: { id: product.id },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete variants first, then the product
    await prisma.$transaction([
      prisma.productVariant.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ])

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

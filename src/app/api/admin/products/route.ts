import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      shortDescription,
      category,
      type,
      status,
      active,
      featured,
      setupFee,
      billingInterval,
      trialDays,
      sortOrder,
      stripeProductId,
      variants,
    } = body

    if (!name || !slug || !description || !category || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, description, category, type' },
        { status: 400 }
      )
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })
    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription: shortDescription ?? null,
        category,
        type,
        status: status ?? 'ACTIVE',
        active: active ?? true,
        featured: featured ?? false,
        setupFee: setupFee ?? null,
        billingInterval: billingInterval ?? null,
        trialDays: trialDays ?? null,
        sortOrder: sortOrder ?? 0,
        stripeProductId: stripeProductId ?? null,
        variants: variants?.length
          ? {
              create: variants.map((v: Record<string, unknown>, index: number) => ({
                name: v.name as string,
                priceMonthly: (v.priceMonthly as number) ?? null,
                priceAnnual: (v.priceAnnual as number) ?? null,
                priceOneTime: (v.priceOneTime as number) ?? null,
                salePrice: (v.salePrice as number) ?? null,
                setupFee: (v.setupFee as number) ?? null,
                billingInterval: (v.billingInterval as string) ?? 'MONTHLY',
                trialDays: (v.trialDays as number) ?? null,
                stripePriceId: (v.stripePriceId as string) ?? null,
                stripeProductId: (v.stripeProductId as string) ?? null,
                contactOnly: (v.contactOnly as boolean) ?? false,
                active: (v.active as boolean) ?? true,
                status: (v.status as string) ?? 'ACTIVE',
                sortOrder: (v.sortOrder as number) ?? index,
              })),
            }
          : undefined,
      },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const productId = searchParams.get('productId')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (productId) where.variant = { productId }

  const subscriptions = await prisma.subscription.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      variant: { include: { product: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate MRR from active subscriptions
  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: 'ACTIVE' },
    include: { variant: true },
  })

  const mrr = activeSubscriptions.reduce((sum, sub) => {
    const price = sub.variant.priceMonthly || 0
    return sum + price
  }, 0)

  return NextResponse.json({ subscriptions, mrr })
}

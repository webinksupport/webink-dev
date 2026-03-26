import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      subscriptions: {
        include: { variant: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      },
      orders: {
        include: { items: { include: { variant: { include: { product: true } } } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  return NextResponse.json(customer)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const data: Record<string, unknown> = {}
  if (body.notes !== undefined) data.notes = body.notes
  if (body.suspended !== undefined) data.suspended = Boolean(body.suspended)
  if (body.role !== undefined && (body.role === 'ADMIN' || body.role === 'CUSTOMER')) {
    data.role = body.role
  }

  const user = await prisma.user.update({
    where: { id },
    data,
  })

  return NextResponse.json({ success: true, user: { id: user.id, notes: user.notes, suspended: user.suspended, role: user.role } })
}

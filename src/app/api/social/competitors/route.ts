import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const competitors = await prisma.socialCompetitor.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(competitors)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.handle) {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 })
  }

  const competitor = await prisma.socialCompetitor.create({
    data: {
      handle: body.handle.replace('@', ''),
      displayName: body.displayName || null,
      notes: body.notes || null,
    },
  })
  return NextResponse.json(competitor)
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await prisma.socialCompetitor.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

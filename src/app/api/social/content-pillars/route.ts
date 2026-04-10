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

  // Auto-seed Pro Tips pillar if no pillars exist
  const count = await prisma.socialContentPillar.count()
  if (count === 0) {
    await prisma.socialContentPillar.create({
      data: {
        title: 'Pro Tips',
        description: 'Weekly actionable tips for small business owners',
        icon: 'Lightbulb',
        color: '#14EAEA',
      },
    })
  }

  const pillars = await prisma.socialContentPillar.findMany({
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(pillars)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

  const pillar = await prisma.socialContentPillar.create({
    data: {
      title: body.title,
      description: body.description || null,
      icon: body.icon || null,
      color: body.color || null,
    },
  })
  return NextResponse.json(pillar)
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await prisma.socialContentPillar.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

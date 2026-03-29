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

  const stories = await prisma.socialStory.findMany({
    orderBy: { scheduledAt: 'asc' },
  })
  return NextResponse.json(stories)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.title || !body.slides) {
    return NextResponse.json({ error: 'title and slides are required' }, { status: 400 })
  }

  const story = await prisma.socialStory.create({
    data: {
      title: body.title,
      slides: body.slides,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      status: body.status || 'DRAFT',
    },
  })
  return NextResponse.json(story)
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

// GET — list posts with optional filters
export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const month = searchParams.get('month') // YYYY-MM format for calendar view

  const where: Record<string, unknown> = {}

  if (status) {
    where.status = status
  }

  if (month) {
    const [y, m] = month.split('-').map(Number)
    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 1)
    // Include posts scheduled OR published in this month, plus drafts with no date
    where.OR = [
      { scheduledAt: { gte: start, lt: end } },
      { publishedAt: { gte: start, lt: end } },
      { status: 'DRAFT', scheduledAt: null },
    ]
  }

  const posts = await prisma.socialPost.findMany({
    where,
    orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(posts)
}

// POST — create a new post
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const post = await prisma.socialPost.create({
    data: {
      title: body.title || null,
      caption: body.caption || null,
      hashtags: body.hashtags || null,
      mediaPath: body.mediaPath || null,
      mediaType: body.mediaType || 'image',
      platforms: body.platforms ? JSON.stringify(body.platforms) : null,
      status: body.status || 'DRAFT',
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      notes: body.notes || null,
    },
  })

  return NextResponse.json(post)
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recordActivity } from '@/lib/social/publish-utils'

type Params = { params: Promise<{ id: string }> }

// GET — fetch all activity for a post
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const activities = await prisma.postActivity.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(activities)
}

// POST — add a comment or activity
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { message, type = 'comment' } = body

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const activity = await recordActivity({
    postId: id,
    type,
    message: message.trim(),
    author: session.user.email || 'admin',
  })

  return NextResponse.json(activity)
}

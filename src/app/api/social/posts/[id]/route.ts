import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const post = await prisma.socialPost.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updateData: Record<string, unknown> = {}
  if (body.title !== undefined) updateData.title = body.title
  if (body.caption !== undefined) updateData.caption = body.caption
  if (body.hashtags !== undefined) updateData.hashtags = body.hashtags
  if (body.mediaPath !== undefined) updateData.mediaPath = body.mediaPath
  if (body.mediaType !== undefined) updateData.mediaType = body.mediaType
  if (body.platforms !== undefined) updateData.platforms = JSON.stringify(body.platforms)
  if (body.status !== undefined) updateData.status = body.status
  if (body.scheduledAt !== undefined) updateData.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null
  if (body.notes !== undefined) updateData.notes = body.notes

  const post = await prisma.socialPost.update({ where: { id }, data: updateData })
  return NextResponse.json(post)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.socialPost.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

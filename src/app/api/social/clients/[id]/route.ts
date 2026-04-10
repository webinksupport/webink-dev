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

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updateData: Record<string, unknown> = {}
  if (body.name !== undefined) updateData.name = body.name
  if (body.instagramHandle !== undefined) updateData.instagramHandle = body.instagramHandle
  if (body.facebookPageId !== undefined) updateData.facebookPageId = body.facebookPageId
  if (body.accessToken !== undefined) updateData.accessToken = body.accessToken
  if (body.status !== undefined) updateData.status = body.status

  const client = await prisma.socialClient.update({ where: { id }, data: updateData })
  return NextResponse.json(client)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.socialClient.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

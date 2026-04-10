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

  const sets = await prisma.socialHashtagSet.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(sets)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, hashtags } = await req.json()
  if (!name || !hashtags) {
    return NextResponse.json({ error: 'name and hashtags are required' }, { status: 400 })
  }

  const set = await prisma.socialHashtagSet.create({ data: { name, hashtags } })
  return NextResponse.json(set)
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await prisma.socialHashtagSet.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

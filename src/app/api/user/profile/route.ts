import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone } = await request.json()

    const data: Record<string, string | null> = {}
    if (name !== undefined) data.name = name || null
    if (phone !== undefined) data.phone = phone || null

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
    })

    return NextResponse.json({ name: user.name, phone: user.phone })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

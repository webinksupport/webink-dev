import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/menu — returns all distinct menu slugs
export async function GET() {
  try {
    const menus = await prisma.menuItem.findMany({
      select: { menuSlug: true },
      distinct: ['menuSlug'],
      orderBy: { menuSlug: 'asc' },
    })

    const slugs = menus.map((m) => m.menuSlug)
    return NextResponse.json(slugs)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch menu slugs' },
      { status: 500 }
    )
  }
}

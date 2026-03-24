import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageSlug: string }> }
) {
  try {
    const { pageSlug } = await params

    const blocks = await prisma.pageContent.findMany({
      where: { pageSlug },
      orderBy: { blockKey: 'asc' },
    })

    return NextResponse.json(blocks)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch content blocks' },
      { status: 500 }
    )
  }
}

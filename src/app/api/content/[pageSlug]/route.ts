import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma, type ContentBlockType } from '@/generated/prisma/client'

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

// PUT — bulk save all blocks for a page
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageSlug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    console.log('PUT /api/content:', { session, params: await params })
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      console.log('Unauthorized - session:', session?.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pageSlug } = await params
    const { blocks } = (await request.json()) as {
      blocks: {
        blockKey: string
        blockType: ContentBlockType
        value: string
        jsonValue?: unknown
      }[]
    }

    if (!Array.isArray(blocks)) {
      return NextResponse.json(
        { error: 'blocks array is required' },
        { status: 400 }
      )
    }

    // Bulk upsert all blocks
    const results = await Promise.all(
      blocks.map((block) => {
        const jsonVal = block.jsonValue !== undefined
          ? (block.jsonValue === null ? Prisma.DbNull : block.jsonValue as Prisma.InputJsonValue)
          : undefined

        return prisma.pageContent.upsert({
          where: {
            pageSlug_blockKey: { pageSlug, blockKey: block.blockKey },
          },
          update: {
            value: block.value,
            blockType: block.blockType,
            ...(jsonVal !== undefined ? { jsonValue: jsonVal } : {}),
          },
          create: {
            pageSlug,
            blockKey: block.blockKey,
            blockType: block.blockType,
            value: block.value,
            ...(jsonVal !== undefined ? { jsonValue: jsonVal } : {}),
          },
        })
      })
    )

    return NextResponse.json(results)
  } catch {
    return NextResponse.json(
      { error: 'Failed to save content blocks' },
      { status: 500 }
    )
  }
}

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

    // Sanitize: ensure value is always a plain string, never an object
    const sanitized = blocks.map(block => ({
      ...block,
      value: typeof block.value === 'string'
        ? block.value
        : (block.value && typeof block.value === 'object'
          ? ((block.value as Record<string, unknown>).text as string ??
             (block.value as Record<string, unknown>).src as string ?? '')
          : String(block.value ?? '')),
    }))

    return NextResponse.json(sanitized)
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

        // Ensure value is always a plain string — never store an object in the value column
        let safeValue: string
        if (typeof block.value === 'string') {
          safeValue = block.value
        } else if (block.value && typeof block.value === 'object') {
          const obj = block.value as Record<string, unknown>
          safeValue = (typeof obj.text === 'string' ? obj.text : typeof obj.src === 'string' ? obj.src : '')
        } else {
          safeValue = String(block.value ?? '')
        }

        return prisma.pageContent.upsert({
          where: {
            pageSlug_blockKey: { pageSlug, blockKey: block.blockKey },
          },
          update: {
            value: safeValue,
            blockType: block.blockType,
            ...(jsonVal !== undefined ? { jsonValue: jsonVal } : {}),
          },
          create: {
            pageSlug,
            blockKey: block.blockKey,
            blockType: block.blockType,
            value: safeValue,
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

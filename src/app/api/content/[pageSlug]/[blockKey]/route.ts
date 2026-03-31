import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { ContentBlockType } from '@/generated/prisma/client'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageSlug: string; blockKey: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pageSlug, blockKey } = await params
    const { value, blockType } = await request.json() as {
      value: string
      blockType?: ContentBlockType
    }

    if (typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Value is required and must be a string' },
        { status: 400 }
      )
    }

    const block = await prisma.pageContent.upsert({
      where: {
        pageSlug_blockKey: { pageSlug, blockKey },
      },
      update: {
        value,
        ...(blockType ? { blockType } : {}),
      },
      create: {
        pageSlug,
        blockKey,
        value,
        blockType: blockType || 'TEXT',
      },
    })

    // Invalidate Next.js page cache so changes appear immediately
    revalidatePath('/' + pageSlug, 'page')
    revalidatePath('/', 'layout')

    return NextResponse.json(block)
  } catch (error) {
    console.error('PUT /api/content/[blockKey] error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to update content block', detail: message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pageSlug: string; blockKey: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pageSlug, blockKey } = await params

    await prisma.pageContent.delete({
      where: {
        pageSlug_blockKey: { pageSlug, blockKey },
      },
    })

    // Invalidate cache after deletion too
    revalidatePath('/' + pageSlug, 'page')
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/content/[blockKey] error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to delete content block', detail: message },
      { status: 500 }
    )
  }
}

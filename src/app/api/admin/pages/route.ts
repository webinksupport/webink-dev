import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET — list all pages
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pages = await prisma.page.findMany({
      orderBy: [{ isCore: 'desc' }, { title: 'asc' }],
    })

    return NextResponse.json(pages)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

// POST — create a new custom page
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, slug, status } = (await request.json()) as {
      title: string
      slug: string
      status?: 'PUBLISHED' | 'DRAFT'
    }

    if (!title?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
    }

    // Sanitize slug
    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9/-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Check for duplicate slug
    const existing = await prisma.page.findUnique({ where: { slug: cleanSlug } })
    if (existing) {
      return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 409 })
    }

    const page = await prisma.page.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        status: status || 'DRAFT',
        isCore: false,
        template: 'generic',
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}

// PUT — update a page (status, title)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, title, status } = (await request.json()) as {
      id: string
      title?: string
      status?: 'PUBLISHED' | 'DRAFT'
    }

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const data: Record<string, unknown> = {}
    if (title !== undefined) data.title = title.trim()
    if (status !== undefined) data.status = status

    const page = await prisma.page.update({
      where: { id },
      data,
    })

    return NextResponse.json(page)
  } catch {
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

// DELETE — delete a non-core page
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = (await request.json()) as { id: string }

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    // Prevent deleting core pages
    const page = await prisma.page.findUnique({ where: { id } })
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    if (page.isCore) {
      return NextResponse.json({ error: 'Cannot delete core pages' }, { status: 403 })
    }

    // Delete the page and its content blocks
    await prisma.pageContent.deleteMany({ where: { pageSlug: page.slug } })
    await prisma.page.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}

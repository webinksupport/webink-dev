import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface MenuItemInput {
  id?: string
  label: string
  url: string
  order: number
  children?: MenuItemInput[]
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

// GET /api/menu/[slug] — return menu tree (public)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    const items = await prisma.menuItem.findMany({
      where: { menuSlug: slug, parentId: null },
      include: { children: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// PUT /api/menu/[slug] — replace entire menu tree (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const { items } = (await req.json()) as { items: MenuItemInput[] }

  try {
    // Delete all existing items for this menu
    await prisma.menuItem.deleteMany({ where: { menuSlug: slug } })

    // Create new items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const parent = await prisma.menuItem.create({
        data: {
          label: item.label,
          url: item.url,
          order: i,
          menuSlug: slug,
        },
      })

      // Create children
      if (item.children && item.children.length > 0) {
        for (let j = 0; j < item.children.length; j++) {
          const child = item.children[j]
          await prisma.menuItem.create({
            data: {
              label: child.label,
              url: child.url,
              order: j,
              parentId: parent.id,
              menuSlug: slug,
            },
          })
        }
      }
    }

    // Return the new tree
    const result = await prisma.menuItem.findMany({
      where: { menuSlug: slug, parentId: null },
      include: { children: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('Menu save error:', err)
    return NextResponse.json({ error: 'Failed to save menu' }, { status: 500 })
  }
}

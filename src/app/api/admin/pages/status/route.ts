import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — check page status (public, but only returns status)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ status: 'PUBLISHED' })
    }

    const page = await prisma.page.findUnique({
      where: { slug },
      select: { status: true },
    })

    return NextResponse.json({ status: page?.status || 'PUBLISHED' })
  } catch {
    return NextResponse.json({ status: 'PUBLISHED' })
  }
}

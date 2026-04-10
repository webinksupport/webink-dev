import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

// GET — fetch the brand profile (there should only be one)
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.socialBrandProfile.findFirst({
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(profile)
}

// POST — create or update the brand profile
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const existing = await prisma.socialBrandProfile.findFirst()

  if (existing) {
    const updated = await prisma.socialBrandProfile.update({
      where: { id: existing.id },
      data: {
        businessName: body.businessName,
        tagline: body.tagline || null,
        brandVoice: body.brandVoice || null,
        primaryColors: body.primaryColors || null,
        targetAudience: body.targetAudience || null,
        keyServices: body.keyServices || null,
        brandKeywords: body.brandKeywords || null,
        competitorHandles: body.competitorHandles || null,
        logoPath: body.logoPath || null,
      },
    })
    return NextResponse.json(updated)
  }

  const profile = await prisma.socialBrandProfile.create({
    data: {
      businessName: body.businessName,
      tagline: body.tagline || null,
      brandVoice: body.brandVoice || null,
      primaryColors: body.primaryColors || null,
      targetAudience: body.targetAudience || null,
      keyServices: body.keyServices || null,
      brandKeywords: body.brandKeywords || null,
      competitorHandles: body.competitorHandles || null,
      logoPath: body.logoPath || null,
    },
  })
  return NextResponse.json(profile)
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildPrompt, type BrandAssetInput, type BrandProfileInput } from '@/lib/ai/prompt-builder'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      topic,
      contentIdea,
      brandAssets = [],
      brandProfile,
      model,
      aspectRatio,
    } = body as {
      topic: string
      contentIdea: string
      brandAssets: BrandAssetInput[]
      brandProfile: BrandProfileInput
      model: string
      aspectRatio?: string
    }

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 })
    }

    const result = buildPrompt({
      topic,
      contentIdea: contentIdea || topic,
      brandAssets,
      brandProfile: brandProfile || { colors: [], tone: 'Professional', industry: '', name: '' },
      targetModel: model || '',
      aspectRatio,
    })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to build prompt'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

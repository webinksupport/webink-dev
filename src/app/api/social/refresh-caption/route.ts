import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateTextWithProviders } from '@/lib/ai/generate-text'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caption } = await req.json()

  if (!caption) {
    return NextResponse.json({ error: 'caption is required' }, { status: 400 })
  }

  const prompt = `You are a social media copywriter. Rewrite this caption to feel fresh and current while keeping the core message and value intact. Make it feel like a new post, not a repeat.

Original caption:
"${caption}"

Return ONLY the rewritten caption text. No explanations, no quotes around it.`

  try {
    const refreshed = await generateTextWithProviders(prompt, session.user.id)
    return NextResponse.json({ caption: refreshed.trim() })
  } catch (error) {
    console.error('Caption refresh error:', error)
    const message = error instanceof Error ? error.message : 'Failed to refresh caption'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

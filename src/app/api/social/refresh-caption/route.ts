import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSetting } from '@/lib/settings'
import Anthropic from '@anthropic-ai/sdk'

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

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured.' }, { status: 500 })
  }

  const prompt = `You are a social media copywriter. Rewrite this caption to feel fresh and current while keeping the core message and value intact. Make it feel like a new post, not a repeat.

Original caption:
"${caption}"

Return ONLY the rewritten caption text. No explanations, no quotes around it.`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const refreshed = message.content[0].type === 'text' ? message.content[0].text.trim() : caption

    return NextResponse.json({ caption: refreshed })
  } catch (error) {
    console.error('Caption refresh error:', error)
    return NextResponse.json({ error: 'Failed to refresh caption' }, { status: 500 })
  }
}

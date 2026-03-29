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

  const { caption, hashtags, platform = 'instagram', scheduledAt } = await req.json()

  if (!caption) {
    return NextResponse.json({ error: 'caption is required' }, { status: 400 })
  }

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured.' }, { status: 500 })
  }

  const dayOfWeek = scheduledAt ? new Date(scheduledAt).toLocaleDateString('en-US', { weekday: 'long' }) : 'not scheduled'
  const hour = scheduledAt ? new Date(scheduledAt).getHours() : null

  const prompt = `You are a social media performance analyst. Score this ${platform} post.

Caption: "${caption}"
Hashtags: "${hashtags || 'none'}"
Scheduled: ${dayOfWeek}${hour !== null ? ` at ${hour}:00` : ''}

Score each dimension 0-100 and provide an overall score. Also give 2-4 specific improvement suggestions.

Return ONLY valid JSON (no markdown, no code fences):
{
  "overall": 72,
  "scores": {
    "hookStrength": { "score": 65, "label": "Hook Strength" },
    "ctaClarity": { "score": 80, "label": "CTA Clarity" },
    "hashtagRelevance": { "score": 70, "label": "Hashtag Relevance" },
    "captionLength": { "score": 75, "label": "Caption Length" },
    "readability": { "score": 85, "label": "Readability" }
  },
  "suggestions": [
    "Start with a question or bold statement to hook readers in the first line",
    "Add a clear call-to-action like 'Save this post' or 'Comment below'"
  ]
}`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const result = JSON.parse(text)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Post scoring error:', error)
    return NextResponse.json({ error: 'Failed to score post' }, { status: 500 })
  }
}

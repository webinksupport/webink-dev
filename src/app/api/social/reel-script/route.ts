import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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

  const { topic, hookStyle = 'Question', duration = 30 } = await req.json()

  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured.' }, { status: 500 })
  }

  const brandProfile = await prisma.socialBrandProfile.findFirst({
    orderBy: { updatedAt: 'desc' },
  })

  const brandContext = brandProfile
    ? `Brand: ${brandProfile.businessName}. Voice: ${brandProfile.brandVoice || 'Professional'}. Services: ${brandProfile.keyServices || 'N/A'}. Audience: ${brandProfile.targetAudience || 'N/A'}.`
    : 'Brand: Webink Solutions, a web design and digital marketing agency in Sarasota, FL.'

  const prompt = `You are a short-form video script writer for Instagram Reels and TikTok.

${brandContext}

Create a ${duration}-second reel script about: "${topic}"
Hook style: ${hookStyle}

Return ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "segments": [
    {
      "startTime": 0,
      "endTime": 3,
      "type": "hook",
      "spokenText": "The hook spoken aloud",
      "onScreenText": "Short text overlay",
      "bRollSuggestion": "What should be shown visually"
    },
    {
      "startTime": 3,
      "endTime": 6,
      "type": "content",
      "spokenText": "Spoken content",
      "onScreenText": "Key point text overlay",
      "bRollSuggestion": "Visual suggestion"
    },
    ...more segments at 3s intervals...,
    {
      "startTime": ${duration - 3},
      "endTime": ${duration},
      "type": "cta",
      "spokenText": "Call to action spoken text",
      "onScreenText": "CTA text overlay",
      "bRollSuggestion": "Visual suggestion"
    }
  ],
  "suggestedAudio": "Description of audio vibe/genre that fits this reel",
  "caption": "Suggested caption for the reel post",
  "hashtags": "#relevant #hashtags"
}`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const result = JSON.parse(text)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Reel script generation error:', error)
    return NextResponse.json({ error: 'Failed to generate reel script' }, { status: 500 })
  }
}

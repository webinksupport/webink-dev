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

  const { topic, sourceText, slideCount = 5 } = await req.json()

  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured.' }, { status: 500 })
  }

  // Load brand profile for context
  const brandProfile = await prisma.socialBrandProfile.findFirst({
    orderBy: { updatedAt: 'desc' },
  })

  const brandContext = brandProfile
    ? `Brand: ${brandProfile.businessName}. Voice: ${brandProfile.brandVoice || 'Professional'}. Services: ${brandProfile.keyServices || 'N/A'}. Audience: ${brandProfile.targetAudience || 'N/A'}.`
    : 'Brand: Webink Solutions, a web design and digital marketing agency in Sarasota, FL.'

  const prompt = `You are an Instagram carousel content creator.

${brandContext}

Create an Instagram carousel with ${slideCount} slides about: "${topic}"
${sourceText ? `\nReference material:\n"${sourceText}"` : ''}

Return ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "slides": [
    {
      "slideNumber": 0,
      "type": "cover",
      "headline": "Attention-grabbing cover text",
      "body": "",
      "imagePrompt": "Description for AI image generation"
    },
    {
      "slideNumber": 1,
      "type": "content",
      "headline": "Slide headline",
      "body": "2-3 sentences of value-packed content",
      "imagePrompt": "Description for AI image generation"
    },
    ...more content slides...,
    {
      "slideNumber": ${slideCount - 1},
      "type": "cta",
      "headline": "Call to action headline",
      "body": "CTA text encouraging engagement",
      "imagePrompt": "Description for AI image generation"
    }
  ],
  "caption": "Suggested Instagram caption for this carousel post",
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
    console.error('Carousel generation error:', error)
    return NextResponse.json({ error: 'Failed to generate carousel' }, { status: 500 })
  }
}

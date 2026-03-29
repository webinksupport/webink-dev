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

  const { topic } = await req.json()
  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 })
  }

  const profile = await prisma.socialBrandProfile.findFirst()
  const brandName = profile?.businessName || 'Webink Solutions'
  const brandVoice = profile?.brandVoice || 'Professional'

  const prompt = `You are a social media strategist creating an Instagram Story sequence for ${brandName}.
Brand voice: ${brandVoice}

Create a 3-5 slide Instagram Story sequence about: "${topic}"

For each slide provide:
1. type: one of "Image", "Text Only", "Poll", "Link", "Countdown"
2. image_description: suggested image or visual description (even for text-only, describe the background)
3. text_overlay: the text to display on the story slide (keep under 100 chars)
4. cta: call-to-action sticker text (e.g. "Swipe Up", "Learn More", "Vote Now", "DM Us")

Return ONLY valid JSON:
{
  "slides": [
    {
      "type": "Image",
      "image_description": "...",
      "text_overlay": "...",
      "cta": "..."
    }
  ]
}`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json({ error: 'Failed to generate story sequence' }, { status: 500 })
  }
}

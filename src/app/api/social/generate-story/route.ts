import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateTextWithProviders } from '@/lib/ai/generate-text'
import { parseJsonFromAI } from '@/lib/ai/parse-json-response'

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
    const text = await generateTextWithProviders(prompt, session.user.id)
    const parsed = parseJsonFromAI(text)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Story generation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate story sequence'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

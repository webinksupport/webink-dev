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

  const { caption, platform = 'instagram', brandVoice = 'professional' } = await req.json()

  if (!caption) {
    return NextResponse.json({ error: 'caption is required' }, { status: 400 })
  }

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured. Add it in Admin → Integrations or set ANTHROPIC_API_KEY env var.' }, { status: 500 })
  }

  const platformTips: Record<string, string> = {
    instagram: 'Instagram: Use line breaks for readability, include a CTA, emojis are acceptable, keep under 2200 chars',
    facebook: 'Facebook: Can be longer, conversational, ask questions, encourage shares',
    linkedin: 'LinkedIn: Professional tone, no excessive emojis, thought leadership angle, end with a question',
  }

  const brandVoiceDescriptions: Record<string, string> = {
    professional: 'Professional, results-focused, forward-thinking. Uses "we" language.',
    casual: 'Casual and conversational, friendly and approachable.',
    bold: 'Bold, punchy, attention-grabbing. Strong verbs.',
    educational: 'Educational and informative. Teaches and simplifies.',
  }

  const prompt = `You are a social media copywriter for Webink Solutions, a web design and digital marketing agency.

Brand Voice: ${brandVoiceDescriptions[brandVoice] || brandVoiceDescriptions.professional}
Platform: ${platformTips[platform] || platformTips.instagram}

Improve this caption to be more engaging, on-brand, and effective:

"${caption}"

Return ONLY the improved caption text. No explanations. No quotes around it. Just the caption.`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const improved = message.content[0].type === 'text' ? message.content[0].text.trim() : caption

    return NextResponse.json({ caption: improved })
  } catch (error) {
    console.error('Caption improvement error:', error)
    return NextResponse.json({ error: 'Failed to improve caption' }, { status: 500 })
  }
}

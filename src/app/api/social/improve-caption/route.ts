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

  const { caption, platform = 'instagram', brandVoice = 'professional' } = await req.json()

  if (!caption) {
    return NextResponse.json({ error: 'caption is required' }, { status: 400 })
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
    const improved = await generateTextWithProviders(prompt, session.user.id)
    return NextResponse.json({ caption: improved.trim() })
  } catch (error) {
    console.error('Caption improvement error:', error)
    const message = error instanceof Error ? error.message : 'Failed to improve caption'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

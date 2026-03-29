import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateTextWithProviders } from '@/lib/ai/generate-text'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { niche, model } = await req.json()

  // Load brand profile for context
  let brandContext = ''
  try {
    const profile = await prisma.socialBrandProfile.findFirst()
    if (profile) {
      brandContext = `Business: ${profile.businessName || 'Webink Solutions'}. ` +
        `Services: ${profile.keyServices || 'web design, SEO, social media marketing'}. ` +
        `Audience: ${profile.targetAudience || 'small business owners'}.`
    }
  } catch {
    // Use defaults
  }

  const prompt = `You are a social media trend analyst. Research and suggest 6 trending topics that would perform well on social media right now.

${brandContext ? `Brand context: ${brandContext}\n` : ''}
${niche ? `Niche/industry focus: ${niche}\n` : ''}

For each topic, provide:
1. A short topic title (5-10 words)
2. Why it's trending right now (1 sentence)
3. A content angle for the brand (1 sentence)

Consider: current events, seasonal trends, industry developments, viral formats, and evergreen topics with a fresh angle.

Return as JSON array: [{"topic": "...", "why": "...", "angle": "..."}]
Return ONLY the JSON array, no markdown fences, no explanation.`

  try {
    const result = await generateTextWithProviders(prompt, session.user.id, model)

    // Parse the JSON response
    const cleaned = result.trim().replace(/^```json?\s*/i, '').replace(/```\s*$/, '')
    const topics = JSON.parse(cleaned)

    return NextResponse.json({ topics })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to research trends'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

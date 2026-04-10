import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateTextWithProviders } from '@/lib/ai/generate-text'
import { parseJsonFromAI } from '@/lib/ai/parse-json-response'
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

  // Add a random seed phrase to force variety each call
  const seedPhrases = [
    'Focus on emerging trends this week.',
    'Think about what small business owners are struggling with right now.',
    'Consider viral social media formats and how they apply to this niche.',
    'Look at seasonal opportunities and timely angles.',
    'Think about pain points and transformation stories.',
    'Consider behind-the-scenes and process-focused content.',
    'Focus on client results, case studies, and social proof angles.',
    'Think about common myths or misconceptions in this industry.',
    'Consider tool recommendations, tips, and how-to content.',
    'Think about industry news and what it means for small businesses.',
  ]
  const seed = seedPhrases[Math.floor(Math.random() * seedPhrases.length)]

  const prompt = `You are a social media content strategist specializing in helping service businesses grow on Instagram and LinkedIn.

${brandContext ? `Brand context: ${brandContext}\n` : ''}
${niche ? `Niche/industry focus: ${niche}\n` : ''}

Suggest 6 SPECIFIC, ACTIONABLE post topics that would resonate with small business owners on social media. These should feel relevant and timely — not generic.

${seed}

For each topic:
1. A specific post topic title (e.g. "5 Signs Your Website Is Costing You Clients" NOT "Web Design Tips")
2. Why this resonates right now with the target audience (1 sentence)
3. The exact content angle/hook for this brand (1 sentence — make it specific to the brand's services)

Rules:
- Topics must be directly relatable to the brand's services and audience
- Avoid vague topics like "social media tips" — be specific
- Each topic should be different in format/angle (e.g. list post, story, myth-bust, behind-scenes, stat, question)
- At least 2 topics should have a hook that creates urgency or curiosity

Return as JSON array: [{"topic": "...", "why": "...", "angle": "..."}]
Return ONLY the JSON array, no markdown, no explanation.`

  try {
    const result = await generateTextWithProviders(prompt, session.user.id, model)

    // Parse the JSON response
    const topics = parseJsonFromAI(result)

    return NextResponse.json({ topics })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to research trends'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

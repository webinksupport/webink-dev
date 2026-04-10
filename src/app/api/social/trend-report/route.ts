import { NextResponse } from 'next/server'
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

export async function POST() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.socialBrandProfile.findFirst()
  const pillars = await prisma.socialContentPillar.findMany()

  const industry = profile?.keyServices || 'web design and digital marketing'
  const keywords = profile?.brandKeywords || 'web design, SEO, social media'
  const pillarNames = pillars.map((p: { title: string }) => p.title).join(', ') || 'web design, SEO, social media marketing'
  const today = new Date().toISOString().split('T')[0]

  const prompt = `You are a social media trend analyst for a ${industry} agency.

Brand keywords: ${keywords}
Content pillars: ${pillarNames}
Current date: ${today}

Generate a trend report with the top 5 content trends this week relevant to this brand's industry.

For each trend provide:
1. trend_title: A short title for the trend
2. content_angle: How this brand should approach the trend
3. hook_line: A suggested opening hook line for a post about this trend
4. why_now: Why this trend is relevant right now

Return ONLY valid JSON:
{
  "trends": [
    {
      "trend_title": "...",
      "content_angle": "...",
      "hook_line": "...",
      "why_now": "..."
    }
  ]
}`

  try {
    const text = await generateTextWithProviders(prompt, session.user.id)
    const parsed = parseJsonFromAI(text)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Trend report generation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate trend report'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

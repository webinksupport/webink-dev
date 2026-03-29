import { NextResponse } from 'next/server'
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

export async function POST() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 })
  }

  const profile = await prisma.socialBrandProfile.findFirst()
  const pillars = await prisma.socialContentPillar.findMany()

  const industry = profile?.keyServices || 'web design and digital marketing'
  const keywords = profile?.brandKeywords || 'web design, SEO, social media'
  const pillarNames = pillars.map((p) => p.title).join(', ') || 'web design, SEO, social media marketing'
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
    console.error('Trend report generation error:', error)
    return NextResponse.json({ error: 'Failed to generate trend report' }, { status: 500 })
  }
}

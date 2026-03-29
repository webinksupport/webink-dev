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

// GET — list saved ideas
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ideas = await prisma.socialIdea.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(ideas)
}

// POST — generate new ideas OR save an idea
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Save idea directly
  if (body.action === 'save') {
    const idea = await prisma.socialIdea.create({
      data: {
        topic: body.topic,
        hook: body.hook,
        caption: body.caption,
        hashtags: body.hashtags || null,
        brandVoice: body.brandVoice || null,
      },
    })
    return NextResponse.json(idea)
  }

  // Save idea to calendar (create draft post)
  if (body.action === 'save_to_calendar') {
    const post = await prisma.socialPost.create({
      data: {
        title: body.hook,
        caption: body.caption,
        hashtags: body.hashtags || null,
        platforms: JSON.stringify(['instagram', 'facebook']),
        status: 'DRAFT',
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    })
    // Mark the source idea as used if id provided
    if (body.ideaId) {
      await prisma.socialIdea.update({
        where: { id: body.ideaId },
        data: { used: true },
      }).catch(() => {})
    }
    return NextResponse.json(post)
  }

  // Generate ideas with Claude
  const { topic, brandVoice = 'professional', category, contentPillar, bulkGenerate } = body

  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured. Add it in Admin → Integrations or set ANTHROPIC_API_KEY env var.' }, { status: 500 })
  }

  const brandVoiceDescriptions: Record<string, string> = {
    professional: 'Professional, results-focused, forward-thinking. Uses "we" language. Backs claims with stats.',
    casual: 'Casual and conversational, friendly and approachable, uses contractions and everyday language.',
    bold: 'Bold, punchy, attention-grabbing. Short sentences. Strong verbs. Makes big claims backed by proof.',
    educational: 'Educational and informative. Positions Webink as an authority. Teaches, explains, simplifies.',
  }

  const voiceDesc = brandVoiceDescriptions[brandVoice] || brandVoiceDescriptions.professional
  const ideaCount = bulkGenerate ? 7 : 7

  const categoryContext = category ? `\nContent Category: ${category}` : ''
  const pillarContext = contentPillar ? `\nContent Pillar to align with: ${contentPillar}` : ''
  const dayLabels = bulkGenerate
    ? '\nAssign each idea to a day of the week (Monday through Sunday). Vary the content types across the week.'
    : ''

  const prompt = `You are a social media strategist for Webink Solutions, a web design and digital marketing agency in Sarasota, FL.

Brand Voice: ${voiceDesc}${categoryContext}${pillarContext}

Generate ${ideaCount} unique social media content ideas for the topic: "${topic}"${dayLabels}

For each idea, provide:
1. A hook (attention-grabbing opening line, max 15 words)
2. A caption (2-4 sentences, engaging, ends with a CTA)
3. 5-8 relevant hashtags (mix broad + niche + trending)
${bulkGenerate ? '4. A suggested day of the week (Monday-Sunday)' : ''}

Return ONLY valid JSON in this exact format:
{
  "ideas": [
    {
      "hook": "...",
      "caption": "...",
      "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5"${bulkGenerate ? ',\n      "dayOfWeek": "Monday"' : ''}
    }
  ]
}

Do not include any text outside the JSON.`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text)

    return NextResponse.json({ ideas: parsed.ideas, topic, brandVoice, category })
  } catch (error) {
    console.error('Claude idea generation error:', error)
    return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 })
  }
}

// PATCH — mark idea as used
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, used } = await req.json()
  const idea = await prisma.socialIdea.update({
    where: { id },
    data: { used: used ?? true },
  })
  return NextResponse.json(idea)
}

// DELETE — delete an idea
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await prisma.socialIdea.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

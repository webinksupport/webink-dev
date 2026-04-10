import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateTextWithProviders } from '@/lib/ai/generate-text'
import { parseJsonFromAI } from '@/lib/ai/parse-json-response'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role: string }).role !== 'ADMIN') return null
  return session
}

// POST — generate a batch of draft posts from content pillars + brand profile
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { pillarId, count = 3, clientId } = body

  // Get brand profile
  const brandProfile = await prisma.socialBrandProfile.findFirst({
    orderBy: { updatedAt: 'desc' },
  })

  // Get content pillar if specified
  let pillar = null
  if (pillarId) {
    pillar = await prisma.socialContentPillar.findUnique({ where: { id: pillarId } })
  }

  // Get all pillars if none specified
  const pillars = pillar
    ? [pillar]
    : await prisma.socialContentPillar.findMany({ take: 5 })

  if (pillars.length === 0) {
    return NextResponse.json({
      error: 'No content pillars configured. Add them in Settings to use automated generation.',
    }, { status: 400 })
  }

  const brandContext = brandProfile
    ? `Brand: ${brandProfile.businessName}. Voice: ${brandProfile.brandVoice || 'Professional'}. Services: ${brandProfile.keyServices || 'Digital marketing'}. Audience: ${brandProfile.targetAudience || 'Business owners'}.`
    : 'Brand: Webink Solutions. Voice: Professional, results-focused. Services: SEO, Web Design, Social Media. Audience: Small business owners in Sarasota, FL.'

  const pillarDescriptions = pillars.map((p) => `- ${p.title}: ${p.description || p.title}`).join('\n')

  const prompt = `Generate ${count} social media post drafts for the following brand and content pillars.

${brandContext}

Content Pillars:
${pillarDescriptions}

For each post, generate:
1. A "topic" (3-6 words)
2. A "caption" (compelling, on-brand, 1-3 paragraphs, include a CTA)
3. "hashtags" (8-12 relevant hashtags as a space-separated string starting with #)
4. A "pillar" (which content pillar this belongs to)
5. An "imagePrompt" (a detailed image generation prompt for this post)

Return as JSON array: [{"topic":"...","caption":"...","hashtags":"...","pillar":"...","imagePrompt":"..."}]

Mix across the available pillars. Make each post distinct and fresh.`

  try {
    const raw = await generateTextWithProviders(prompt)
    const posts = parseJsonFromAI(raw)

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: 'AI did not return valid posts' }, { status: 500 })
    }

    // Create draft posts in the database
    const created = []
    for (const p of posts) {
      const post = await prisma.socialPost.create({
        data: {
          title: p.topic || 'Auto-generated post',
          caption: p.caption || '',
          hashtags: p.hashtags || '',
          status: 'PENDING_REVIEW',
          platforms: JSON.stringify(['instagram', 'facebook']),
          creationLane: 'automated',
          clientId: clientId || null,
          notes: p.imagePrompt ? `Image prompt: ${p.imagePrompt}` : null,
        },
      })
      created.push({ ...post, pillar: p.pillar, imagePrompt: p.imagePrompt })
    }

    return NextResponse.json({
      generated: created.length,
      posts: created,
    })
  } catch (err) {
    return NextResponse.json({ error: `Generation failed: ${String(err)}` }, { status: 500 })
  }
}

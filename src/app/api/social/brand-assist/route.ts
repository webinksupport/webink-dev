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

  const body = await req.json()
  const { contentType, platform, tone, sourceText } = body

  const apiKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured. Add it in Admin → Integrations or set ANTHROPIC_API_KEY env var.' }, { status: 500 })
  }

  // Load brand profile from DB
  const brandProfile = await prisma.socialBrandProfile.findFirst({
    orderBy: { updatedAt: 'desc' },
  })

  const brandContext = brandProfile
    ? `
Brand Name: ${brandProfile.businessName}
Tagline: ${brandProfile.tagline || 'N/A'}
Brand Voice: ${brandProfile.brandVoice || 'Professional'}
Target Audience: ${brandProfile.targetAudience || 'Business owners and decision-makers'}
Key Services: ${brandProfile.keyServices || 'Web design, SEO, digital marketing'}
Brand Keywords: ${brandProfile.brandKeywords || 'professional, results-driven, innovative'}
Competitor Handles to Differentiate From: ${brandProfile.competitorHandles || 'N/A'}
Brand Colors: ${brandProfile.primaryColors ? JSON.stringify(brandProfile.primaryColors) : '#14EAEA, #F813BE'}
`
    : `
Brand Name: Webink Solutions
Tagline: Rethink Design
Brand Voice: Professional
Target Audience: Business owners in Sarasota, FL area
Key Services: Web design, SEO, social media marketing, PPC, web hosting
Brand Keywords: professional, results-driven, innovative, Florida-based
Brand Colors: #14EAEA (cyan), #F813BE (pink)
`

  const systemPrompt = `You are the social media strategist for ${brandProfile?.businessName || 'Webink Solutions'}. You create on-brand promotional content.

${brandContext}

Content Type: ${contentType}
Platform: ${platform}
Tone: ${tone}
${sourceText ? `Reference Material: ${sourceText}` : ''}

Generate promotional content. Return ONLY valid JSON in this exact format:
{
  "variations": [
    {
      "length": "short",
      "caption": "...(1-2 sentences)...",
      "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5"
    },
    {
      "length": "medium",
      "caption": "...(3-4 sentences)...",
      "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7"
    },
    {
      "length": "long",
      "caption": "...(5-7 sentences with storytelling)...",
      "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8"
    }
  ],
  "imagePrompt": "A detailed image generation prompt that would create a perfect visual for this post (describe scene, mood, colors, composition, style)",
  "bestTimeToPost": "Recommended day/time and why (e.g. 'Tuesday 10:00 AM - highest engagement for B2B content on ${platform}')"
}

Rules:
- Each caption must include a clear call-to-action
- Hashtags should mix broad reach (#marketing) with niche (#sarasotabusiness)
- Image prompt should reference brand colors and aesthetic when relevant
- Best time recommendation should be specific to ${platform} and ${contentType}
- Tone should match: ${tone}
- Do not include any text outside the JSON`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: systemPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Brand assist generation error:', error)
    return NextResponse.json({ error: 'Failed to generate branded content' }, { status: 500 })
  }
}

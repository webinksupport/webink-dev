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

// Route text generation to the selected model provider
async function generateText(prompt: string, model?: string): Promise<string> {
  // Parse model param: "google/gemini-pro", "openai/gpt-4o", "anthropic/claude-sonnet"
  const [provider] = model ? model.split('/') : ['auto']

  // Default: prefer Gemini if key is available, fall back to Anthropic
  const googleKey = await getSetting('GOOGLE_AI_API_KEY') || process.env.GOOGLE_AI_API_KEY
  const anthropicKey = await getSetting('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY
  const openaiKey = await getSetting('OPENAI_API_KEY') || process.env.OPENAI_API_KEY

  const useProvider = provider === 'auto'
    ? (googleKey ? 'google' : anthropicKey ? 'anthropic' : 'openai')
    : provider

  if (useProvider === 'google' && googleKey) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(googleKey)
    const gemini = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await gemini.generateContent(prompt)
    return result.response.text()
  }

  if (useProvider === 'openai' && openaiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      }),
    })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  // Anthropic (default fallback)
  if (!anthropicKey) {
    throw new Error('No AI API key configured. Add GOOGLE_AI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY in Admin → Integrations.')
  }
  const client = new Anthropic({ apiKey: anthropicKey })
  const message = await client.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })
  return message.content[0].type === 'text' ? message.content[0].text : ''
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { model: selectedModel } = body

  // Load brand profile from DB
  const brandProfile = await prisma.socialBrandProfile.findFirst({
    orderBy: { updatedAt: 'desc' },
  })

  // --- Content Gap Analysis ---
  if (body.action === 'content_gap') {
    const pillars = await prisma.socialContentPillar.findMany()
    const recentPosts = await prisma.socialPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      select: { caption: true, hashtags: true },
    })

    const competitorList = (body.competitors || []).join(', ')
    const pillarList = pillars.map((p) => p.title).join(', ') || 'web design, SEO, social media'
    const recentTopics = recentPosts.map((p) => p.caption?.slice(0, 80)).filter(Boolean).join('\n')

    const prompt = `Analyze content gaps for a social media brand.

Competitor Instagram handles: ${competitorList}
Our content pillars: ${pillarList}
Our recent post topics:
${recentTopics || 'No recent posts'}

Identify 5-7 content topics or angles that competitors likely cover but we haven't addressed. For each, explain why it matters and suggest a specific post idea.

Return plain text analysis, formatted with bullet points.`

    try {
      const text = await generateText(prompt, selectedModel)
      return NextResponse.json({ analysis: text })
    } catch (error) {
      console.error('Content gap analysis error:', error)
      return NextResponse.json({ error: 'Failed to analyze content gaps' }, { status: 500 })
    }
  }

  // --- Trending Hashtags ---
  if (body.action === 'trending_hashtags') {
    const keywords = brandProfile?.brandKeywords || 'web design, SEO, digital marketing'
    const today = new Date().toISOString().split('T')[0]

    const prompt = `Generate trending hashtag suggestions for a ${brandProfile?.keyServices || 'web design and digital marketing'} brand.

Brand keywords: ${keywords}
Date: ${today}

Group hashtags into 4-5 categories (e.g., Industry, Local, Trending, Niche, Engagement).
Each category should have 5-8 hashtags.

Return ONLY valid JSON:
{
  "groups": [
    {
      "category": "Category Name",
      "tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    }
  ]
}`

    try {
      const text = await generateText(prompt, selectedModel)
      const parsed = JSON.parse(text)
      return NextResponse.json(parsed)
    } catch (error) {
      console.error('Trending hashtags error:', error)
      return NextResponse.json({ error: 'Failed to generate hashtags' }, { status: 500 })
    }
  }

  // --- Default: Brand Content Generation ---
  const { contentType, platform, tone, sourceText } = body

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
    const text = await generateText(systemPrompt, selectedModel)
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Brand assist generation error:', error)
    return NextResponse.json({ error: 'Failed to generate branded content' }, { status: 500 })
  }
}

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

  const { context, model } = await req.json()

  // Load brand profile for context
  let brandContext = ''
  try {
    const profile = await prisma.socialBrandProfile.findFirst()
    if (profile) {
      brandContext = `Brand: ${profile.businessName || 'Webink Solutions'}. ` +
        `Tagline: ${profile.tagline || ''}. ` +
        `Voice: ${profile.brandVoice || 'Professional'}. ` +
        `Services: ${profile.keyServices || ''}. ` +
        `Keywords: ${profile.brandKeywords || ''}. ` +
        `Audience: ${profile.targetAudience || ''}.`
    }
  } catch {
    // Use defaults
  }

  const prompt = `You are a social media image prompt expert. Generate a detailed, creative image prompt for AI image generation (FLUX/DALL-E/Imagen).

${brandContext ? `Brand context: ${brandContext}\n` : ''}
${context ? `Additional context from user: ${context}\n` : ''}

Requirements:
- The image should be in portrait format (4:5 ratio, ideal for Instagram)
- Include specific visual details: lighting, composition, colors, mood, style
- Make it professional and on-brand
- Do NOT include text in the image (text overlay is added separately)
- Focus on visuals that would work for social media marketing

Return ONLY the image prompt text, nothing else. No quotes, no labels, no explanation. Just the prompt (2-3 sentences).`

  try {
    const result = await generateTextWithProviders(prompt, session.user.id, model)
    return NextResponse.json({ prompt: result.trim() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate suggestion'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { prompt, model = 'schnell' } = body

  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }

  // Check DB setting first, then env vars (TOGETHER_AI_API_KEY or TOGETHER_API_KEY)
  const apiKey = await getSetting('TOGETHER_AI_API_KEY') || process.env.TOGETHER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Together AI API key not configured. Add it in Admin → Integrations or set TOGETHER_API_KEY env var.' }, { status: 500 })
  }

  // Model selection
  const modelMap: Record<string, string> = {
    schnell: 'black-forest-labs/FLUX.1-schnell-Free',
    schnell_paid: 'black-forest-labs/FLUX.1-schnell',
    dev: 'black-forest-labs/FLUX.1-dev',
  }

  const togetherModel = modelMap[model] || modelMap.schnell

  try {
    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: togetherModel,
        prompt,
        width: 1080,
        height: 1350,
        steps: model === 'schnell' || model === 'schnell_paid' ? 4 : 20,
        n: 1,
        response_format: 'base64',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Together AI error:', err)
      return NextResponse.json({ error: `Image generation failed: ${response.statusText}` }, { status: 500 })
    }

    const data = await response.json()
    const b64 = data.data?.[0]?.b64_json

    if (!b64) {
      return NextResponse.json({ error: 'No image data returned' }, { status: 500 })
    }

    // Save to public/uploads/social/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'social')
    await mkdir(uploadsDir, { recursive: true })

    const filename = `social-${Date.now()}.png`
    const filepath = path.join(uploadsDir, filename)
    await writeFile(filepath, Buffer.from(b64, 'base64'))

    const publicPath = `/uploads/social/${filename}`

    // Save to media library for reuse across the CRM
    try {
      await prisma.mediaItem.create({
        data: {
          filename,
          filepath: publicPath,
          altText: prompt.slice(0, 200),
          mimeType: 'image/png',
          size: Buffer.from(b64, 'base64').length,
          width: 1080,
          height: 1350,
        },
      })
    } catch {
      // Non-critical — image is saved to disk even if DB insert fails
    }

    return NextResponse.json({
      url: publicPath,
      filename,
      model: togetherModel,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}

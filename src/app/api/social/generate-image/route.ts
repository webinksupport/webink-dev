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

async function saveImageToDisk(imageData: Buffer, prompt: string): Promise<{ publicPath: string; filename: string }> {
  // Save to /app/uploads/ (persistent Docker volume) — NOT public/ which is ephemeral
  const uploadsDir = path.join('/app', 'uploads', 'social')
  await mkdir(uploadsDir, { recursive: true })

  const filename = `social-${Date.now()}.png`
  const filepath = path.join(uploadsDir, filename)
  await writeFile(filepath, imageData)

  // Serve via the /api/uploads/ dynamic route (reads from /app/uploads/)
  const publicPath = `/api/uploads/social/${filename}`

  // Save to media library
  try {
    await prisma.mediaItem.create({
      data: {
        filename,
        filepath: publicPath,
        altText: prompt.slice(0, 200),
        mimeType: 'image/png',
        size: imageData.length,
        width: 1080,
        height: 1350,
      },
    })
  } catch {
    // Non-critical
  }

  return { publicPath, filename }
}

async function downloadImageFromUrl(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`)
  return Buffer.from(await res.arrayBuffer())
}

// ─── Together AI FLUX ─────────────────────────────────────────────────────────

async function generateTogetherAI(prompt: string, model: string, referenceImageUrl?: string) {
  const apiKey = await getSetting('TOGETHER_AI_API_KEY') || process.env.TOGETHER_API_KEY
  if (!apiKey) throw new Error('Together AI API key not configured. Add it in Admin → Integrations or set TOGETHER_API_KEY env var.')

  const modelMap: Record<string, string> = {
    schnell: 'black-forest-labs/FLUX.1-schnell-Free',
    schnell_paid: 'black-forest-labs/FLUX.1-schnell',
    kontext_pro: 'black-forest-labs/FLUX.1-Kontext-pro',
  }
  const togetherModel = modelMap[model] || modelMap.schnell

  const isKontext = model === 'kontext_pro'

  const body: Record<string, unknown> = {
    model: togetherModel,
    prompt,
    width: 1080,
    height: 1350,
    n: 1,
    response_format: 'base64',
  }

  if (!isKontext) {
    body.steps = model === 'schnell' || model === 'schnell_paid' ? 4 : 20
  }

  if (isKontext && referenceImageUrl) {
    body.image_url = referenceImageUrl
  }

  const response = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Together AI error:', err)
    throw new Error(`Together AI: ${response.statusText}`)
  }

  const data = await response.json()
  const b64 = data.data?.[0]?.b64_json
  if (!b64) throw new Error('No image data returned from Together AI')

  return Buffer.from(b64, 'base64')
}

// ─── Google Gemini Imagen ─────────────────────────────────────────────────────

async function generateGeminiImagen(prompt: string, model?: string) {
  const apiKey = await getSetting('GOOGLE_AI_API_KEY') || await getSetting('GOOGLE_GEMINI_API_KEY') || process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Google AI API key not configured. Add it in Admin → Integrations or set GEMINI_API_KEY env var.')

  const imagenModel = model === 'imagen4' ? 'imagen-3.0-generate-002' : 'imagen-3.0-generate-001'

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${imagenModel}:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '4:5',
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    console.error('Gemini Imagen error:', err)
    throw new Error(`Google Imagen: ${response.statusText}`)
  }

  const data = await response.json()
  const b64 = data.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('No image data returned from Google Imagen')

  return Buffer.from(b64, 'base64')
}

// ─── OpenAI DALL-E 3 ──────────────────────────────────────────────────────────

async function generateDallE3(prompt: string) {
  const apiKey = await getSetting('OPENAI_API_KEY') || process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OpenAI API key not configured. Add OPENAI_API_KEY in Admin → Integrations.')

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1792', // Closest to 4:5 portrait that DALL-E supports
      quality: 'standard',
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('DALL-E error:', err)
    throw new Error(`DALL-E 3: ${response.statusText}`)
  }

  const data = await response.json()
  const imageUrl = data.data?.[0]?.url
  if (!imageUrl) throw new Error('No image URL returned from DALL-E 3')

  return downloadImageFromUrl(imageUrl)
}

// ─── xAI Grok Aurora ──────────────────────────────────────────────────────────

async function generateGrokAurora(prompt: string, model?: string) {
  const apiKey = await getSetting('XAI_API_KEY') || await getSetting('GROK_API_KEY') || process.env.XAI_API_KEY
  if (!apiKey) throw new Error('xAI API key not configured. Add it in Admin → Integrations or set XAI_API_KEY env var.')

  const response = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model === 'grok-imagine-pro' ? 'grok-2-image' : 'grok-2-image',
      prompt,
      n: 1,
      size: '1024x1792',
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Grok Aurora error:', err)
    throw new Error(`Grok Aurora: ${response.statusText}`)
  }

  const data = await response.json()
  const imageUrl = data.data?.[0]?.url
  if (!imageUrl) throw new Error('No image URL returned from Grok Aurora')

  return downloadImageFromUrl(imageUrl)
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { prompt, model = 'schnell', provider = 'together', referenceImageUrl } = body

  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }

  try {
    let imageBuffer: Buffer

    switch (provider) {
      case 'together':
        imageBuffer = await generateTogetherAI(prompt, model, referenceImageUrl)
        break
      case 'gemini':
      case 'google':
        imageBuffer = await generateGeminiImagen(prompt, model)
        break
      case 'openai':
        imageBuffer = await generateDallE3(prompt)
        break
      case 'xai':
        imageBuffer = await generateGrokAurora(prompt, model)
        break
      default:
        imageBuffer = await generateTogetherAI(prompt, model)
    }

    const { publicPath, filename } = await saveImageToDisk(imageBuffer, prompt)

    return NextResponse.json({
      url: publicPath,
      filename,
      model: `${provider}/${model}`,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    const message = error instanceof Error ? error.message : 'Image generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

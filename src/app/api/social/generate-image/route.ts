import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getProviderApiKey } from '@/lib/ai/get-api-keys'
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

async function generateTogetherAI(prompt: string, model: string, referenceImageUrl?: string, adminUserId?: string) {
  const apiKey = await getProviderApiKey('together', adminUserId)
  if (!apiKey) throw new Error('Together AI API key not configured. Add it in Admin → Integrations or set TOGETHER_API_KEY env var.')

  const modelMap: Record<string, string> = {
    schnell: 'black-forest-labs/FLUX.1-schnell',
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

  if (isKontext) {
    body.steps = 28
    if (referenceImageUrl) {
      body.image_url = referenceImageUrl
    }
  } else {
    body.steps = model === 'schnell' || model === 'schnell_paid' ? 4 : 20
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

async function generateGeminiImagen(prompt: string, model?: string, referenceImageUrl?: string, adminUserId?: string) {
  const apiKey = await getProviderApiKey('google', adminUserId)
  if (!apiKey) throw new Error('Google AI API key not configured. Add it in Admin → Integrations or set GEMINI_API_KEY env var.')

  // Imagen 3 models are shut down — use Imagen 4
  const imagenModel = model === 'imagen4_fast'
    ? 'imagen-4.0-fast-generate-001'
    : 'imagen-4.0-generate-001'

  // Build instances array with optional reference image
  const instance: Record<string, unknown> = { prompt }

  if (referenceImageUrl) {
    try {
      const refBuffer = await downloadImageFromUrl(referenceImageUrl)
      const refBase64 = refBuffer.toString('base64')
      instance.referenceImages = [{
        referenceType: 'STYLE',
        referenceId: 1,
        referenceImage: { bytesBase64Encoded: refBase64 },
      }]
    } catch (err) {
      console.warn('Failed to fetch reference image for Imagen, proceeding without:', err)
    }
  }

  // Imagen 4 uses the :predict endpoint with x-goog-api-key header
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${imagenModel}:predict`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        instances: [instance],
        parameters: {
          sampleCount: 1,
          aspectRatio: '3:4',
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    console.error('Gemini Imagen error:', err)
    throw new Error(`Google Imagen: ${response.statusText} — ${err}`)
  }

  const data = await response.json()
  const b64 = data.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('No image data returned from Google Imagen')

  return Buffer.from(b64, 'base64')
}

// ─── OpenAI Image Generation ─────────────────────────────────────────────────

async function generateOpenAI(prompt: string, model?: string, referenceImageUrl?: string, adminUserId?: string) {
  const apiKey = await getProviderApiKey('openai', adminUserId)
  if (!apiKey) throw new Error('OpenAI API key not configured. Add OPENAI_API_KEY in Admin → Integrations.')

  // gpt-image-mini uses gpt-image-1 with low quality; dall-e-3 uses its own model
  const useGptImage = model === 'gpt-image-mini'
  const apiModel = useGptImage ? 'gpt-image-1' : 'dall-e-3'

  // gpt-image-1 with reference image → use /images/edits endpoint
  if (useGptImage && referenceImageUrl) {
    try {
      const refBuffer = await downloadImageFromUrl(referenceImageUrl)
      const formData = new FormData()
      formData.append('model', 'gpt-image-1')
      formData.append('prompt', prompt)
      formData.append('n', '1')
      formData.append('size', '1024x1536')
      formData.append('image', new Blob([new Uint8Array(refBuffer)], { type: 'image/png' }), 'reference.png')

      const editResponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
      })

      if (editResponse.ok) {
        const editData = await editResponse.json()
        const editB64 = editData.data?.[0]?.b64_json
        if (editB64) return Buffer.from(editB64, 'base64')
        const editUrl = editData.data?.[0]?.url
        if (editUrl) return downloadImageFromUrl(editUrl)
      } else {
        console.warn('OpenAI edits failed, falling back to generations:', await editResponse.text())
      }
    } catch (err) {
      console.warn('OpenAI edits failed, falling back to generations:', err)
    }
  }

  const body: Record<string, unknown> = {
    model: apiModel,
    prompt,
    n: 1,
  }

  if (useGptImage) {
    body.size = '1024x1536'
    body.quality = 'low'
  } else {
    body.size = '1024x1792'
    body.quality = 'standard'
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('OpenAI image error:', err)
    throw new Error(`OpenAI (${apiModel}): ${response.statusText}`)
  }

  const data = await response.json()

  // gpt-image-1 returns b64_json, dall-e-3 returns url
  const b64 = data.data?.[0]?.b64_json
  if (b64) return Buffer.from(b64, 'base64')

  const imageUrl = data.data?.[0]?.url
  if (imageUrl) return downloadImageFromUrl(imageUrl)

  throw new Error('No image data returned from OpenAI')
}

// ─── xAI Grok Aurora ──────────────────────────────────────────────────────────

async function generateGrokAurora(prompt: string, model?: string, adminUserId?: string) {
  const apiKey = await getProviderApiKey('xai', adminUserId)
  if (!apiKey) throw new Error('xAI API key not configured. Add it in Admin → Integrations or set XAI_API_KEY env var.')

  // grok-2-image-generation is deprecated — use grok-imagine-image (Jan 2026+)
  const grokModel = 'grok-imagine-image'

  const response = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: grokModel,
      prompt,
      n: 1,
      // xAI does not support the size parameter
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Grok Aurora error:', err)
    throw new Error(`Grok Aurora: ${response.statusText}`)
  }

  const data = await response.json()

  // xAI may return b64_json or url
  const b64 = data.data?.[0]?.b64_json
  if (b64) return Buffer.from(b64, 'base64')

  const imageUrl = data.data?.[0]?.url
  if (imageUrl) return downloadImageFromUrl(imageUrl)

  throw new Error('No image data returned from Grok Aurora')
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminUserId = (session.user as { id?: string }).id
  const body = await req.json()
  const { prompt, model = 'schnell', provider = 'together', referenceImageUrl } = body

  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }

  try {
    let imageBuffer: Buffer

    switch (provider) {
      case 'together':
        imageBuffer = await generateTogetherAI(prompt, model, referenceImageUrl, adminUserId)
        break
      case 'gemini':
      case 'google':
        imageBuffer = await generateGeminiImagen(prompt, model, referenceImageUrl, adminUserId)
        break
      case 'openai':
        imageBuffer = await generateOpenAI(prompt, model, referenceImageUrl, adminUserId)
        break
      case 'xai':
        imageBuffer = await generateGrokAurora(prompt, model, adminUserId)
        break
      default:
        imageBuffer = await generateTogetherAI(prompt, model, undefined, adminUserId)
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

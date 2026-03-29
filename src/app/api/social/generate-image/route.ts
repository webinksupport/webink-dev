import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getProviderApiKey } from '@/lib/ai/get-api-keys'
import { getModelById, isFlux2Model, isKontextModel } from '@/lib/ai/social-model-registry'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

async function saveImageToDisk(imageData: Buffer, prompt: string, width = 1080, height = 1350): Promise<{ publicPath: string; filename: string }> {
  const uploadsDir = path.join('/app', 'uploads', 'social')
  await mkdir(uploadsDir, { recursive: true })

  const filename = `social-${Date.now()}.png`
  const filepath = path.join(uploadsDir, filename)
  await writeFile(filepath, imageData)

  const publicPath = `/api/uploads/social/${filename}`

  try {
    await prisma.mediaItem.create({
      data: {
        filename,
        filepath: publicPath,
        altText: prompt.slice(0, 200),
        mimeType: 'image/png',
        size: imageData.length,
        width,
        height,
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

async function generateTogetherAI(
  prompt: string,
  model: string,
  referenceImageUrls?: string[],
  adminUserId?: string,
  width = 1080,
  height = 1350,
) {
  const apiKey = await getProviderApiKey('together', adminUserId)
  if (!apiKey) throw new Error('Together AI API key not configured. Add it in Admin → Integrations or set TOGETHER_API_KEY env var.')

  // Resolve model ID — accept both short keys and full IDs
  let togetherModel = model
  const shortMap: Record<string, string> = {
    schnell: 'black-forest-labs/FLUX.1-schnell',
    schnell_paid: 'black-forest-labs/FLUX.1-schnell',
    kontext_pro: 'black-forest-labs/FLUX.1-Kontext-pro',
  }
  if (shortMap[model]) {
    togetherModel = shortMap[model]
  }

  const isKontext = isKontextModel(togetherModel)
  const isFlux2 = isFlux2Model(togetherModel)

  const body: Record<string, unknown> = {
    model: togetherModel,
    prompt,
    width,
    height,
    n: 1,
    response_format: 'base64',
  }

  if (isFlux2) {
    // FLUX.2: multi-reference via reference_images array, no negative prompts
    body.steps = 28
    if (referenceImageUrls && referenceImageUrls.length > 0) {
      body.reference_images = referenceImageUrls
    }
  } else if (isKontext) {
    // FLUX.1 Kontext: single reference via image_url
    body.steps = 28
    if (referenceImageUrls && referenceImageUrls.length > 0) {
      body.image_url = referenceImageUrls[0]
    }
  } else {
    // FLUX.1 Schnell
    body.steps = 4
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

  // Resolve model ID
  let imagenModel = model || 'imagen-4.0-generate-001'
  const shortMap: Record<string, string> = {
    imagen4_fast: 'imagen-4.0-fast-generate-001',
    imagen4: 'imagen-4.0-generate-001',
  }
  if (shortMap[imagenModel]) {
    imagenModel = shortMap[imagenModel]
  }

  // PART 3 FIX: Gemini API does NOT support reference images — that's Vertex AI only
  if (referenceImageUrl) {
    console.warn('Google Imagen (Gemini API) does not support reference images. Ignoring referenceImageUrl.')
  }

  const instance: Record<string, unknown> = { prompt }

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

  const useGptImage = model === 'gpt-image-mini' || model === 'gpt-image-1'
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

  // Accept both short keys and full model IDs
  let grokModel = model || 'grok-imagine-image'
  const shortMap: Record<string, string> = {
    'grok-imagine': 'grok-imagine-image',
    'grok-imagine-pro': 'grok-imagine-image-pro',
  }
  if (shortMap[grokModel]) {
    grokModel = shortMap[grokModel]
  }

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
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Grok Aurora error:', err)
    throw new Error(`Grok Aurora: ${response.statusText}`)
  }

  const data = await response.json()

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
  const {
    prompt,
    model = 'black-forest-labs/FLUX.1-schnell',
    provider = 'together',
    referenceImageUrl,
    referenceImageUrls,
    aspectRatio,
  } = body

  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }

  // Merge single + multi reference URLs
  const refUrls: string[] = referenceImageUrls || []
  if (referenceImageUrl && !refUrls.includes(referenceImageUrl)) {
    refUrls.unshift(referenceImageUrl)
  }

  // Determine dimensions from aspect ratio
  let width = 1080
  let height = 1350
  if (aspectRatio) {
    const ratioMap: Record<string, [number, number]> = {
      '4:5': [1080, 1350],
      '1:1': [1080, 1080],
      '9:16': [1080, 1920],
      '16:9': [1920, 1080],
      '3:4': [1080, 1440],
    }
    if (ratioMap[aspectRatio]) {
      ;[width, height] = ratioMap[aspectRatio]
    }
  }

  try {
    let imageBuffer: Buffer

    switch (provider) {
      case 'together':
        imageBuffer = await generateTogetherAI(prompt, model, refUrls.length > 0 ? refUrls : undefined, adminUserId, width, height)
        break
      case 'gemini':
      case 'google':
        imageBuffer = await generateGeminiImagen(prompt, model, refUrls[0], adminUserId)
        break
      case 'openai':
        imageBuffer = await generateOpenAI(prompt, model, refUrls[0], adminUserId)
        break
      case 'xai':
        imageBuffer = await generateGrokAurora(prompt, model, adminUserId)
        break
      default:
        imageBuffer = await generateTogetherAI(prompt, model, undefined, adminUserId, width, height)
    }

    const { publicPath, filename } = await saveImageToDisk(imageBuffer, prompt, width, height)

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

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getConfiguredProviders } from '@/lib/ai/get-api-keys'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

interface ImageModel {
  id: string
  provider: string
  label: string
  desc: string
  cost: string
  supportsReference?: boolean
}

interface TextModel {
  id: string
  provider: string
  label: string
  desc: string
}

interface ProviderGroup {
  provider: string
  label: string
  models: ImageModel[]
}

interface TextProviderGroup {
  provider: string
  label: string
  models: TextModel[]
}

const IMAGE_MODELS: Record<string, { key: string; altKeys?: string[]; label: string; models: ImageModel[] }> = {
  together: {
    key: 'TOGETHER_AI_API_KEY',
    altKeys: ['TOGETHER_API_KEY'],
    label: 'Together AI (FLUX)',
    models: [
      { id: 'schnell', provider: 'together', label: 'FLUX.1 Schnell Free', desc: 'Fast drafts', cost: 'Free' },
      { id: 'schnell_paid', provider: 'together', label: 'FLUX.1 Schnell', desc: 'Fast drafts', cost: '$0.003/img' },
      { id: 'kontext_pro', provider: 'together', label: 'FLUX.1 Kontext Pro', desc: 'Branded/reference', cost: '$0.04/img', supportsReference: true },
    ],
  },
  google: {
    key: 'GOOGLE_AI_API_KEY',
    altKeys: ['GOOGLE_GEMINI_API_KEY', 'GEMINI_API_KEY'],
    label: 'Google (Imagen)',
    models: [
      { id: 'imagen4_fast', provider: 'google', label: 'Imagen 4 Fast', desc: 'Best value', cost: '$0.02/img', supportsReference: true },
      { id: 'imagen4', provider: 'google', label: 'Imagen 4 Standard', desc: 'High quality', cost: '$0.04/img', supportsReference: true },
    ],
  },
  openai: {
    key: 'OPENAI_API_KEY',
    label: 'OpenAI',
    models: [
      { id: 'gpt-image-mini', provider: 'openai', label: 'GPT Image 1 Mini', desc: 'Cheapest', cost: '$0.005/img', supportsReference: true },
      { id: 'dall-e-3', provider: 'openai', label: 'DALL-E 3', desc: 'Creative', cost: '$0.04/img' },
    ],
  },
  xai: {
    key: 'XAI_API_KEY',
    altKeys: ['GROK_API_KEY'],
    label: 'xAI (Grok)',
    models: [
      { id: 'grok-imagine', provider: 'xai', label: 'Grok Imagine', desc: 'Best value', cost: '$0.02/img' },
      { id: 'grok-imagine-pro', provider: 'xai', label: 'Grok Imagine Pro', desc: 'High quality', cost: '$0.07/img' },
    ],
  },
}

const TEXT_MODELS: Record<string, { key: string; altKeys?: string[]; label: string; models: TextModel[] }> = {
  anthropic: {
    key: 'ANTHROPIC_API_KEY',
    label: 'Anthropic',
    models: [
      { id: 'claude-sonnet-4-5', provider: 'anthropic', label: 'Claude Sonnet 4.5', desc: 'Fast & smart' },
      { id: 'claude-haiku-4-5', provider: 'anthropic', label: 'Claude Haiku 4.5', desc: 'Fastest' },
    ],
  },
  google: {
    key: 'GOOGLE_AI_API_KEY',
    altKeys: ['GOOGLE_GEMINI_API_KEY', 'GEMINI_API_KEY'],
    label: 'Google',
    models: [
      { id: 'gemini-pro', provider: 'google', label: 'Gemini Pro', desc: 'Creative' },
    ],
  },
  openai: {
    key: 'OPENAI_API_KEY',
    label: 'OpenAI',
    models: [
      { id: 'gpt-4o', provider: 'openai', label: 'GPT-4o', desc: 'Versatile' },
    ],
  },
  xai: {
    key: 'XAI_API_KEY',
    altKeys: ['GROK_API_KEY'],
    label: 'xAI',
    models: [
      { id: 'grok-3', provider: 'xai', label: 'Grok 3', desc: 'Powerful' },
      { id: 'grok-3-mini', provider: 'xai', label: 'Grok 3 Mini', desc: 'Fast' },
    ],
  },
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check all storage layers: AiProvider table, Setting table, and env vars
  const adminUserId = (session.user as { id?: string }).id
  const configured = await getConfiguredProviders(adminUserId)

  const imageProviders: ProviderGroup[] = []
  for (const [provider, config] of Object.entries(IMAGE_MODELS)) {
    if (configured.has(provider)) {
      imageProviders.push({
        provider,
        label: config.label,
        models: config.models,
      })
    }
  }

  const textProviders: TextProviderGroup[] = []
  for (const [provider, config] of Object.entries(TEXT_MODELS)) {
    if (configured.has(provider)) {
      textProviders.push({
        provider,
        label: config.label,
        models: config.models,
      })
    }
  }

  return NextResponse.json({
    imageProviders,
    textProviders,
    hasAnyImageKey: imageProviders.length > 0,
    hasAnyTextKey: textProviders.length > 0,
  })
}

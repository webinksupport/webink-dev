import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getConfiguredProviders } from '@/lib/ai/get-api-keys'
import {
  getAvailableModels,
  PROVIDER_LABELS,
  COST_TIER_LABELS,
  type ModelEntry,
  type ProviderKey,
} from '@/lib/ai/social-model-registry'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

interface ImageModelResponse {
  id: string
  provider: string
  label: string
  desc: string
  cost: string
  supportsReference: boolean
  maxReferenceImages: number
  supportsStructuredPrompts: boolean
  referenceImageMode: string | null
}

interface TextModelResponse {
  id: string
  provider: string
  label: string
  desc: string
}

interface ProviderGroup {
  provider: string
  label: string
  models: ImageModelResponse[]
}

interface TextProviderGroup {
  provider: string
  label: string
  models: TextModelResponse[]
}

function costLabel(entry: ModelEntry): string {
  return COST_TIER_LABELS[entry.costTier] || entry.costTier
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminUserId = (session.user as { id?: string }).id
  const configured = await getConfiguredProviders(adminUserId)

  // Image models grouped by provider
  const imageModels = getAvailableModels('image', configured)
  const imageGroups: Record<string, ImageModelResponse[]> = {}
  for (const m of imageModels) {
    if (!imageGroups[m.provider]) imageGroups[m.provider] = []
    imageGroups[m.provider].push({
      id: m.id,
      provider: m.provider,
      label: m.name,
      desc: m.notes.split('.')[0],
      cost: costLabel(m),
      supportsReference: m.supportsReferenceImages,
      maxReferenceImages: m.maxReferenceImages,
      supportsStructuredPrompts: m.supportsStructuredPrompts,
      referenceImageMode: m.referenceImageMode,
    })
  }

  const imageProviders: ProviderGroup[] = []
  for (const [provider, models] of Object.entries(imageGroups)) {
    imageProviders.push({
      provider,
      label: PROVIDER_LABELS[provider as ProviderKey] || provider,
      models,
    })
  }

  // Text models grouped by provider
  const textModels = getAvailableModels('text', configured)
  const textGroups: Record<string, TextModelResponse[]> = {}
  for (const m of textModels) {
    if (!textGroups[m.provider]) textGroups[m.provider] = []
    textGroups[m.provider].push({
      id: m.id,
      provider: m.provider,
      label: m.name,
      desc: m.notes.split('.')[0],
    })
  }

  const textProviders: TextProviderGroup[] = []
  for (const [provider, models] of Object.entries(textGroups)) {
    textProviders.push({
      provider,
      label: PROVIDER_LABELS[provider as ProviderKey] || provider,
      models,
    })
  }

  return NextResponse.json({
    imageProviders,
    textProviders,
    hasAnyImageKey: imageProviders.length > 0,
    hasAnyTextKey: textProviders.length > 0,
  })
}

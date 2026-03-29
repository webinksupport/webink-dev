// Social Media Studio — Model Registry
// Central registry for all image and text models with capabilities, parameters, and provider info.

export type ProviderKey = 'together' | 'google' | 'xai' | 'openai' | 'fal' | 'anthropic'
export type ModelType = 'image' | 'text'
export type CostTier = 'free' | 'low' | 'medium' | 'high'
export type ReferenceImageMode = 'multi-url' | 'base64' | 'edit-endpoint' | null
export type AssetType = 'character' | 'logo' | 'product' | 'background' | 'style'

export interface ModelEntry {
  id: string
  name: string
  provider: ProviderKey
  type: ModelType
  supportsReferenceImages: boolean
  referenceImageMode: ReferenceImageMode
  supportsStructuredPrompts: boolean
  maxReferenceImages: number
  defaultParams: Record<string, unknown>
  costTier: CostTier
  notes: string
}

// ─── IMAGE MODELS ────────────────────────────────────────────────────────────

const IMAGE_MODELS: ModelEntry[] = [
  // Together AI — FLUX.2
  {
    id: 'black-forest-labs/FLUX.2-pro',
    name: 'FLUX.2 Pro',
    provider: 'together',
    type: 'image',
    supportsReferenceImages: true,
    referenceImageMode: 'multi-url',
    supportsStructuredPrompts: true,
    maxReferenceImages: 4,
    defaultParams: { steps: 28, guidance: 3.5 },
    costTier: 'high',
    notes: 'Highest quality FLUX.2 model. Supports up to 4 reference images via URL.',
  },
  {
    id: 'black-forest-labs/FLUX.2-max',
    name: 'FLUX.2 Max',
    provider: 'together',
    type: 'image',
    supportsReferenceImages: true,
    referenceImageMode: 'multi-url',
    supportsStructuredPrompts: true,
    maxReferenceImages: 4,
    defaultParams: { steps: 28, guidance: 3.5 },
    costTier: 'high',
    notes: 'Maximum quality FLUX.2 model with multi-reference support.',
  },
  {
    id: 'black-forest-labs/FLUX.2-dev',
    name: 'FLUX.2 Dev',
    provider: 'together',
    type: 'image',
    supportsReferenceImages: true,
    referenceImageMode: 'multi-url',
    supportsStructuredPrompts: true,
    maxReferenceImages: 4,
    defaultParams: { steps: 20, guidance: 3.0 },
    costTier: 'medium',
    notes: 'Development model, good balance of speed and quality.',
  },
  {
    id: 'black-forest-labs/FLUX.2-flex',
    name: 'FLUX.2 Flex',
    provider: 'together',
    type: 'image',
    supportsReferenceImages: true,
    referenceImageMode: 'multi-url',
    supportsStructuredPrompts: true,
    maxReferenceImages: 4,
    defaultParams: { steps: 20, guidance: 3.0 },
    costTier: 'medium',
    notes: 'Best for text/typography rendering. Multi-reference supported.',
  },
  // Together AI — FLUX.1
  {
    id: 'black-forest-labs/FLUX.1-Kontext-pro',
    name: 'FLUX.1 Kontext Pro',
    provider: 'together',
    type: 'image',
    supportsReferenceImages: true,
    referenceImageMode: 'multi-url',
    supportsStructuredPrompts: false,
    maxReferenceImages: 1,
    defaultParams: { steps: 28 },
    costTier: 'medium',
    notes: 'Single reference image via image_url. Good for brand consistency.',
  },
  {
    id: 'black-forest-labs/FLUX.1-schnell',
    name: 'FLUX.1 Schnell',
    provider: 'together',
    type: 'image',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: { steps: 4 },
    costTier: 'free',
    notes: 'Fast and cheap text-to-image. No reference image support.',
  },
  // Google Gemini API — Imagen 4
  {
    id: 'imagen-4.0-generate-001',
    name: 'Imagen 4',
    provider: 'google',
    type: 'image',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: { aspectRatio: '3:4' },
    costTier: 'medium',
    notes: 'Google Imagen 4 via Gemini API. Text-to-image only — reference images require Vertex AI.',
  },
  {
    id: 'imagen-4.0-fast-generate-001',
    name: 'Imagen 4 Fast',
    provider: 'google',
    type: 'image',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: { aspectRatio: '3:4' },
    costTier: 'low',
    notes: 'Faster, cheaper Imagen 4. Text-to-image only.',
  },
  // xAI — Grok
  {
    id: 'grok-imagine-image',
    name: 'Grok Imagine',
    provider: 'xai',
    type: 'image',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: {},
    costTier: 'low',
    notes: 'xAI Grok image generation. Text-to-image only.',
  },
  {
    id: 'grok-imagine-image-pro',
    name: 'Grok Imagine Pro',
    provider: 'xai',
    type: 'image',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: {},
    costTier: 'medium',
    notes: 'Higher quality Grok image generation.',
  },
  // OpenAI
  {
    id: 'gpt-image-1',
    name: 'GPT Image 1 Mini',
    provider: 'openai',
    type: 'image',
    supportsReferenceImages: true,
    referenceImageMode: 'edit-endpoint',
    supportsStructuredPrompts: false,
    maxReferenceImages: 1,
    defaultParams: { size: '1024x1536', quality: 'low' },
    costTier: 'low',
    notes: 'Uses /images/edits endpoint for reference images.',
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'openai',
    type: 'image',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: { size: '1024x1792', quality: 'standard' },
    costTier: 'medium',
    notes: 'Creative text-to-image. No reference support.',
  },
]

// ─── TEXT MODELS ─────────────────────────────────────────────────────────────

const TEXT_MODELS: ModelEntry[] = [
  // Anthropic
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    type: 'text',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: { max_tokens: 4096 },
    costTier: 'medium',
    notes: 'Fast and smart. Best for content generation.',
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    type: 'text',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: { max_tokens: 4096 },
    costTier: 'low',
    notes: 'Fastest Anthropic model.',
  },
  // Google
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    type: 'text',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: {},
    costTier: 'low',
    notes: 'Fast Google model.',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    type: 'text',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: {},
    costTier: 'medium',
    notes: 'High quality Google model.',
  },
  // xAI
  {
    id: 'grok-3',
    name: 'Grok 3',
    provider: 'xai',
    type: 'text',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: {},
    costTier: 'medium',
    notes: 'Powerful xAI model.',
  },
  {
    id: 'grok-3-fast',
    name: 'Grok 3 Fast',
    provider: 'xai',
    type: 'text',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: {},
    costTier: 'low',
    notes: 'Fast xAI model.',
  },
  // OpenAI
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    type: 'text',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: {},
    costTier: 'medium',
    notes: 'Versatile OpenAI model.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    type: 'text',
    supportsReferenceImages: false,
    referenceImageMode: null,
    supportsStructuredPrompts: false,
    maxReferenceImages: 0,
    defaultParams: {},
    costTier: 'low',
    notes: 'Fast and cheap OpenAI model.',
  },
]

// ─── REGISTRY ────────────────────────────────────────────────────────────────

const ALL_MODELS: ModelEntry[] = [...IMAGE_MODELS, ...TEXT_MODELS]

/** Provider key → required API key env var name */
const PROVIDER_KEY_MAP: Record<ProviderKey, string[]> = {
  together: ['TOGETHER_AI_API_KEY', 'TOGETHER_API_KEY'],
  google: ['GOOGLE_AI_API_KEY', 'GOOGLE_GEMINI_API_KEY', 'GEMINI_API_KEY'],
  xai: ['XAI_API_KEY', 'GROK_API_KEY'],
  openai: ['OPENAI_API_KEY'],
  fal: ['FAL_API_KEY'],
  anthropic: ['ANTHROPIC_API_KEY'],
}

/** Get all models of a given type, optionally filtered to providers with API keys */
export function getAvailableModels(
  type: ModelType,
  configuredProviders?: Set<string>
): ModelEntry[] {
  let models = ALL_MODELS.filter((m) => m.type === type)
  if (configuredProviders) {
    models = models.filter((m) => configuredProviders.has(m.provider))
  }
  return models
}

/** Get a single model entry by ID */
export function getModelById(id: string): ModelEntry | undefined {
  return ALL_MODELS.find((m) => m.id === id)
}

/** Get all image models grouped by provider */
export function getImageModelsByProvider(configuredProviders?: Set<string>): Record<string, ModelEntry[]> {
  const models = getAvailableModels('image', configuredProviders)
  const grouped: Record<string, ModelEntry[]> = {}
  for (const m of models) {
    if (!grouped[m.provider]) grouped[m.provider] = []
    grouped[m.provider].push(m)
  }
  return grouped
}

/** Get all text models grouped by provider */
export function getTextModelsByProvider(configuredProviders?: Set<string>): Record<string, ModelEntry[]> {
  const models = getAvailableModels('text', configuredProviders)
  const grouped: Record<string, ModelEntry[]> = {}
  for (const m of models) {
    if (!grouped[m.provider]) grouped[m.provider] = []
    grouped[m.provider].push(m)
  }
  return grouped
}

/** Check if a model ID is a FLUX.2 model */
export function isFlux2Model(modelId: string): boolean {
  return modelId.includes('FLUX.2')
}

/** Check if a model ID is a FLUX.1 Kontext model */
export function isKontextModel(modelId: string): boolean {
  return modelId.toLowerCase().includes('kontext')
}

/** Provider display names */
export const PROVIDER_LABELS: Record<ProviderKey, string> = {
  together: 'Together AI (FLUX)',
  google: 'Google (Imagen)',
  xai: 'xAI (Grok)',
  openai: 'OpenAI',
  fal: 'fal.ai',
  anthropic: 'Anthropic',
}

/** Cost tier display labels */
export const COST_TIER_LABELS: Record<CostTier, string> = {
  free: 'Free',
  low: 'Fast',
  medium: 'Standard',
  high: 'Premium',
}

export { PROVIDER_KEY_MAP, IMAGE_MODELS, TEXT_MODELS }

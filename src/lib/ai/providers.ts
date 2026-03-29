// AI Provider configuration and model lists

export type ProviderSlug = "OPENAI" | "ANTHROPIC" | "GOOGLE" | "PERPLEXITY" | "STABILITY"

export interface ProviderConfig {
  slug: ProviderSlug
  name: string
  description: string
  icon: string
  supportsText: boolean
  supportsImages: boolean
  models: ModelConfig[]
  keyPrefix: string
}

export interface ModelConfig {
  id: string
  name: string
  type: "text" | "image"
  inputCostPer1M: number
  outputCostPer1M: number
  imageCost?: number
}

export const PROVIDERS: Record<ProviderSlug, ProviderConfig> = {
  OPENAI: {
    slug: "OPENAI",
    name: "OpenAI",
    description: "GPT-4o for text, DALL-E 3 for images",
    icon: "Brain",
    supportsText: true,
    supportsImages: true,
    keyPrefix: "sk-",
    models: [
      { id: "gpt-4o", name: "GPT-4o", type: "text", inputCostPer1M: 5.0, outputCostPer1M: 15.0 },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", type: "text", inputCostPer1M: 0.15, outputCostPer1M: 0.6 },
      { id: "dall-e-3", name: "DALL-E 3", type: "image", inputCostPer1M: 0, outputCostPer1M: 0, imageCost: 0.04 },
    ],
  },
  ANTHROPIC: {
    slug: "ANTHROPIC",
    name: "Anthropic",
    description: "Claude for advanced text generation",
    icon: "Sparkles",
    supportsText: true,
    supportsImages: false,
    keyPrefix: "sk-ant-",
    models: [
      { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", type: "text", inputCostPer1M: 3.0, outputCostPer1M: 15.0 },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", type: "text", inputCostPer1M: 1.0, outputCostPer1M: 5.0 },
      { id: "claude-opus-4-6", name: "Claude Opus 4.6", type: "text", inputCostPer1M: 5.0, outputCostPer1M: 25.0 },
    ],
  },
  GOOGLE: {
    slug: "GOOGLE",
    name: "Google",
    description: "Gemini for fast, affordable text generation",
    icon: "Globe",
    supportsText: true,
    supportsImages: true,
    keyPrefix: "AI",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", type: "text", inputCostPer1M: 0.1, outputCostPer1M: 0.4 },
      { id: "gemini-2.0-pro", name: "Gemini 2.0 Pro", type: "text", inputCostPer1M: 1.25, outputCostPer1M: 10.0 },
    ],
  },
  PERPLEXITY: {
    slug: "PERPLEXITY",
    name: "Perplexity",
    description: "Search-augmented AI for research",
    icon: "Search",
    supportsText: true,
    supportsImages: false,
    keyPrefix: "pplx-",
    models: [
      { id: "sonar", name: "Sonar", type: "text", inputCostPer1M: 1.0, outputCostPer1M: 1.0 },
      { id: "sonar-pro", name: "Sonar Pro", type: "text", inputCostPer1M: 3.0, outputCostPer1M: 15.0 },
    ],
  },
  STABILITY: {
    slug: "STABILITY",
    name: "Stability AI",
    description: "Stable Diffusion for image generation",
    icon: "Image",
    supportsText: false,
    supportsImages: true,
    keyPrefix: "sk-",
    models: [
      { id: "stable-diffusion-3", name: "Stable Diffusion 3", type: "image", inputCostPer1M: 0, outputCostPer1M: 0, imageCost: 0.03 },
    ],
  },
}

export function getProviderConfig(slug: ProviderSlug): ProviderConfig {
  return PROVIDERS[slug]
}

export function getTextProviders(): ProviderConfig[] {
  return Object.values(PROVIDERS).filter((p) => p.supportsText)
}

export function getImageProviders(): ProviderConfig[] {
  return Object.values(PROVIDERS).filter((p) => p.supportsImages)
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function estimateCost(
  provider: ProviderSlug,
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const config = PROVIDERS[provider]
  const model = config.models.find((m) => m.id === modelId)
  if (!model) return 0
  if (model.type === "image" && model.imageCost) return model.imageCost
  return (
    (inputTokens / 1_000_000) * model.inputCostPer1M +
    (outputTokens / 1_000_000) * model.outputCostPer1M
  )
}

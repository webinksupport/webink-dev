// Dynamic Model Registry — fetches and caches models from connected providers

import { prisma } from "@/lib/prisma"
import { decryptApiKey, isClaudeSubscriptionToken } from "./service"
import { type ProviderSlug, PROVIDERS } from "./providers"

export interface AvailableModel {
  id: string
  name: string
  provider: ProviderSlug
  providerName: string
  type: "text" | "image"
  tier: "flagship" | "standard" | "fast" | "economy"
  inputCostPer1M: number
  outputCostPer1M: number
  imageCost?: number
}

export interface ModelListResult {
  models: AvailableModel[]
  lastRefreshed: Date | null
  fromCache: boolean
}

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000

function classifyTier(provider: ProviderSlug, modelId: string): AvailableModel["tier"] {
  const id = modelId.toLowerCase()
  if (provider === "ANTHROPIC") {
    if (id.includes("opus")) return "flagship"
    if (id.includes("sonnet")) return "standard"
    if (id.includes("haiku")) return "fast"
  }
  if (provider === "OPENAI") {
    if (id.includes("gpt-4o") && !id.includes("mini")) return "flagship"
    if (id.includes("gpt-4o-mini")) return "standard"
    if (id.includes("gpt-3.5")) return "economy"
  }
  if (provider === "GOOGLE") {
    if (id.includes("pro")) return "standard"
    if (id.includes("flash")) return "fast"
  }
  if (provider === "PERPLEXITY") {
    if (id.includes("pro")) return "standard"
    return "fast"
  }
  return "standard"
}

function displayName(provider: ProviderSlug, modelId: string): string {
  const staticModel = PROVIDERS[provider]?.models.find(m => m.id === modelId)
  if (staticModel) return staticModel.name

  if (provider === "ANTHROPIC") {
    const match = modelId.match(/^claude-(\w+)-(\d+)-(\d+)$/)
    if (match) {
      const [, variant, major, minor] = match
      return `Claude ${variant.charAt(0).toUpperCase() + variant.slice(1)} ${major}.${minor}`
    }
  }
  if (provider === "OPENAI") {
    return modelId.replace("gpt-", "GPT-").replace("-turbo", " Turbo").replace("-mini", " Mini")
  }
  if (provider === "GOOGLE") {
    return modelId.replace("gemini-", "Gemini ").replace("-flash", " Flash").replace("-pro", " Pro")
  }
  return modelId
}

function getCostFromStatic(provider: ProviderSlug, modelId: string, type: "input" | "output"): number {
  const model = PROVIDERS[provider]?.models.find(m => m.id === modelId)
  if (!model) {
    const tier = classifyTier(provider, modelId)
    if (type === "input") {
      return tier === "flagship" ? 5.0 : tier === "standard" ? 3.0 : tier === "fast" ? 0.5 : 0.1
    }
    return tier === "flagship" ? 25.0 : tier === "standard" ? 15.0 : tier === "fast" ? 2.5 : 0.4
  }
  return type === "input" ? model.inputCostPer1M : model.outputCostPer1M
}

async function fetchAnthropicModels(apiKey: string, isSubscription: boolean): Promise<AvailableModel[]> {
  try {
    const headers: Record<string, string> = {
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    }
    if (isSubscription) {
      headers["Authorization"] = `Bearer ${apiKey}`
      headers["anthropic-beta"] = "claude-code-20250219,oauth-2025-04-20"
      headers["user-agent"] = "claude-cli/2.1.62"
      headers["x-app"] = "cli"
      headers["anthropic-dangerous-direct-browser-access"] = "true"
    } else {
      headers["x-api-key"] = apiKey
    }

    const res = await fetch("https://api.anthropic.com/v1/models", { method: "GET", headers })
    if (!res.ok) return getStaticModels("ANTHROPIC")

    const data = await res.json()
    const models: AvailableModel[] = []
    const seen = new Set<string>()
    const modelList = data.data || data.models || []

    for (const m of modelList) {
      const id = m.id || m.name || ""
      if (!id.startsWith("claude-")) continue
      const baseId = id.replace(/-\d{8}$/, "")
      if (seen.has(baseId)) continue
      seen.add(baseId)

      models.push({
        id: baseId,
        name: displayName("ANTHROPIC", baseId),
        provider: "ANTHROPIC",
        providerName: "Anthropic",
        type: "text",
        tier: classifyTier("ANTHROPIC", baseId),
        inputCostPer1M: getCostFromStatic("ANTHROPIC", baseId, "input"),
        outputCostPer1M: getCostFromStatic("ANTHROPIC", baseId, "output"),
      })
    }

    const tierOrder = { flagship: 0, standard: 1, fast: 2, economy: 3 }
    models.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])
    return models.length > 0 ? models : getStaticModels("ANTHROPIC")
  } catch {
    return getStaticModels("ANTHROPIC")
  }
}

async function fetchOpenAIModels(apiKey: string): Promise<AvailableModel[]> {
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) return getStaticModels("OPENAI")

    const data = await res.json()
    const models: AvailableModel[] = []
    const seen = new Set<string>()
    const allowedPrefixes = ["gpt-4", "gpt-3.5", "dall-e", "o1", "o3", "o4"]

    for (const m of data.data || []) {
      const id = m.id || ""
      if (!allowedPrefixes.some(p => id.startsWith(p))) continue
      if (id.includes("ft:") || id.includes(":ft-")) continue
      if (id.match(/-\d{4}$/) && !id.includes("turbo")) continue
      if (seen.has(id)) continue
      seen.add(id)

      const isImage = id.startsWith("dall-e")
      models.push({
        id,
        name: displayName("OPENAI", id),
        provider: "OPENAI",
        providerName: "OpenAI",
        type: isImage ? "image" : "text",
        tier: classifyTier("OPENAI", id),
        inputCostPer1M: getCostFromStatic("OPENAI", id, "input"),
        outputCostPer1M: getCostFromStatic("OPENAI", id, "output"),
        imageCost: isImage ? 0.04 : undefined,
      })
    }

    const tierOrder = { flagship: 0, standard: 1, fast: 2, economy: 3 }
    models.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])
    return models.length > 0 ? models : getStaticModels("OPENAI")
  } catch {
    return getStaticModels("OPENAI")
  }
}

async function fetchGoogleModels(apiKey: string): Promise<AvailableModel[]> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    if (!res.ok) return getStaticModels("GOOGLE")

    const data = await res.json()
    const models: AvailableModel[] = []
    const seen = new Set<string>()

    for (const m of data.models || []) {
      const id = (m.name || "").replace("models/", "")
      if (!id.startsWith("gemini-")) continue
      if (id.includes("embedding") || id.includes("aqa")) continue
      if (seen.has(id)) continue
      seen.add(id)

      if (!m.supportedGenerationMethods?.includes("generateContent")) continue

      models.push({
        id,
        name: displayName("GOOGLE", id),
        provider: "GOOGLE",
        providerName: "Google",
        type: "text",
        tier: classifyTier("GOOGLE", id),
        inputCostPer1M: getCostFromStatic("GOOGLE", id, "input"),
        outputCostPer1M: getCostFromStatic("GOOGLE", id, "output"),
      })
    }

    const tierOrder = { flagship: 0, standard: 1, fast: 2, economy: 3 }
    models.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])
    return models.length > 0 ? models : getStaticModels("GOOGLE")
  } catch {
    return getStaticModels("GOOGLE")
  }
}

function getStaticModels(provider: ProviderSlug): AvailableModel[] {
  const config = PROVIDERS[provider]
  if (!config) return []
  return config.models.map(m => ({
    id: m.id,
    name: m.name,
    provider,
    providerName: config.name,
    type: m.type,
    tier: classifyTier(provider, m.id),
    inputCostPer1M: m.inputCostPer1M,
    outputCostPer1M: m.outputCostPer1M,
    imageCost: m.imageCost,
  }))
}

export async function getAvailableModels(
  userId: string,
  forceRefresh = false
): Promise<ModelListResult> {
  const providers = await prisma.aiProvider.findMany({
    where: { userId, isConnected: true },
  })

  if (providers.length === 0) {
    return { models: [], lastRefreshed: null, fromCache: false }
  }

  const now = new Date()
  const allCached = !forceRefresh && providers.every(
    p => p.models && p.modelsRefreshed &&
    (now.getTime() - p.modelsRefreshed.getTime()) < CACHE_DURATION_MS
  )

  if (allCached) {
    const allModels: AvailableModel[] = []
    let oldestRefresh: Date | null = null
    for (const p of providers) {
      const cached = p.models as AvailableModel[] | null
      if (cached && Array.isArray(cached)) allModels.push(...cached)
      if (!oldestRefresh || (p.modelsRefreshed && p.modelsRefreshed < oldestRefresh)) {
        oldestRefresh = p.modelsRefreshed
      }
    }
    return { models: allModels, lastRefreshed: oldestRefresh, fromCache: true }
  }

  const allModels: AvailableModel[] = []
  let latestRefresh: Date | null = null

  for (const p of providers) {
    let models: AvailableModel[] = []
    const apiKey = decryptApiKey(p.apiKey)

    try {
      switch (p.slug) {
        case "ANTHROPIC":
          models = await fetchAnthropicModels(apiKey, isClaudeSubscriptionToken(apiKey))
          break
        case "OPENAI":
          models = await fetchOpenAIModels(apiKey)
          break
        case "GOOGLE":
          models = await fetchGoogleModels(apiKey)
          break
        case "PERPLEXITY":
        case "STABILITY":
          models = getStaticModels(p.slug)
          break
      }
    } catch {
      models = getStaticModels(p.slug)
    }

    const refreshedAt = new Date()
    await prisma.aiProvider.update({
      where: { id: p.id },
      data: {
        models: JSON.parse(JSON.stringify(models)),
        modelsRefreshed: refreshedAt,
      },
    })

    allModels.push(...models)
    if (!latestRefresh || refreshedAt > latestRefresh) latestRefresh = refreshedAt
  }

  return { models: allModels, lastRefreshed: latestRefresh, fromCache: false }
}

export function getBestDefaultModel(models: AvailableModel[]): AvailableModel | null {
  const textModels = models.filter(m => m.type === "text")
  if (textModels.length === 0) return null

  const priority = [
    (m: AvailableModel) => m.provider === "ANTHROPIC" && m.tier === "flagship",
    (m: AvailableModel) => m.provider === "ANTHROPIC" && m.tier === "standard",
    (m: AvailableModel) => m.provider === "OPENAI" && m.tier === "flagship",
    (m: AvailableModel) => m.provider === "GOOGLE" && m.tier === "standard",
    (m: AvailableModel) => m.provider === "ANTHROPIC" && m.tier === "fast",
    (m: AvailableModel) => m.tier === "flagship",
    (m: AvailableModel) => m.tier === "standard",
    (m: AvailableModel) => m.tier === "fast",
  ]

  for (const pred of priority) {
    const found = textModels.find(pred)
    if (found) return found
  }
  return textModels[0]
}

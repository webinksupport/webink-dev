// Shared AI text generation helper for server-side use
// Checks connected AiProviders first, falls back to Settings/env keys

import { prisma } from "@/lib/prisma"
import { getSetting } from "@/lib/settings"
import { callAiProvider, decryptApiKey } from "./service"

// Map frontend provider slugs to backend ProviderSlug and key settings
const PROVIDER_SLUG_MAP: Record<string, { slug: "OPENAI" | "ANTHROPIC" | "GOOGLE" | "XAI"; keys: string[] }> = {
  anthropic: { slug: "ANTHROPIC", keys: ["ANTHROPIC_API_KEY"] },
  openai: { slug: "OPENAI", keys: ["OPENAI_API_KEY"] },
  google: { slug: "GOOGLE", keys: ["GOOGLE_AI_API_KEY", "GOOGLE_GEMINI_API_KEY", "GEMINI_API_KEY"] },
  xai: { slug: "XAI", keys: ["XAI_API_KEY", "GROK_API_KEY"] },
}

export async function generateTextWithProviders(
  prompt: string,
  userId?: string,
  selectedModel?: string
): Promise<string> {
  // Parse "provider/model" format from the frontend model selector
  let requestedProvider: string | undefined
  let requestedModelId: string | undefined
  if (selectedModel?.includes("/")) {
    const [prov, ...rest] = selectedModel.split("/")
    requestedProvider = prov
    requestedModelId = rest.join("/")
  }

  // 1. If a specific provider/model was requested, try to fulfill it directly
  if (requestedProvider && requestedModelId) {
    const mapping = PROVIDER_SLUG_MAP[requestedProvider]
    if (mapping) {
      // Try connected providers first
      if (userId) {
        const connectedProvider = await prisma.aiProvider.findFirst({
          where: { userId, isConnected: true, slug: mapping.slug as never },
        })
        if (connectedProvider) {
          const apiKey = decryptApiKey(connectedProvider.apiKey)
          const result = await callAiProvider(apiKey, mapping.slug, requestedModelId, prompt)
          if (result.success) return result.text
        }
      }
      // Try settings/env keys for the requested provider
      for (const keyName of mapping.keys) {
        const key = await getSetting(keyName) || process.env[keyName]
        if (key) {
          const result = await callAiProvider(key, mapping.slug, requestedModelId, prompt)
          if (result.success) return result.text
        }
      }
    }
  }

  // 2. Try connected providers if userId is available (no specific model requested)
  if (userId) {
    const connectedProviders = await prisma.aiProvider.findMany({
      where: { userId, isConnected: true },
      orderBy: { isDefault: "desc" },
    })

    if (connectedProviders.length > 0) {
      const provider = connectedProviders[0]
      const apiKey = decryptApiKey(provider.apiKey)
      const model = getDefaultModel(provider.slug)

      const result = await callAiProvider(apiKey, provider.slug, model, prompt)
      if (result.success) return result.text
    }
  }

  // 3. Fallback to Settings/env keys (original behavior)
  const googleKey = await getSetting("GOOGLE_AI_API_KEY") || await getSetting("GOOGLE_GEMINI_API_KEY") || process.env.GOOGLE_AI_API_KEY
  const anthropicKey = await getSetting("ANTHROPIC_API_KEY") || process.env.ANTHROPIC_API_KEY
  const openaiKey = await getSetting("OPENAI_API_KEY") || process.env.OPENAI_API_KEY

  if (googleKey) {
    const result = await callAiProvider(googleKey, "GOOGLE", "gemini-2.0-flash", prompt)
    if (result.success) return result.text
  }

  if (anthropicKey) {
    const result = await callAiProvider(anthropicKey, "ANTHROPIC", "claude-haiku-4-5", prompt)
    if (result.success) return result.text
  }

  if (openaiKey) {
    const result = await callAiProvider(openaiKey, "OPENAI", "gpt-4o", prompt)
    if (result.success) return result.text
  }

  const xaiKey = await getSetting("XAI_API_KEY") || await getSetting("GROK_API_KEY") || process.env.XAI_API_KEY
  if (xaiKey) {
    const result = await callAiProvider(xaiKey, "XAI", "grok-3-mini-fast", prompt)
    if (result.success) return result.text
  }

  throw new Error("No AI API key configured. Connect a provider in Admin > Integrations, or add API keys.")
}

function getDefaultModel(slug: string): string {
  switch (slug) {
    case "ANTHROPIC": return "claude-sonnet-4-5"
    case "OPENAI": return "gpt-4o"
    case "GOOGLE": return "gemini-2.0-flash"
    case "PERPLEXITY": return "sonar"
    default: return "gpt-4o"
  }
}

// Shared AI text generation helper for server-side use
// Checks connected AiProviders first, falls back to Settings/env keys

import { prisma } from "@/lib/prisma"
import { getSetting } from "@/lib/settings"
import { callAiProvider, decryptApiKey } from "./service"

export async function generateTextWithProviders(
  prompt: string,
  userId?: string,
  selectedModel?: string
): Promise<string> {
  // 1. Try connected providers if userId is available
  if (userId) {
    const connectedProviders = await prisma.aiProvider.findMany({
      where: { userId, isConnected: true },
      orderBy: { isDefault: "desc" },
    })

    if (connectedProviders.length > 0) {
      const provider = connectedProviders[0]
      const apiKey = decryptApiKey(provider.apiKey)
      const model = selectedModel || getDefaultModel(provider.slug)

      const result = await callAiProvider(apiKey, provider.slug, model, prompt)
      if (result.success) return result.text
    }
  }

  // 2. Fallback to Settings/env keys (original behavior)
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

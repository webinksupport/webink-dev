import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { callAiProvider, decryptApiKey } from "@/lib/ai/service"
import { getSetting } from "@/lib/settings"
import type { ProviderSlug } from "@/lib/ai/providers"

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role: string }).role !== "ADMIN") return null
  return session
}

// Unified AI text generation endpoint
// Checks connected providers first, falls back to env/settings keys
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const { prompt, systemPrompt, provider: requestedProvider, model: requestedModel, maxTokens, temperature, feature } = await req.json()

  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 })
  }

  // 1. Try connected AI providers from AiProvider table
  const connectedProviders = await prisma.aiProvider.findMany({
    where: { userId, isConnected: true },
    orderBy: { isDefault: "desc" },
  })

  if (connectedProviders.length > 0) {
    // If a specific provider was requested, try that first
    let targetProvider = connectedProviders.find(p =>
      requestedProvider ? p.slug === requestedProvider : p.isDefault
    ) || connectedProviders[0]

    // If specific provider requested but not connected, fall through
    if (requestedProvider && !targetProvider) {
      targetProvider = connectedProviders[0]
    }

    const apiKey = decryptApiKey(targetProvider.apiKey)
    const model = requestedModel || getDefaultModel(targetProvider.slug)

    const result = await callAiProvider(
      apiKey,
      targetProvider.slug as ProviderSlug,
      model,
      prompt,
      systemPrompt,
      maxTokens || 2000,
      temperature || 0.7
    )

    if (result.success) {
      return NextResponse.json(result)
    }
    // If connected provider failed, continue to fallback
  }

  // 2. Fallback to env/settings keys (existing behavior)
  const googleKey = await getSetting("GOOGLE_AI_API_KEY") || await getSetting("GOOGLE_GEMINI_API_KEY") || process.env.GOOGLE_AI_API_KEY
  const anthropicKey = await getSetting("ANTHROPIC_API_KEY") || process.env.ANTHROPIC_API_KEY
  const openaiKey = await getSetting("OPENAI_API_KEY") || process.env.OPENAI_API_KEY

  if (googleKey) {
    const result = await callAiProvider(googleKey, "GOOGLE", "gemini-2.0-flash", prompt, systemPrompt, maxTokens || 2000, temperature || 0.7)
    if (result.success) return NextResponse.json(result)
  }

  if (anthropicKey) {
    const result = await callAiProvider(anthropicKey, "ANTHROPIC", "claude-haiku-4-5", prompt, systemPrompt, maxTokens || 2000, temperature || 0.7)
    if (result.success) return NextResponse.json(result)
  }

  if (openaiKey) {
    const result = await callAiProvider(openaiKey, "OPENAI", "gpt-4o", prompt, systemPrompt, maxTokens || 2000, temperature || 0.7)
    if (result.success) return NextResponse.json(result)
  }

  return NextResponse.json(
    { error: "No AI provider configured. Connect a provider in Admin > Integrations, or add API keys." },
    { status: 500 }
  )
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

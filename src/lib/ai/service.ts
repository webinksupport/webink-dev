// Unified AI Service Layer
// All AI requests route through this service

import { type ProviderSlug, estimateCost } from "./providers"

export interface AiRequest {
  provider?: ProviderSlug
  model?: string
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  feature: string
}

export interface AiResponse {
  text: string
  provider: ProviderSlug
  model: string
  inputTokens: number
  outputTokens: number
  estimatedCost: number
  success: boolean
  error?: string
}

export async function callAiProvider(
  apiKey: string,
  provider: ProviderSlug,
  model: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 2000,
  temperature: number = 0.7
): Promise<AiResponse> {
  try {
    switch (provider) {
      case "OPENAI":
        return await callOpenAI(apiKey, model, prompt, systemPrompt, maxTokens, temperature)
      case "ANTHROPIC":
        return await callAnthropic(apiKey, model, prompt, systemPrompt, maxTokens, temperature)
      case "GOOGLE":
        return await callGoogle(apiKey, model, prompt, systemPrompt, maxTokens, temperature)
      case "PERPLEXITY":
        return await callPerplexity(apiKey, model, prompt, systemPrompt, maxTokens, temperature)
      case "XAI":
        return await callXAI(apiKey, model, prompt, systemPrompt, maxTokens, temperature)
      default:
        return {
          text: "",
          provider,
          model,
          inputTokens: 0,
          outputTokens: 0,
          estimatedCost: 0,
          success: false,
          error: `Unsupported provider: ${provider}`,
        }
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error"
    return { text: "", provider, model, inputTokens: 0, outputTokens: 0, estimatedCost: 0, success: false, error }
  }
}

async function callOpenAI(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 2000,
  temperature: number = 0.7
): Promise<AiResponse> {
  const messages = []
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt })
  messages.push({ role: "user", content: prompt })

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ""
  const inputTokens = data.usage?.prompt_tokens || 0
  const outputTokens = data.usage?.completion_tokens || 0

  return {
    text,
    provider: "OPENAI",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: estimateCost("OPENAI", model, inputTokens, outputTokens),
    success: true,
  }
}

export function isClaudeSubscriptionToken(key: string): boolean {
  return key.startsWith("sk-ant-oat")
}

async function callAnthropic(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 2000,
  temperature: number = 0.7
): Promise<AiResponse> {
  if (isClaudeSubscriptionToken(apiKey)) {
    return callAnthropicWithSubscription(apiKey, model, prompt, systemPrompt, maxTokens, temperature)
  }

  const body: Record<string, unknown> = {
    model,
    max_tokens: maxTokens,
    temperature,
    messages: [{ role: "user", content: prompt }],
  }
  if (systemPrompt) body.system = systemPrompt

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Anthropic API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text || ""
  const inputTokens = data.usage?.input_tokens || 0
  const outputTokens = data.usage?.output_tokens || 0

  return {
    text,
    provider: "ANTHROPIC",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: estimateCost("ANTHROPIC", model, inputTokens, outputTokens),
    success: true,
  }
}

async function callAnthropicWithSubscription(
  oauthToken: string,
  model: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 2000,
  temperature: number = 0.7
): Promise<AiResponse> {
  const systemBlocks: { type: string; text: string }[] = [
    { type: "text", text: "You are Claude Code, Anthropic's official CLI for Claude." },
  ]
  if (systemPrompt) {
    systemBlocks.push({ type: "text", text: systemPrompt })
  }

  const body: Record<string, unknown> = {
    model,
    max_tokens: maxTokens,
    temperature,
    messages: [{ role: "user", content: prompt }],
    system: systemBlocks,
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${oauthToken}`,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "claude-code-20250219,oauth-2025-04-20,fine-grained-tool-streaming-2025-05-14,interleaved-thinking-2025-05-14",
      "user-agent": "claude-cli/2.1.62",
      "x-app": "cli",
      "anthropic-dangerous-direct-browser-access": "true",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (res.status === 401) {
      throw new Error("Claude subscription token expired or invalid. Generate a new one with `claude setup-token` and reconnect.")
    }
    if (res.status === 403) {
      throw new Error("Claude subscription access denied. Token may have been revoked.")
    }
    throw new Error(err.error?.message || `Anthropic subscription auth error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text || ""
  const inputTokens = data.usage?.input_tokens || 0
  const outputTokens = data.usage?.output_tokens || 0

  return {
    text,
    provider: "ANTHROPIC",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: 0, // subscription = no API billing
    success: true,
  }
}

async function callGoogle(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 2000,
  temperature: number = 0.7
): Promise<AiResponse> {
  const contents = []
  if (systemPrompt) {
    contents.push({ role: "user", parts: [{ text: systemPrompt }] })
    contents.push({ role: "model", parts: [{ text: "Understood." }] })
  }
  contents.push({ role: "user", parts: [{ text: prompt }] })

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: maxTokens, temperature },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Google API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const inputTokens = data.usageMetadata?.promptTokenCount || 0
  const outputTokens = data.usageMetadata?.candidatesTokenCount || 0

  return {
    text,
    provider: "GOOGLE",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: estimateCost("GOOGLE", model, inputTokens, outputTokens),
    success: true,
  }
}

async function callPerplexity(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 2000,
  temperature: number = 0.7
): Promise<AiResponse> {
  const messages = []
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt })
  messages.push({ role: "user", content: prompt })

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Perplexity API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ""
  const inputTokens = data.usage?.prompt_tokens || 0
  const outputTokens = data.usage?.completion_tokens || 0

  return {
    text,
    provider: "PERPLEXITY",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: estimateCost("PERPLEXITY", model, inputTokens, outputTokens),
    success: true,
  }
}

async function callXAI(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 2000,
  temperature: number = 0.7
): Promise<AiResponse> {
  const messages = []
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt })
  messages.push({ role: "user", content: prompt })

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `xAI API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ""
  const inputTokens = data.usage?.prompt_tokens || 0
  const outputTokens = data.usage?.completion_tokens || 0

  return {
    text,
    provider: "XAI",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: 0,
    success: true,
  }
}

// Test provider connection with minimal API call
export async function testProviderConnection(
  apiKey: string,
  provider: ProviderSlug
): Promise<{ success: boolean; error?: string }> {
  try {
    switch (provider) {
      case "OPENAI": {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return { success: true }
      }
      case "ANTHROPIC": {
        if (isClaudeSubscriptionToken(apiKey)) {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "anthropic-version": "2023-06-01",
              "anthropic-beta": "claude-code-20250219,oauth-2025-04-20",
              "user-agent": "claude-cli/2.1.62",
              "x-app": "cli",
              "anthropic-dangerous-direct-browser-access": "true",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "claude-haiku-4-5",
              max_tokens: 1,
              system: [{ type: "text", text: "You are Claude Code, Anthropic's official CLI for Claude." }],
              messages: [{ role: "user", content: "Hi" }],
            }),
          })
          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error?.message || `HTTP ${res.status}`)
          }
          return { success: true }
        }
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5",
            max_tokens: 1,
            messages: [{ role: "user", content: "Hi" }],
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return { success: true }
      }
      case "GOOGLE": {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return { success: true }
      }
      case "PERPLEXITY": {
        const res = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "sonar",
            messages: [{ role: "user", content: "Hi" }],
            max_tokens: 1,
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return { success: true }
      }
      case "STABILITY": {
        const res = await fetch("https://api.stability.ai/v1/user/account", {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return { success: true }
      }
      default:
        return { success: false, error: "Unknown provider" }
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Connection failed" }
  }
}

// Simple XOR encryption for API keys at rest
export function encryptApiKey(key: string): string {
  const secret = process.env.NEXTAUTH_SECRET || "webink-secret"
  let encrypted = ""
  for (let i = 0; i < key.length; i++) {
    encrypted += String.fromCharCode(key.charCodeAt(i) ^ secret.charCodeAt(i % secret.length))
  }
  return Buffer.from(encrypted).toString("base64")
}

export function decryptApiKey(encrypted: string): string {
  const secret = process.env.NEXTAUTH_SECRET || "webink-secret"
  const decoded = Buffer.from(encrypted, "base64").toString()
  let decrypted = ""
  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ secret.charCodeAt(i % secret.length))
  }
  return decrypted
}

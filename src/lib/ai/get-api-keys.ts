// Unified API key resolver: AiProvider table → Setting table → process.env
// This ensures keys saved via either the AiProviderManager or the Settings
// section on the Integrations page are found by all AI routes.

import { prisma } from "@/lib/prisma"
import { getSetting, getSettings } from "@/lib/settings"
import { decryptApiKey } from "./service"

// Map from provider name to AiProvider slug and Setting key names
const PROVIDER_KEY_MAP: Record<string, { slug?: string; settingKeys: string[]; envKeys: string[] }> = {
  anthropic: {
    slug: "ANTHROPIC",
    settingKeys: ["ANTHROPIC_API_KEY"],
    envKeys: ["ANTHROPIC_API_KEY"],
  },
  openai: {
    slug: "OPENAI",
    settingKeys: ["OPENAI_API_KEY"],
    envKeys: ["OPENAI_API_KEY"],
  },
  google: {
    slug: "GOOGLE",
    settingKeys: ["GOOGLE_AI_API_KEY", "GOOGLE_GEMINI_API_KEY", "GEMINI_API_KEY"],
    envKeys: ["GOOGLE_AI_API_KEY", "GEMINI_API_KEY"],
  },
  xai: {
    slug: undefined, // not in AiProviderSlug enum
    settingKeys: ["XAI_API_KEY", "GROK_API_KEY"],
    envKeys: ["XAI_API_KEY"],
  },
  together: {
    slug: undefined, // not in AiProviderSlug enum
    settingKeys: ["TOGETHER_AI_API_KEY"],
    envKeys: ["TOGETHER_API_KEY", "TOGETHER_AI_API_KEY"],
  },
}

// Simple in-memory cache (per-provider, 60s TTL)
const cache = new Map<string, { key: string; ts: number }>()
const CACHE_TTL = 60_000

/**
 * Get the API key for a provider, checking all storage layers.
 * Order: AiProvider table (admin user) → Setting table → process.env
 */
export async function getProviderApiKey(
  provider: string,
  adminUserId?: string
): Promise<string | null> {
  const cacheKey = `${provider}:${adminUserId || "global"}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.key
  }

  const mapping = PROVIDER_KEY_MAP[provider]
  if (!mapping) return null

  let key: string | null = null

  // 1. Check AiProvider table (encrypted, per-user)
  if (mapping.slug && adminUserId) {
    try {
      const row = await prisma.aiProvider.findFirst({
        where: { userId: adminUserId, slug: mapping.slug as never, isConnected: true },
      })
      if (row?.apiKey) {
        key = decryptApiKey(row.apiKey)
      }
    } catch {
      // AiProvider table not available or query failed
    }
  }

  // If no userId provided, try any connected admin provider
  if (!key && mapping.slug) {
    try {
      const row = await prisma.aiProvider.findFirst({
        where: { slug: mapping.slug as never, isConnected: true },
      })
      if (row?.apiKey) {
        key = decryptApiKey(row.apiKey)
      }
    } catch {
      // ignore
    }
  }

  // 2. Check Setting table
  if (!key) {
    for (const settingKey of mapping.settingKeys) {
      const val = await getSetting(settingKey)
      if (val) {
        key = val
        break
      }
    }
  }

  // 3. Check env vars (getSetting already falls back to env, but check explicit env key names too)
  if (!key) {
    for (const envKey of mapping.envKeys) {
      if (process.env[envKey]) {
        key = process.env[envKey]!
        break
      }
    }
  }

  if (key) {
    cache.set(cacheKey, { key, ts: Date.now() })
  }

  return key
}

/**
 * Check which providers have a usable API key configured.
 * Returns a set of provider names (e.g., "google", "openai", "together").
 */
export async function getConfiguredProviders(adminUserId?: string): Promise<Set<string>> {
  const configured = new Set<string>()

  // Batch-fetch all setting keys at once
  const allSettingKeys: string[] = []
  for (const mapping of Object.values(PROVIDER_KEY_MAP)) {
    allSettingKeys.push(...mapping.settingKeys)
  }
  const settingsMap = await getSettings(allSettingKeys)

  // Check AiProvider table for any connected providers
  let connectedSlugs = new Set<string>()
  try {
    const connected = await prisma.aiProvider.findMany({
      where: { isConnected: true },
      select: { slug: true },
    })
    connectedSlugs = new Set(connected.map((p) => p.slug))
  } catch {
    // ignore
  }

  for (const [provider, mapping] of Object.entries(PROVIDER_KEY_MAP)) {
    // Check AiProvider
    if (mapping.slug && connectedSlugs.has(mapping.slug)) {
      configured.add(provider)
      continue
    }
    // Check Settings
    const hasSettingKey = mapping.settingKeys.some((k) => settingsMap[k])
    if (hasSettingKey) {
      configured.add(provider)
      continue
    }
    // Check env
    const hasEnvKey = mapping.envKeys.some((k) => process.env[k])
    if (hasEnvKey) {
      configured.add(provider)
    }
  }

  return configured
}

/**
 * Invalidate cached key for a provider (call after key changes).
 */
export function invalidateKeyCache(provider?: string) {
  if (provider) {
    cache.forEach((_, k) => {
      if (k.startsWith(`${provider}:`)) cache.delete(k)
    })
  } else {
    cache.clear()
  }
}

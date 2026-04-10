'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Brain,
  Sparkles,
  Globe,
  Search,
  ImageIcon,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  Star,
  Zap,
  Shield,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Brain,
  Sparkles,
  Globe,
  Search,
  Image: ImageIcon,
}

type ProviderSlug = 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'PERPLEXITY' | 'STABILITY'

interface ProviderConfig {
  slug: ProviderSlug
  name: string
  description: string
  icon: string
  supportsText: boolean
  supportsImages: boolean
  keyPrefix: string
  models: { id: string; name: string; type: string; inputCostPer1M: number; outputCostPer1M: number; imageCost?: number }[]
}

const PROVIDERS: Record<ProviderSlug, ProviderConfig> = {
  OPENAI: {
    slug: 'OPENAI', name: 'OpenAI', description: 'GPT-4o for text, DALL-E 3 for images',
    icon: 'Brain', supportsText: true, supportsImages: true, keyPrefix: 'sk-',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', type: 'text', inputCostPer1M: 5.0, outputCostPer1M: 15.0 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', type: 'text', inputCostPer1M: 0.15, outputCostPer1M: 0.6 },
      { id: 'dall-e-3', name: 'DALL-E 3', type: 'image', inputCostPer1M: 0, outputCostPer1M: 0, imageCost: 0.04 },
    ],
  },
  ANTHROPIC: {
    slug: 'ANTHROPIC', name: 'Anthropic', description: 'Claude for advanced text generation',
    icon: 'Sparkles', supportsText: true, supportsImages: false, keyPrefix: 'sk-ant-',
    models: [
      { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', type: 'text', inputCostPer1M: 3.0, outputCostPer1M: 15.0 },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', type: 'text', inputCostPer1M: 1.0, outputCostPer1M: 5.0 },
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', type: 'text', inputCostPer1M: 5.0, outputCostPer1M: 25.0 },
    ],
  },
  GOOGLE: {
    slug: 'GOOGLE', name: 'Google', description: 'Gemini for fast, affordable text generation',
    icon: 'Globe', supportsText: true, supportsImages: true, keyPrefix: 'AI',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', type: 'text', inputCostPer1M: 0.1, outputCostPer1M: 0.4 },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', type: 'text', inputCostPer1M: 1.25, outputCostPer1M: 10.0 },
    ],
  },
  PERPLEXITY: {
    slug: 'PERPLEXITY', name: 'Perplexity', description: 'Search-augmented AI for research',
    icon: 'Search', supportsText: true, supportsImages: false, keyPrefix: 'pplx-',
    models: [
      { id: 'sonar', name: 'Sonar', type: 'text', inputCostPer1M: 1.0, outputCostPer1M: 1.0 },
      { id: 'sonar-pro', name: 'Sonar Pro', type: 'text', inputCostPer1M: 3.0, outputCostPer1M: 15.0 },
    ],
  },
  STABILITY: {
    slug: 'STABILITY', name: 'Stability AI', description: 'Stable Diffusion for image generation',
    icon: 'Image', supportsText: false, supportsImages: true, keyPrefix: 'sk-',
    models: [
      { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', type: 'image', inputCostPer1M: 0, outputCostPer1M: 0, imageCost: 0.03 },
    ],
  },
}

interface ConnectedProvider {
  id: string
  slug: ProviderSlug
  authMethod?: string
  oauthEmail?: string
  tokenExpiresAt?: string
  isConnected: boolean
  isDefault: boolean
  rateLimit: number
  models?: unknown[]
  modelsRefreshed?: string
}

export default function AiProviderManager() {
  const [providers, setProviders] = useState<ConnectedProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [connectingSlug, setConnectingSlug] = useState<ProviderSlug | null>(null)
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({})
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [testing, setTesting] = useState<string | null>(null)
  const [subscriptionMode, setSubscriptionMode] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/providers')
      const data = await res.json()
      setProviders(data.providers || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProviders() }, [fetchProviders])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type })

  const connectProvider = async (slug: ProviderSlug) => {
    const apiKey = apiKeyInputs[slug]
    if (!apiKey) { showToast('Enter an API key', 'error'); return }

    setTesting(slug)
    try {
      const res = await fetch('/api/ai/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, apiKey, isDefault: providers.filter(p => p.isConnected).length === 0 }),
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.error || 'Connection failed', 'error'); return }

      showToast(`${PROVIDERS[slug].name} connected!`, 'success')
      setApiKeyInputs(prev => ({ ...prev, [slug]: '' }))
      setConnectingSlug(null)
      fetchProviders()
    } catch {
      showToast('Failed to connect provider', 'error')
    } finally {
      setTesting(null)
    }
  }

  const disconnectProvider = async (slug: ProviderSlug) => {
    try {
      await fetch('/api/ai/providers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      showToast('Provider disconnected', 'success')
      fetchProviders()
    } catch {
      showToast('Error disconnecting', 'error')
    }
  }

  const setDefault = async (slug: ProviderSlug) => {
    try {
      await fetch('/api/ai/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, apiKey: 'keep-existing', isDefault: true }),
      })
      fetchProviders()
      showToast(`${PROVIDERS[slug].name} set as default`, 'success')
    } catch { /* ignore */ }
  }

  const connectedSlugs = new Set(providers.filter(p => p.isConnected).map(p => p.slug))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[#14EAEA] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === 'success'
            ? 'bg-[#14EAEA]/10 border border-[#14EAEA]/30 text-[#14EAEA]'
            : 'bg-[#F813BE]/10 border border-[#F813BE]/30 text-[#F813BE]'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Provider Cards */}
      {(Object.keys(PROVIDERS) as ProviderSlug[]).map((slug) => {
        const config = PROVIDERS[slug]
        const connected = connectedSlugs.has(slug)
        const connectedProvider = providers.find(p => p.slug === slug)
        const isExpanded = connectingSlug === slug
        const Icon = ICON_MAP[config.icon] || Brain
        const modelCount = connectedProvider?.models && Array.isArray(connectedProvider.models)
          ? connectedProvider.models.length
          : config.models.length

        return (
          <div
            key={slug}
            className={`bg-[#0A0A0A] border rounded-xl overflow-hidden ${
              connected ? 'border-[#14EAEA]/40' : 'border-[#333]'
            }`}
          >
            <div className="px-4 sm:px-5 py-4">
              {/* Provider Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    connected ? 'bg-[#14EAEA]/15' : 'bg-[#1A1A1A]'
                  }`}>
                    <Icon className="w-4.5 h-4.5" style={{ color: connected ? '#14EAEA' : '#666' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{config.name}</h3>
                      {connectedProvider?.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#B9FF33]/15 text-[#B9FF33]">
                          <Star className="w-2.5 h-2.5" /> Default
                        </span>
                      )}
                      {connectedProvider?.authMethod === 'subscription' && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400">
                          Subscription
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#666] mt-0.5">{config.description}</p>
                    {/* Capability badges */}
                    <div className="flex gap-1.5 mt-1.5">
                      {config.supportsText && (
                        <span className="text-[10px] text-[#999] border border-[#333] rounded px-1.5 py-0.5">Text</span>
                      )}
                      {config.supportsImages && (
                        <span className="text-[10px] text-[#999] border border-[#333] rounded px-1.5 py-0.5">Images</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {connected ? (
                    <>
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[#14EAEA]/10 text-[#14EAEA]">
                        <CheckCircle className="w-3 h-3" /> Connected
                      </span>
                      <span className="text-[10px] text-[#666]">{modelCount} models</span>
                      {!connectedProvider?.isDefault && (
                        <button
                          onClick={() => setDefault(slug)}
                          className="p-1.5 rounded-lg text-[#666] hover:text-[#B9FF33] hover:bg-[#1A1A1A] transition-colors"
                          title="Set as default"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => disconnectProvider(slug)}
                        className="p-1.5 rounded-lg text-[#666] hover:text-[#F813BE] hover:bg-[#1A1A1A] transition-colors"
                        title="Disconnect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      {slug === 'ANTHROPIC' && (
                        <button
                          onClick={() => { setSubscriptionMode(true); setConnectingSlug(slug) }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-1.5"
                        >
                          <Zap className="w-3 h-3" /> Use Subscription
                        </button>
                      )}
                      <button
                        onClick={() => { setSubscriptionMode(false); setConnectingSlug(isExpanded ? null : slug) }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#333] text-white hover:border-[#14EAEA] hover:text-[#14EAEA] transition-colors"
                      >
                        {slug === 'ANTHROPIC' ? 'Use API Key' : isExpanded ? 'Cancel' : 'Connect'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded: API Key / Subscription Token Input */}
              {isExpanded && !connected && (
                <div className="mt-4 rounded-lg border border-[#333] bg-[#0F0F0F] p-4">
                  {/* Subscription mode instructions */}
                  {slug === 'ANTHROPIC' && subscriptionMode ? (
                    <>
                      <div className="mb-3 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                        <p className="mb-2 text-sm font-semibold text-purple-300">
                          Connect Your Claude Pro/Max Subscription
                        </p>
                        <ol className="list-inside list-decimal space-y-1.5 text-xs text-purple-300/80">
                          <li>
                            Install Claude Code CLI:{' '}
                            <code className="rounded bg-purple-500/20 px-1.5 py-0.5 font-mono text-[11px]">
                              npm install -g @anthropic-ai/claude-code
                            </code>
                          </li>
                          <li>
                            Run:{' '}
                            <code className="rounded bg-purple-500/20 px-1.5 py-0.5 font-mono text-[11px]">
                              claude setup-token
                            </code>
                          </li>
                          <li>
                            Copy the token (starts with{' '}
                            <code className="rounded bg-purple-500/20 px-1 font-mono text-[11px]">sk-ant-oat01-</code>
                            ) and paste below
                          </li>
                        </ol>
                        <p className="mt-2 text-[11px] text-purple-400/70">
                          Uses your subscription credits — no API billing charges.
                        </p>
                      </div>
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-400/60" />
                        <p className="text-xs text-[#666]">Your token is encrypted and stored securely.</p>
                      </div>
                    </>
                  ) : (
                    <div className="mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#666]" />
                      <p className="text-xs text-[#666]">Your API key is encrypted and stored securely.</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKey[slug] ? 'text' : 'password'}
                        placeholder={
                          slug === 'ANTHROPIC' && subscriptionMode
                            ? 'Paste setup-token (sk-ant-oat01-...)'
                            : `Enter your ${config.name} API key (${config.keyPrefix}...)`
                        }
                        value={apiKeyInputs[slug] || ''}
                        onChange={(e) => setApiKeyInputs(prev => ({ ...prev, [slug]: e.target.value }))}
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#14EAEA] transition-colors pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                        onClick={() => setShowKey(prev => ({ ...prev, [slug]: !prev[slug] }))}
                      >
                        {showKey[slug] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => connectProvider(slug)}
                      disabled={testing === slug || !apiKeyInputs[slug]}
                      className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        slug === 'ANTHROPIC' && subscriptionMode
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-[#14EAEA] text-[#0A0A0A] hover:bg-[#14EAEA]/90'
                      }`}
                    >
                      {testing === slug ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Testing...</>
                      ) : (
                        'Test & Save'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Models info when connected */}
              {connected && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {config.models.map((model) => (
                    <span
                      key={model.id}
                      className="text-[10px] text-[#666] border border-[#222] rounded px-1.5 py-0.5"
                    >
                      {model.name}
                      {model.type === 'text'
                        ? ` ($${model.inputCostPer1M}/$${model.outputCostPer1M} per 1M)`
                        : model.imageCost
                          ? ` ($${model.imageCost}/image)`
                          : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* No providers connected CTA */}
      {providers.filter(p => p.isConnected).length === 0 && (
        <div className="border-2 border-dashed border-[#333] rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#14EAEA]/10 mb-3">
            <Brain className="w-6 h-6 text-[#14EAEA]" />
          </div>
          <h3 className="text-white font-semibold mb-1">No AI Providers Connected</h3>
          <p className="text-[#666] text-sm max-w-md mx-auto">
            Connect your own AI API keys to unlock blog generation, social media content, and more.
            Your keys are encrypted and never shared.
          </p>
        </div>
      )}
    </div>
  )
}

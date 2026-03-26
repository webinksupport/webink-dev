'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  CreditCard,
  Bot,
  Mail,
  BarChart3,
  Search,
  Share2,
  Calculator,
  MessageSquare,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Check,
  Loader2,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────

interface FieldDef {
  key: string
  label: string
  type: 'text' | 'password' | 'select'
  hint?: string
  options?: string[] // for select type
}

interface GroupDef {
  id: string
  title: string
  icon: React.ElementType
  color: string
  fields: FieldDef[]
}

interface SettingState {
  value: string
  isSecret: boolean
  isSet: boolean
}

// ─── Integration Groups ─────────────────────────────────────────────

const GROUPS: GroupDef[] = [
  {
    id: 'stripe',
    title: 'Stripe Payments',
    icon: CreditCard,
    color: '#14EAEA',
    fields: [
      { key: 'STRIPE_TEST_MODE', label: 'Use Stripe Test Mode', type: 'select', options: ['true', 'false'], hint: 'Enable to use test keys instead of live keys' },
      { key: 'STRIPE_TEST_PUBLISHABLE_KEY', label: 'Test Publishable Key', type: 'text', hint: 'pk_test_...' },
      { key: 'STRIPE_TEST_SECRET_KEY', label: 'Test Secret Key', type: 'password', hint: 'sk_test_...' },
      { key: 'STRIPE_PUBLISHABLE_KEY', label: 'Live Publishable Key', type: 'password', hint: 'pk_live_...' },
      { key: 'STRIPE_SECRET_KEY', label: 'Live Secret Key', type: 'password', hint: 'sk_live_...' },
      { key: 'STRIPE_WEBHOOK_SECRET', label: 'Webhook Secret', type: 'password', hint: 'whsec_...' },
    ],
  },
  {
    id: 'ai',
    title: 'AI — Text & Image Generation',
    icon: Bot,
    color: '#B9FF33',
    fields: [
      { key: 'ANTHROPIC_API_KEY', label: 'Anthropic Claude API Key', type: 'password', hint: 'Primary AI for content & emails' },
      { key: 'OPENAI_API_KEY', label: 'OpenAI API Key', type: 'password', hint: 'GPT + Whisper' },
      { key: 'GOOGLE_GEMINI_API_KEY', label: 'Google Gemini API Key', type: 'password', hint: 'Imagen 4 image generation' },
      { key: 'GROK_API_KEY', label: 'Grok API Key by xAI', type: 'password', hint: 'Alternative LLM' },
      { key: 'TOGETHER_AI_API_KEY', label: 'Together AI API Key', type: 'password', hint: 'FLUX image generation' },
    ],
  },
  {
    id: 'email',
    title: 'Email Delivery',
    icon: Mail,
    color: '#F813BE',
    fields: [
      { key: 'RESEND_API_KEY', label: 'Resend API Key', type: 'password', hint: 'Preferred transactional email' },
      { key: 'POSTMARK_API_KEY', label: 'Postmark API Key', type: 'password', hint: 'Alternative email provider' },
      { key: 'SMTP_HOST', label: 'SMTP Host', type: 'text', hint: 'e.g. smtp.gmail.com' },
      { key: 'SMTP_PORT', label: 'SMTP Port', type: 'text', hint: 'e.g. 587' },
      { key: 'SMTP_USERNAME', label: 'SMTP Username', type: 'text' },
      { key: 'SMTP_PASSWORD', label: 'SMTP Password', type: 'password' },
      { key: 'EMAIL_FROM_NAME', label: 'From Name', type: 'text', hint: 'e.g. Webink Solutions' },
      { key: 'EMAIL_FROM_ADDRESS', label: 'From Email', type: 'text', hint: 'e.g. hello@webink.solutions' },
      { key: 'NOTIFICATION_EMAILS', label: 'Notification Recipients', type: 'text', hint: 'Comma-separated emails for order/subscription alerts (e.g. sean@webink.solutions)' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Tracking',
    icon: BarChart3,
    color: '#14EAEA',
    fields: [
      { key: 'GA4_MEASUREMENT_ID', label: 'Google Analytics GA4 Measurement ID', type: 'text', hint: 'G-XXXXXXXXXX' },
      { key: 'FACEBOOK_PIXEL_ID', label: 'Facebook Pixel ID', type: 'text' },
      { key: 'GTM_ID', label: 'Google Tag Manager ID', type: 'text', hint: 'GTM-XXXXXXX' },
    ],
  },
  {
    id: 'seo',
    title: 'SEO Tools',
    icon: Search,
    color: '#B9FF33',
    fields: [
      { key: 'SEARCHATLAS_API_KEY', label: 'SearchAtlas API Key', type: 'password' },
      { key: 'GOOGLE_SEARCH_CONSOLE_VERIFICATION', label: 'Google Search Console Verification Code', type: 'text' },
      { key: 'GOOGLE_PLACES_API_KEY', label: 'Google Places API Key', type: 'password' },
    ],
  },
  {
    id: 'social',
    title: 'Social Media',
    icon: Share2,
    color: '#F813BE',
    fields: [
      { key: 'META_SYSTEM_USER_TOKEN', label: 'Meta System User Token', type: 'password' },
      { key: 'GOOGLE_ADS_CUSTOMER_ID', label: 'Google Ads Customer ID', type: 'text' },
      { key: 'LINKEDIN_API_KEY', label: 'LinkedIn API Key', type: 'password' },
    ],
  },
  {
    id: 'accounting',
    title: 'Accounting',
    icon: Calculator,
    color: '#14EAEA',
    fields: [
      { key: 'QBO_CLIENT_ID', label: 'QuickBooks Client ID', type: 'text' },
      { key: 'QBO_CLIENT_SECRET', label: 'QuickBooks Client Secret', type: 'password' },
      { key: 'QBO_REALM_ID', label: 'QuickBooks Realm ID', type: 'text' },
      { key: 'QBO_ENVIRONMENT', label: 'QuickBooks Environment', type: 'select', options: ['sandbox', 'production'] },
    ],
  },
  {
    id: 'crm',
    title: 'CRM & Communications',
    icon: MessageSquare,
    color: '#F813BE',
    fields: [
      { key: 'TWILIO_ACCOUNT_SID', label: 'Twilio Account SID', type: 'text' },
      { key: 'TWILIO_AUTH_TOKEN', label: 'Twilio Auth Token', type: 'password' },
      { key: 'TWILIO_PHONE_NUMBER', label: 'Twilio Phone Number', type: 'text', hint: 'e.g. +19418401381' },
    ],
  },
]

// ─── Component ───────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [settings, setSettings] = useState<Record<string, SettingState>>({})
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setSettings(data.settings)
      // Initialize edit values — empty for secrets (user must re-enter), current value for non-secrets
      const edits: Record<string, string> = {}
      for (const [key, s] of Object.entries(data.settings) as [string, SettingState][]) {
        edits[key] = s.isSecret ? '' : (s.isSet ? s.value : '')
      }
      setEditValues(edits)
    } catch {
      setToast({ message: 'Failed to load settings', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const saveGroup = async (group: GroupDef) => {
    setSaving((prev) => ({ ...prev, [group.id]: true }))
    try {
      // Only save fields that have a non-empty value entered
      const fieldsToSave = group.fields.filter((f) => editValues[f.key]?.trim())
      if (fieldsToSave.length === 0) {
        setToast({ message: 'No changes to save', type: 'error' })
        return
      }

      for (const field of fieldsToSave) {
        const res = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: field.key, value: editValues[field.key].trim() }),
        })
        if (!res.ok) throw new Error(`Failed to save ${field.label}`)
      }

      setToast({ message: `${group.title} saved successfully`, type: 'success' })
      // Re-fetch to update status indicators
      await fetchSettings()
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Save failed', type: 'error' })
    } finally {
      setSaving((prev) => ({ ...prev, [group.id]: false }))
    }
  }

  const toggleReveal = (key: string) => {
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[#14EAEA] animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-2">
          Settings
        </p>
        <h1 className="text-3xl font-bold text-white mb-4">Integrations</h1>
        <p className="text-[#999] text-sm max-w-2xl">
          Manage API keys and credentials for all third-party services. Changes take effect
          immediately — no restart needed.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 bg-[#1A1A1A] border border-[#F813BE]/30 rounded-xl p-4 mb-8">
        <AlertTriangle className="w-5 h-5 text-[#F813BE] shrink-0 mt-0.5" />
        <p className="text-[#999] text-sm">
          API keys are encrypted in the database. Never share these with anyone.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all ${
            toast.type === 'success'
              ? 'bg-[#14EAEA]/10 border border-[#14EAEA]/30 text-[#14EAEA]'
              : 'bg-[#F813BE]/10 border border-[#F813BE]/30 text-[#F813BE]'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Groups */}
      <div className="space-y-8">
        {GROUPS.map((group) => {
          const Icon = group.icon
          return (
            <div key={group.id} className="bg-[#0A0A0A] border border-[#333] rounded-2xl overflow-hidden">
              {/* Group Header */}
              <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[#333]">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${group.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: group.color }} />
                </div>
                <h2 className="text-lg font-bold text-white">{group.title}</h2>
              </div>

              {/* Fields */}
              <div className="p-4 sm:p-6 space-y-5">
                {group.fields.map((field) => {
                  const setting = settings[field.key]
                  const isSet = setting?.isSet ?? false
                  const isPasswordField = field.type === 'password'
                  const isRevealed = revealed[field.key]

                  return (
                    <div key={field.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-white">
                          {field.label}
                        </label>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isSet
                              ? 'bg-[#14EAEA]/10 text-[#14EAEA]'
                              : 'bg-[#333] text-[#666]'
                          }`}
                        >
                          {isSet ? 'Configured' : 'Not set'}
                        </span>
                      </div>

                      <div className="relative">
                        {field.type === 'select' ? (
                          <select
                            value={editValues[field.key] || ''}
                            onChange={(e) =>
                              setEditValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                            }
                            className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#14EAEA] transition-colors appearance-none"
                          >
                            <option value="">Select...</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={isPasswordField && !isRevealed ? 'password' : 'text'}
                            value={editValues[field.key] || ''}
                            onChange={(e) =>
                              setEditValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                            }
                            placeholder={
                              isPasswordField && isSet
                                ? setting.value
                                : field.hint || ''
                            }
                            className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#14EAEA] transition-colors pr-10"
                          />
                        )}

                        {isPasswordField && (
                          <button
                            type="button"
                            onClick={() => toggleReveal(field.key)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                          >
                            {isRevealed ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {field.hint && (
                        <p className="text-xs text-[#666] mt-1">{field.hint}</p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Save Button */}
              <div className="px-4 sm:px-6 py-4 border-t border-[#333] flex flex-wrap gap-3 sm:justify-end">
                <button
                  onClick={() => saveGroup(group)}
                  disabled={saving[group.id]}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#14EAEA] text-[#0A0A0A] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#14EAEA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving[group.id] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save {group.title}
                </button>
                {group.id === 'stripe' && (
                  <button
                    onClick={async () => {
                      setSaving((prev) => ({ ...prev, sync: true }))
                      try {
                        const res = await fetch('/api/admin/products/sync-stripe', { method: 'POST' })
                        if (!res.ok) {
                          const data = await res.json()
                          throw new Error(data.error || 'Sync failed')
                        }
                        const data = await res.json()
                        setToast({ message: data.message || 'Products synced to Stripe', type: 'success' })
                      } catch (err) {
                        setToast({ message: err instanceof Error ? err.message : 'Sync failed', type: 'error' })
                      } finally {
                        setSaving((prev) => ({ ...prev, sync: false }))
                      }
                    }}
                    disabled={saving.sync}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto border border-[#F813BE] text-[#F813BE] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#F813BE]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving.sync ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Sync Products to Stripe
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

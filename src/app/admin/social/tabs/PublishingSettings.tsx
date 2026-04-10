'use client'

import { useState, useEffect } from 'react'
import { Settings, Loader2, CheckCircle, Wifi, WifiOff } from 'lucide-react'

interface ConnectionStatus {
  facebook: boolean
  instagram: boolean
}

export default function PublishingSettings() {
  const [autoPublish, setAutoPublish] = useState(false)
  const [defaultPostTime, setDefaultPostTime] = useState('09:00')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const [analyticsRes, settingsRes] = await Promise.all([
        fetch('/api/social/analytics'),
        fetch('/api/admin/settings'),
      ])

      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        setConnectionStatus({
          facebook: data.connected?.facebook || false,
          instagram: data.connected?.instagram || false,
        })
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json()
        const s = data.settings || {}
        if (s.SOCIAL_AUTO_PUBLISH?.value === 'true') setAutoPublish(true)
        if (s.SOCIAL_DEFAULT_POST_TIME?.value && s.SOCIAL_DEFAULT_POST_TIME.isSet) {
          setDefaultPostTime(s.SOCIAL_DEFAULT_POST_TIME.value)
        }
      }
    } catch { /* fallthrough */ }
    setLoading(false)
  }

  async function saveSetting(key: string, value: string) {
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
  }

  async function saveSettings() {
    setSaving(true)
    setSaved(false)
    try {
      await Promise.all([
        saveSetting('SOCIAL_AUTO_PUBLISH', autoPublish ? 'true' : 'false'),
        saveSetting('SOCIAL_DEFAULT_POST_TIME', defaultPostTime),
      ])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* silent */ }
    setSaving(false)
  }

  async function testConnection() {
    setTestingConnection(true)
    try {
      const res = await fetch('/api/social/analytics')
      if (res.ok) {
        const data = await res.json()
        setConnectionStatus({
          facebook: data.connected?.facebook || false,
          instagram: data.connected?.instagram || false,
        })
      }
    } catch {
      setConnectionStatus({ facebook: false, instagram: false })
    }
    setTestingConnection(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-[#666]">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading settings...
      </div>
    )
  }

  return (
    <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Settings className="w-5 h-5 text-[#14EAEA]" />
        <h2 className="text-white font-semibold">Publishing Settings</h2>
      </div>

      {/* Connection Status */}
      <div className="mb-5 p-4 bg-[#0D0D0D] rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-sm font-medium">Platform Connections</h3>
          <button
            onClick={testConnection}
            disabled={testingConnection}
            className="flex items-center gap-1 text-xs text-[#14EAEA] hover:text-white transition-colors disabled:opacity-50"
          >
            {testingConnection ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
            Test Connection
          </button>
        </div>
        {connectionStatus && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {connectionStatus.facebook ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className={connectionStatus.facebook ? 'text-green-400' : 'text-red-400'}>
                Facebook: {connectionStatus.facebook ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {connectionStatus.instagram ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className={connectionStatus.instagram ? 'text-green-400' : 'text-red-400'}>
                Instagram: {connectionStatus.instagram ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Auto-Publish Toggle */}
      <div className="flex items-center justify-between mb-4 p-3 bg-[#1A1A1A] rounded-lg">
        <div>
          <p className="text-white text-sm font-medium">Auto-Publish Scheduled Posts</p>
          <p className="text-[#666] text-xs mt-0.5">Automatically publish posts when their scheduled time arrives</p>
        </div>
        <button
          onClick={() => setAutoPublish(!autoPublish)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            autoPublish ? 'bg-[#14EAEA]' : 'bg-[#333]'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              autoPublish ? 'translate-x-[22px]' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Default Post Time */}
      <div className="mb-5">
        <label className="text-xs text-[#666] block mb-1.5">Default Post Time</label>
        <input
          type="time"
          value={defaultPostTime}
          onChange={(e) => setDefaultPostTime(e.target.value)}
          className="bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#14EAEA]"
        />
        <p className="text-[#555] text-xs mt-1">Used when scheduling posts without a specific time</p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-[#14EAEA] hover:bg-[#11cccc] text-[#0A0A0A] px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
          Save Settings
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> Saved!
          </span>
        )}
      </div>

      {/* Cron info */}
      <div className="mt-5 p-3 bg-[#0D0D0D] rounded-lg">
        <p className="text-[#666] text-xs">
          <strong className="text-[#888]">Cron endpoint:</strong>{' '}
          <code className="text-[#14EAEA]">GET /api/cron/social-auto-post</code>
        </p>
        <p className="text-[#555] text-xs mt-1">
          Set up an external cron job to call this endpoint with <code>Authorization: Bearer CRON_SECRET</code> header.
        </p>
      </div>
    </div>
  )
}

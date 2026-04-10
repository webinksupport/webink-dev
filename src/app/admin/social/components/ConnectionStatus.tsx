'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle, AlertTriangle, XCircle, Circle, ExternalLink, Loader2,
  RefreshCw, Plus, ChevronDown, ChevronUp,
} from 'lucide-react'

interface Connection {
  id: string
  clientId: string
  platform: string
  platformAccountId: string | null
  accessToken: string | null
  status: string
  connectionMethod: string
  lastVerifiedAt: string | null
  lastError: string | null
  tokenExpiresAt: string | null
}

interface ConnectionStatusProps {
  clientId: string | null
}

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', color: '#1877F2', idLabel: 'Page ID' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F', idLabel: 'Account ID' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', idLabel: 'Organization ID' },
]

function StatusIcon({ status }: { status: string }) {
  if (status === 'active') return <CheckCircle className="w-4 h-4 text-green-400" />
  if (status === 'expired') return <AlertTriangle className="w-4 h-4 text-yellow-400" />
  if (status === 'error') return <XCircle className="w-4 h-4 text-red-400" />
  return <Circle className="w-4 h-4 text-[#444]" />
}

function StatusLabel({ status }: { status: string }) {
  if (status === 'active') return <span className="text-green-400 text-xs">Connected</span>
  if (status === 'expired') return <span className="text-yellow-400 text-xs">Token Expired</span>
  if (status === 'error') return <span className="text-red-400 text-xs">Error</span>
  return <span className="text-[#555] text-xs">Not Connected</span>
}

export default function ConnectionStatus({ clientId }: ConnectionStatusProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [setupPlatform, setSetupPlatform] = useState<string | null>(null)
  const [setupAccountId, setSetupAccountId] = useState('')
  const [setupToken, setSetupToken] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchConnections()
  }, [clientId])

  async function fetchConnections() {
    setLoading(true)
    try {
      const url = clientId
        ? `/api/social/connections?clientId=${clientId}`
        : '/api/social/connections'
      const res = await fetch(url)
      if (res.ok) setConnections(await res.json())
    } catch {}
    setLoading(false)
  }

  function getConnection(platform: string): Connection | undefined {
    return connections.find((c) => c.platform === platform && (!clientId || c.clientId === clientId))
  }

  async function saveConnection() {
    if (!setupPlatform || !clientId) return
    setSaving(true)
    try {
      const res = await fetch('/api/social/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          platform: setupPlatform,
          platformAccountId: setupAccountId || null,
          accessToken: setupToken || null,
        }),
      })
      if (res.ok) {
        await fetchConnections()
        setSetupPlatform(null)
        setSetupAccountId('')
        setSetupToken('')
      }
    } catch {}
    setSaving(false)
  }

  const activeCount = PLATFORMS.filter((p) => getConnection(p.id)?.status === 'active').length

  return (
    <div className="bg-[#141414] border border-[#282828] rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1A1A1A] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#888] text-xs font-medium">Connections</span>
          <div className="flex items-center gap-1.5">
            {PLATFORMS.map((p) => {
              const conn = getConnection(p.id)
              return (
                <div
                  key={p.id}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: conn?.status === 'active' ? '#4ade80'
                      : conn?.status === 'expired' ? '#facc15'
                      : '#333',
                  }}
                  title={`${p.label}: ${conn?.status || 'not connected'}`}
                />
              )
            })}
          </div>
          <span className="text-[#555] text-[10px]">{activeCount}/{PLATFORMS.length} connected</span>
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[#555]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#555]" />}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-[#222] px-4 py-3 space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-[#555] text-sm py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading connections...
            </div>
          ) : (
            <>
              {PLATFORMS.map((platform) => {
                const conn = getConnection(platform.id)
                return (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon status={conn?.status || 'pending_setup'} />
                      <div>
                        <span className="text-white text-sm font-medium">{platform.label}</span>
                        {conn?.platformAccountId && (
                          <span className="text-[#555] text-xs ml-2">ID: {conn.platformAccountId}</span>
                        )}
                        <div>
                          <StatusLabel status={conn?.status || 'pending_setup'} />
                          {conn?.lastError && (
                            <span className="text-red-400/60 text-[10px] ml-2">{conn.lastError}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {conn?.status === 'active' && (
                        <button
                          onClick={() => fetchConnections()}
                          className="text-[#555] hover:text-white transition-colors"
                          title="Refresh"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSetupPlatform(platform.id)
                          setSetupAccountId(conn?.platformAccountId || '')
                          setSetupToken('')
                        }}
                        className="text-[#14EAEA] hover:text-white text-xs flex items-center gap-1 transition-colors"
                      >
                        {conn?.status === 'active' ? 'Update' : 'Connect'}
                        {!conn?.status || conn.status === 'pending_setup' ? <Plus className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Setup form */}
              {setupPlatform && clientId && (
                <div className="mt-3 p-4 bg-[#0F0F0F] border border-[#333] rounded-xl space-y-3">
                  <h4 className="text-white text-sm font-medium">
                    Connect {PLATFORMS.find((p) => p.id === setupPlatform)?.label}
                  </h4>
                  <p className="text-[#666] text-xs leading-relaxed">
                    Paste your access token and account ID. For Meta platforms, get these from the
                    {' '}<span className="text-[#14EAEA]">Graph API Explorer</span> or Business Manager.
                  </p>
                  <div>
                    <label className="text-[#888] text-xs block mb-1">
                      {PLATFORMS.find((p) => p.id === setupPlatform)?.idLabel || 'Account ID'}
                    </label>
                    <input
                      type="text"
                      value={setupAccountId}
                      onChange={(e) => setSetupAccountId(e.target.value)}
                      placeholder="e.g., 17841450255505752"
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:border-[#14EAEA] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#888] text-xs block mb-1">Access Token</label>
                    <input
                      type="password"
                      value={setupToken}
                      onChange={(e) => setSetupToken(e.target.value)}
                      placeholder="Paste token here..."
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:border-[#14EAEA] focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveConnection}
                      disabled={saving}
                      className="px-4 py-2 bg-[#14EAEA] text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-[#14EAEA]/80 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save & Verify'}
                    </button>
                    <button
                      onClick={() => { setSetupPlatform(null); setSetupAccountId(''); setSetupToken('') }}
                      className="px-4 py-2 text-[#888] text-sm hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!clientId && (
                <p className="text-[#555] text-xs py-1">
                  Select a client to manage platform connections, or use system-level credentials in Settings.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

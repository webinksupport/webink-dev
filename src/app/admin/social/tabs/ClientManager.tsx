'use client'

import { useState, useEffect } from 'react'
import {
  Users, Plus, Trash2, Edit3, Loader2, CheckCircle, XCircle,
  ToggleLeft, ToggleRight, Mail, X,
} from 'lucide-react'

interface Client {
  id: string
  name: string
  instagramHandle: string | null
  facebookPageId: string | null
  accessToken: string | null
  brandProfileId: string | null
  status: string
  createdAt: string
}

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [facebookPageId, setFacebookPageId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    setLoading(true)
    try {
      const res = await fetch('/api/social/clients')
      if (res.ok) setClients(await res.json())
    } catch {}
    setLoading(false)
  }

  function resetForm() {
    setName('')
    setInstagramHandle('')
    setFacebookPageId('')
    setAccessToken('')
    setInviteEmail('')
    setEditingId(null)
    setShowForm(false)
  }

  function editClient(client: Client) {
    setName(client.name)
    setInstagramHandle(client.instagramHandle || '')
    setFacebookPageId(client.facebookPageId || '')
    setAccessToken(client.accessToken || '')
    setInviteEmail('')
    setEditingId(client.id)
    setShowForm(true)
  }

  async function saveClient() {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await fetch(`/api/social/clients/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, instagramHandle, facebookPageId, accessToken }),
        })
      } else {
        await fetch('/api/social/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, instagramHandle, facebookPageId, accessToken, inviteEmail }),
        })
      }
      resetForm()
      fetchClients()
    } catch {}
    setSaving(false)
  }

  async function toggleStatus(client: Client) {
    const newStatus = client.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await fetch(`/api/social/clients/${client.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchClients()
  }

  async function deleteClient(id: string) {
    await fetch(`/api/social/clients/${id}`, { method: 'DELETE' })
    fetchClients()
  }

  function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-[#1A1A1A] rounded ${className}`} />
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-[#F813BE]" />
            Client Manager
          </h2>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-1.5 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Client
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-sm font-medium">
                {editingId ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button onClick={resetForm} className="text-[#666] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-[#666] block mb-1">Client Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                />
              </div>
              <div>
                <label className="text-xs text-[#666] block mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@acmecorp"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                />
              </div>
              <div>
                <label className="text-xs text-[#666] block mb-1">Facebook Page ID</label>
                <input
                  type="text"
                  value={facebookPageId}
                  onChange={(e) => setFacebookPageId(e.target.value)}
                  placeholder="123456789"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                />
              </div>
              <div>
                <label className="text-xs text-[#666] block mb-1">Access Token</label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Meta API access token"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                />
              </div>
              {!editingId && (
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#666] block mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Invite Email (optional)
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveClient}
                disabled={saving || !name.trim()}
                className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {editingId ? 'Update Client' : 'Create Client'}
              </button>
              <button
                onClick={resetForm}
                className="text-[#666] hover:text-white px-4 py-2 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Client List */}
        {clients.length === 0 ? (
          <div className="text-center py-12 text-[#444]">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No clients yet</p>
            <p className="text-xs text-[#333] mt-1">Add your first client to manage their social media</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className={`bg-[#1A1A1A] border rounded-xl p-4 transition-colors ${
                  client.status === 'ACTIVE' ? 'border-[#333] hover:border-[#F813BE]/30' : 'border-[#222] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white text-sm font-medium">{client.name}</p>
                    {client.instagramHandle && (
                      <p className="text-[#666] text-xs mt-0.5">@{client.instagramHandle}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      client.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                {client.facebookPageId && (
                  <p className="text-[#555] text-xs mb-3">FB: {client.facebookPageId}</p>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-[#222]">
                  <button
                    onClick={() => toggleStatus(client)}
                    className="flex items-center gap-1 text-xs text-[#666] hover:text-white transition-colors"
                    title={client.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  >
                    {client.status === 'ACTIVE' ? (
                      <ToggleRight className="w-4 h-4 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => editClient(client)}
                    className="flex items-center gap-1 text-xs text-[#666] hover:text-[#14EAEA] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="flex items-center gap-1 text-xs text-[#555] hover:text-red-400 transition-colors ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

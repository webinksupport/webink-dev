'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to update profile')
      } else {
        setMessage('Profile updated')
        await update()
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to update password')
      } else {
        setMessage('Password updated')
        setCurrentPassword('')
        setNewPassword('')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
      <p className="text-[#999] mb-8">Manage your account details</p>

      {message && (
        <div className="bg-[#14EAEA]/10 border border-[#14EAEA]/30 text-[#14EAEA] rounded-lg p-3 mb-6 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Profile */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
              Email
            </label>
            <input
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="w-full bg-[#0F0F0F] border border-[#333] text-[#999] rounded-lg px-4 py-3 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#F813BE] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#d10fa3] transition-colors text-sm disabled:opacity-50"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors"
              placeholder="Min. 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#F813BE] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#d10fa3] transition-colors text-sm disabled:opacity-50"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

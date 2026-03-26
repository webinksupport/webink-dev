'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [phone, setPhone] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
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

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to update password')
      } else {
        setMessage('Password updated')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)

    try {
      const res = await fetch('/api/user/account', { method: 'DELETE' })
      if (res.ok) {
        signOut({ callbackUrl: '/' })
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to delete account')
        setDeleting(false)
      }
    } catch {
      setError('Something went wrong')
      setDeleting(false)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(941) 555-0123"
                className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-[#666]"
              />
            </div>
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
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors"
                placeholder="Re-enter new password"
              />
            </div>
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

      {/* Email Preferences */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Email Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white text-sm font-semibold">Billing receipts</p>
              <p className="text-[#999] text-xs">Receive email receipts for payments</p>
            </div>
            <div className="w-10 h-6 bg-[#14EAEA] rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white text-sm font-semibold">Service updates</p>
              <p className="text-[#999] text-xs">Get notified about changes to your services</p>
            </div>
            <div className="w-10 h-6 bg-[#14EAEA] rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white text-sm font-semibold">Marketing & tips</p>
              <p className="text-[#999] text-xs">Digital marketing tips and product news</p>
            </div>
            <div className="w-10 h-6 bg-[#333] rounded-full relative">
              <div className="w-4 h-4 bg-[#999] rounded-full absolute top-1 left-1" />
            </div>
          </label>
        </div>
        <p className="text-[#666] text-xs mt-4">
          Email preference management is handled through your Stripe billing portal.
        </p>
      </div>

      {/* Delete Account */}
      <div className="bg-[#1A1A1A] border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-bold text-white">Danger Zone</h2>
        </div>
        <p className="text-[#999] text-sm mb-4">
          Deleting your account will cancel all active subscriptions and permanently remove your data.
          This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-sm text-red-400 border border-red-400/30 px-6 py-2 rounded-full hover:bg-red-400/10 transition-colors"
        >
          Delete My Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold text-white">Delete Account</h3>
            </div>
            <p className="text-[#999] text-sm mb-4">
              This will permanently delete your account, cancel all subscriptions,
              and remove all associated data. This cannot be undone.
            </p>
            <p className="text-white text-sm mb-2">
              Type <span className="font-bold text-red-400">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-400 transition-colors mb-4"
              placeholder="Type DELETE"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleting}
                className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-full hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirm('')
                }}
                className="flex-1 text-[#999] border border-[#333] font-semibold py-2 rounded-full hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 font-urbanist">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]" />
        <div className="relative w-full max-w-md text-center">
          <div className="bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
            <p className="text-white/40 text-sm mb-6">This link is missing a reset token. Please request a new password reset.</p>
            <Link href="/auth/forgot-password" className="inline-block bg-[#F813BE] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#d10fa3] transition-colors text-sm">
              Request New Reset
            </Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong.')
        setLoading(false)
        return
      }

      setSuccess(true)
      // Redirect to sign-in after 3 seconds
      setTimeout(() => router.push('/auth/signin'), 3000)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 font-urbanist">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#14EAEA]/[0.03] blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/images/logos/webink-white.png"
              alt="Webink Solutions"
              width={180}
              height={48}
              className="mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
            {success ? 'Password Reset!' : 'Set New Password'}
          </h1>
          <p className="text-white/40 text-sm">
            {success ? 'Redirecting you to sign in...' : 'Enter your new password below.'}
          </p>
        </div>

        {success ? (
          <div className="bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white/60 text-sm mb-6">
              Your password has been reset successfully. You&apos;ll be redirected to sign in momentarily.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block text-[#14EAEA] text-sm hover:text-[#14EAEA]/80 transition-colors"
            >
              Sign In Now &rarr;
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 shadow-2xl"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-6 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="password" className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-white/20"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-white/20"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F813BE] text-white font-semibold py-3.5 rounded-full hover:bg-[#d10fa3] transition-colors duration-200 disabled:opacity-50 text-sm tracking-wide"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <p className="text-center mt-6">
              <Link
                href="/auth/forgot-password"
                className="text-white/30 text-sm hover:text-white/50 transition-colors"
              >
                Need a new reset link?
              </Link>
            </p>
          </form>
        )}

        <p className="text-center text-white/20 text-xs mt-6">
          <Link href="/" className="hover:text-white/40 transition-colors">&larr; Back to Webink Solutions</Link>
        </p>
      </div>
    </div>
  )
}

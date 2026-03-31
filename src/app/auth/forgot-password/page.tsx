'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setError('Too many requests. Please wait a while before trying again.')
        setLoading(false)
        return
      }

      if (!res.ok) {
        setError(data.message || 'Something went wrong.')
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 font-urbanist">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#14EAEA]/[0.03] blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
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
            {submitted ? 'Check Your Email' : 'Forgot Password'}
          </h1>
          <p className="text-white/40 text-sm">
            {submitted
              ? 'We sent a reset link if that email is registered.'
              : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#14EAEA]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#14EAEA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/60 text-sm mb-6">
              If an account with <span className="text-white font-medium">{email}</span> exists,
              you&apos;ll receive an email with a password reset link. Check your inbox (and spam folder).
            </p>
            <p className="text-white/30 text-xs mb-6">
              The link expires in 1 hour.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block text-[#14EAEA] text-sm hover:text-[#14EAEA]/80 transition-colors"
            >
              &larr; Back to Sign In
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

            <div className="mb-6">
              <label htmlFor="email" className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-white/20"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F813BE] text-white font-semibold py-3.5 rounded-full hover:bg-[#d10fa3] transition-colors duration-200 disabled:opacity-50 text-sm tracking-wide"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center mt-6">
              <Link
                href="/auth/signin"
                className="text-white/30 text-sm hover:text-white/50 transition-colors"
              >
                &larr; Back to Sign In
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

'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password')
      return
    }

    if (callbackUrl) {
      router.push(callbackUrl)
      return
    }

    const res = await fetch('/api/auth/session')
    const session = await res.json()
    const role = session?.user?.role

    if (role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
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
              data-page="global" data-block="auth_logo"
              src="/images/logos/webink-white.png"
              alt="Webink Solutions"
              width={180}
              height={48}
              className="mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
            Welcome Back
          </h1>
          <p className="text-white/40 text-sm">Sign in to your Webink account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-6 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="email" className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
              Email
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

          <div className="mb-2">
            <label htmlFor="password" className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-white/20"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-end mb-6">
            <Link
              href="/auth/forgot-password"
              className="text-[#14EAEA] text-xs hover:text-[#14EAEA]/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F813BE] text-white font-semibold py-3.5 rounded-full hover:bg-[#d10fa3] transition-colors duration-200 disabled:opacity-50 text-sm tracking-wide"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-white/30 text-[11px] mt-6">
            Need to create an account? Accounts are created during checkout.
          </p>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          <Link href="/" className="hover:text-white/40 transition-colors">&larr; Back to Webink Solutions</Link>
        </p>
      </div>
    </div>
  )
}

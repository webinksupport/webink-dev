'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function CheckoutAuthClient() {
  return (
    <Suspense>
      <CheckoutAuthForm />
    </Suspense>
  )
}

function CheckoutAuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const productName = searchParams.get('product') || ''
  const priceLabel = searchParams.get('price') || ''

  // Sign in state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInError, setSignInError] = useState('')
  const [signInLoading, setSignInLoading] = useState(false)
  const [showSignInPassword, setShowSignInPassword] = useState(false)

  // Register state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setSignInError('')
    setSignInLoading(true)

    const result = await signIn('credentials', {
      email: signInEmail,
      password: signInPassword,
      redirect: false,
    })

    setSignInLoading(false)

    if (result?.error) {
      setSignInError('Invalid email or password')
      return
    }

    router.push(callbackUrl)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegError('')

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match')
      return
    }

    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters')
      return
    }

    setRegLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regEmail, password: regPassword, name: regName }),
    })

    if (!res.ok) {
      const data = await res.json()
      setRegError(data.error || 'Registration failed')
      setRegLoading(false)
      return
    }

    // Auto sign-in after registration
    const result = await signIn('credentials', {
      email: regEmail,
      password: regPassword,
      redirect: false,
    })

    setRegLoading(false)

    if (result?.error) {
      setRegError('Account created but sign-in failed. Please try signing in.')
      return
    }

    router.push(callbackUrl)
  }

  const inputClass =
    'w-full bg-[#0A0A0A] border border-[#333] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-white/20 text-sm'
  const labelClass =
    'block text-[10px] font-bold tracking-[2px] uppercase text-white/40 mb-1.5'

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12 font-urbanist">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#14EAEA]/[0.02] blur-[150px]" />

      <div className="relative w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-5">
            <Image
              src="/images/logos/webink-white.png"
              alt="Webink Solutions"
              width={160}
              height={42}
              className="mx-auto"
            />
          </Link>

          <h1
            className="font-urbanist font-black text-white mb-2"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.03em' }}
          >
            Almost there! Sign in to continue
          </h1>
          <p className="text-white/35 text-sm">
            Sign in or create an account to complete your purchase
          </p>
        </div>

        {/* Order summary banner */}
        {productName && (
          <div className="bg-[#111111] border border-[#14EAEA]/20 rounded-2xl px-6 py-4 mb-8 flex items-center gap-4 max-w-lg mx-auto">
            <div className="w-10 h-10 rounded-full bg-[#14EAEA]/10 flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={18} className="text-[#14EAEA]" />
            </div>
            <div className="min-w-0">
              <p className="font-urbanist font-bold text-white text-sm truncate">
                {productName}
              </p>
              {priceLabel && (
                <p className="font-urbanist text-[#14EAEA] text-xs font-bold mt-0.5">
                  {priceLabel}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Two-column auth forms */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* ── LEFT: Returning Customer ─────────────────── */}
          <div className="bg-[#0F0F0F] rounded-2xl p-7 border border-white/10 shadow-2xl">
            <div className="mb-6">
              <h2 className="font-urbanist font-bold text-white text-lg mb-1">
                Returning Customer
              </h2>
              <p className="font-urbanist text-white/30 text-xs">
                Sign in with your existing account
              </p>
            </div>

            <form onSubmit={handleSignIn}>
              {signInError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-5 text-xs flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {signInError}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="signin-email" className={labelClass}>Email</label>
                <input
                  id="signin-email"
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="signin-password" className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    className={`${inputClass} pr-10`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                  >
                    {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={signInLoading}
                className="w-full bg-[#14EAEA] text-[#0A0A0A] font-bold py-3.5 rounded-full hover:bg-white transition-colors duration-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {signInLoading ? (
                  'Signing in...'
                ) : (
                  <>Sign In & Continue <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          </div>

          {/* ── RIGHT: New Customer ──────────────────────── */}
          <div className="bg-[#0F0F0F] rounded-2xl p-7 border border-white/10 shadow-2xl">
            <div className="mb-6">
              <h2 className="font-urbanist font-bold text-white text-lg mb-1">
                New Customer
              </h2>
              <p className="font-urbanist text-white/30 text-xs">
                Create an account to get started
              </p>
            </div>

            <form onSubmit={handleRegister}>
              {regError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-5 text-xs flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {regError}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="reg-name" className={labelClass}>Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="reg-email" className={labelClass}>Email</label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="reg-password" className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className={`${inputClass} pr-10`}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="reg-confirm" className={labelClass}>Confirm Password</label>
                <input
                  id="reg-confirm"
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full bg-[#F813BE] text-white font-bold py-3.5 rounded-full hover:bg-[#d10fa3] transition-colors duration-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {regLoading ? (
                  'Creating account...'
                ) : (
                  <>Create Account & Continue <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center text-white/20 text-xs mt-8">
          <Link href="/" className="hover:text-white/40 transition-colors">
            ← Back to Webink Solutions
          </Link>
        </p>
      </div>
    </div>
  )
}

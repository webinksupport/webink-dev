'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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

    // If there's an explicit callbackUrl, use it
    if (callbackUrl) {
      router.push(callbackUrl)
      return
    }

    // Otherwise, fetch session to route by role
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
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-[#999]">Access your Webink account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#333]"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F813BE] text-white font-semibold py-3 rounded-full hover:bg-[#d10fa3] transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-[#999] text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-[#14EAEA] hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

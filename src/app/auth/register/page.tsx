'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to homepage after a short delay
    const timer = setTimeout(() => {
      router.push('/')
    }, 4000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 font-urbanist">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]" />

      <div className="relative w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <Image
            data-page="global" data-block="auth_logo"
            src="/images/logos/webink-white.png"
            alt="Webink Solutions"
            width={180}
            height={48}
            className="mx-auto"
          />
        </Link>

        <div className="bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h1
            className="text-2xl font-black text-white mb-3"
            style={{ letterSpacing: '-0.03em' }}
          >
            Accounts are created during checkout
          </h1>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            To create an account, browse our services and start a purchase.
            Your account will be created automatically during checkout.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-bold text-sm px-8 py-3.5 rounded-full hover:bg-white transition-colors duration-200"
          >
            Browse Services &rarr;
          </Link>
        </div>

        <p className="text-white/25 text-xs mt-6">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-[#14EAEA] hover:underline font-semibold">
            Sign in
          </Link>
        </p>

        <p className="text-white/15 text-[10px] mt-4">
          Redirecting to homepage...
        </p>
      </div>
    </div>
  )
}

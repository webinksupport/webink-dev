'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Mail, Clock, UserCheck, Package } from 'lucide-react'

interface SessionData {
  customerEmail: string | null
  amountTotal: number | null
  currency: string | null
  productName: string | null
  interval: string | null
  metadata: Record<string, string> | null
}

function formatAmount(cents: number | null, currency: string | null): string {
  if (cents === null) return ''
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'usd',
  }).format(dollars)
}

export default function SuccessContent({ sessionId }: { sessionId?: string }) {
  const [session, setSession] = useState<SessionData | null>(null)

  useEffect(() => {
    if (!sessionId) return
    fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setSession(data) })
      .catch(() => {})
  }, [sessionId])

  const billingLabel = session?.interval === 'year' ? 'Annual' : session?.interval === 'month' ? 'Monthly' : 'One-time'

  return (
    <section className="pt-40 pb-20 lg:pb-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#14EAEA]/10 border border-[#14EAEA]/20 mb-8">
          <CheckCircle2 size={40} className="text-[#14EAEA]" />
        </div>

        <h1
          className="font-urbanist font-black text-white mb-3 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.04em' }}
        >
          Thank you for your purchase!
        </h1>

        <p className="font-urbanist text-white/50 text-lg leading-relaxed mb-10 max-w-md mx-auto">
          Your order has been confirmed. Welcome to Webink Solutions.
        </p>

        {/* Order summary card */}
        {session && (
          <div className="bg-[#111111] rounded-2xl border border-[#14EAEA]/20 p-6 text-left mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Package size={16} className="text-[#14EAEA]" />
              <h2 className="font-urbanist font-bold text-white text-sm">Order Details</h2>
            </div>
            <div className="space-y-3">
              {session.productName && (
                <div className="flex justify-between">
                  <span className="font-urbanist text-sm text-white/50">Plan</span>
                  <span className="font-urbanist text-sm text-white/80 font-medium">{session.productName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-urbanist text-sm text-white/50">Billing</span>
                <span className="font-urbanist text-sm text-white/80 font-medium">{billingLabel}</span>
              </div>
              <div className="border-t border-white/8 pt-3 flex justify-between">
                <span className="font-urbanist font-bold text-white text-sm">Amount paid</span>
                <span className="font-urbanist font-bold text-[#14EAEA] text-sm">
                  {formatAmount(session.amountTotal, session.currency)}
                </span>
              </div>
              {session.customerEmail && (
                <div className="flex justify-between">
                  <span className="font-urbanist text-sm text-white/50">Receipt sent to</span>
                  <span className="font-urbanist text-sm text-white/60">{session.customerEmail}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What happens next */}
        <div className="bg-[#111111] rounded-2xl border border-white/8 p-8 text-left mb-10">
          <h2 className="font-urbanist font-bold text-white text-lg mb-6">
            What Happens Next
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#14EAEA]/10 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-[#14EAEA]" />
              </div>
              <div>
                <p className="font-urbanist font-bold text-white/80 text-sm mb-1">
                  Check your email
                </p>
                <p className="font-urbanist text-white/40 text-sm leading-relaxed">
                  A confirmation email with your receipt is on its way. Check your inbox (and spam folder) for details.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F813BE]/10 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-[#F813BE]" />
              </div>
              <div>
                <p className="font-urbanist font-bold text-white/80 text-sm mb-1">
                  We will contact you within 24 hours
                </p>
                <p className="font-urbanist text-white/40 text-sm leading-relaxed">
                  Our team will reach out to begin onboarding and get everything set up for you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#B9FF33]/10 flex items-center justify-center flex-shrink-0">
                <UserCheck size={16} className="text-[#B9FF33]" />
              </div>
              <div>
                <p className="font-urbanist font-bold text-white/80 text-sm mb-1">
                  Your account is already active
                </p>
                <p className="font-urbanist text-white/40 text-sm leading-relaxed">
                  Log in to your dashboard to view your subscription, download invoices, and manage your plan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-urbanist font-bold text-sm px-8 py-4 rounded-full hover:bg-white transition-colors duration-200"
          >
            Go to My Dashboard <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-white/20 text-white/60 font-urbanist font-bold text-sm px-8 py-4 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200"
          >
            Back to Homepage
          </Link>
        </div>

        {/* Session ID for reference */}
        {sessionId && (
          <p className="font-urbanist text-[10px] text-white/15 mt-12">
            Session: {sessionId}
          </p>
        )}
      </div>
    </section>
  )
}

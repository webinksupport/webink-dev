'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export default function NavB() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          {/* Logo — larger */}
          <Link href="/" className="flex items-center min-w-[160px]">
            <Image
              src="/variant-b/logo-white.png"
              alt="Webink Solutions"
              width={180}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] font-semibold text-white/40 hover:text-white tracking-[0.18em] uppercase transition-colors duration-200 font-inter"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="tel:9418401381"
              className="text-[11px] font-medium text-white/30 hover:text-white/60 tracking-wider transition-colors font-inter"
            >
              (941) 840-1381
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border border-[#14EAEA]/60 text-[#14EAEA] text-[11px] font-bold px-5 py-2.5 rounded-lg tracking-[0.18em] uppercase hover:bg-[#14EAEA] hover:text-black transition-all duration-200 font-inter"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Open menu"
          >
            <span className="block w-6 h-px bg-white" />
            <span className="block w-4 h-px bg-white" />
            <span className="block w-6 h-px bg-white" />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-out drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-[#0F0F0F] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Image
            src="/variant-b/logo-white.png"
            alt="Webink Solutions"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/40 hover:text-white p-2 transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-xl font-bold text-white/70 hover:text-[#14EAEA] transition-colors py-3 border-b border-white/5 font-inter"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-8 space-y-3">
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block w-full border border-[#14EAEA] text-[#14EAEA] font-bold py-4 rounded-lg text-center text-sm font-inter tracking-widest uppercase hover:bg-[#14EAEA] hover:text-black transition-all duration-200"
          >
            Get a Free Quote
          </Link>
          <div className="text-center text-white/25 text-xs font-inter">
            (941) 840-1381 · hello@webink.solutions
          </div>
        </div>
      </div>
    </>
  )
}

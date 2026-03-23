'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export default function NavA() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when drawer is open
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#14EAEA]/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo — larger */}
          <Link href="/" className="flex-shrink-0 min-w-[160px]">
            <Image
              src="/variant-a/logo-white.png"
              alt="Webink Solutions"
              width={180}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-white/60 hover:text-[#14EAEA] transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 bg-[#14EAEA] hover:bg-[#14EAEA]/85 text-black text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-[0_0_25px_rgba(20,234,234,0.5)] hover:scale-105"
          >
            Get a Quote
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className="h-0.5 bg-white rounded" />
              <span className="h-0.5 bg-white rounded w-4" />
              <span className="h-0.5 bg-white rounded" />
            </div>
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-out drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-[#0A0A0A] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Image
            src="/variant-a/logo-white.png"
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

        {/* Drawer links */}
        <nav className="flex flex-col px-6 py-8 gap-2 flex-1">
          {links.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-syne text-xl font-bold text-white/70 hover:text-[#14EAEA] transition-colors py-3 border-b border-white/5"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer CTA */}
        <div className="px-6 pb-8 space-y-3">
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block w-full bg-[#14EAEA] text-black font-bold py-4 rounded-full text-center text-sm"
          >
            Get a Free Quote
          </Link>
          <div className="text-center text-white/25 text-xs">
            (941) 840-1381 · hello@webink.solutions
          </div>
        </div>
      </div>
    </>
  )
}

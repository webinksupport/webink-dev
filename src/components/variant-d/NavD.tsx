'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '/contact' },
]

export default function NavD() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-white backdrop-blur-sm'
      }`}>
        {/* Top utility bar */}
        <div className="hidden lg:block border-b border-black/5">
          <div className="max-w-7xl mx-auto px-8 py-2 flex justify-between items-center">
            <span className="text-xs text-black/30">Sarasota&apos;s Premiere Digital Agency</span>
            <div className="flex items-center gap-6">
              <a href="tel:9418401381" className="text-xs text-black/40 hover:text-black transition-colors flex items-center gap-1.5">
                <span className="text-[#14EAEA]">☎</span> (941) 840-1381
              </a>
              <a href="mailto:hello@webink.solutions" className="text-xs text-black/40 hover:text-black transition-colors">
                hello@webink.solutions
              </a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0 min-w-[160px]">
            <Image
              src="/variant-d/logo-dark.png"
              alt="Webink Solutions"
              width={180}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.slice(0, -1).map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-black/50 hover:text-black transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:9418401381"
              className="text-sm font-medium text-black/40 hover:text-black transition-colors"
            >
              (941) 840-1381
            </a>
            <Link
              href="/contact"
              className="bg-[#14EAEA] text-black text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#0DD4D4] transition-all duration-200"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-black"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <div className="w-6 h-0.5 bg-black" />
            <div className="w-4 h-0.5 bg-black mt-1.5" />
            <div className="w-6 h-0.5 bg-black mt-1.5" />
          </button>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-[96px] lg:h-[120px]" />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-out drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-white border-l border-black/10 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
          <Image
            src="/variant-d/logo-dark.png"
            alt="Webink Solutions"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="text-black/40 hover:text-black p-2 transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-xl font-semibold text-black/60 hover:text-black transition-colors py-3 border-b border-black/5"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="px-6 pb-8 space-y-3">
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block w-full bg-[#14EAEA] text-black text-sm font-bold py-4 rounded-lg text-center"
          >
            Get a Free Quote
          </Link>
          <div className="text-center text-black/30 text-xs">
            (941) 840-1381
          </div>
        </div>
      </div>
    </>
  )
}

'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { navLinks } from '@/components/data'

export default function NavC() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-md'
          : 'bg-black/70 backdrop-blur-xl border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo — larger */}
          <Link href="/" className="flex-shrink-0 min-w-[160px]">
            <Image
              src="/variant-c/logo-white.png"
              alt="Webink Solutions"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(1).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-grotesk text-sm font-medium text-white/55 hover:text-white transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 font-grotesk text-sm font-bold px-6 py-2.5 rounded-full text-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
            }}
          >
            Get a Quote
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-out drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-[#111] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Image
            src="/variant-c/logo-white.png"
            alt="Webink Solutions"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-white/40 hover:text-white p-2 transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-grotesk text-xl font-bold text-white/70 hover:text-[#14EAEA] transition-colors py-3 border-b border-white/5"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-8">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block w-full font-grotesk text-sm font-bold px-8 py-4 rounded-full text-black text-center"
            style={{ background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)' }}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </>
  )
}

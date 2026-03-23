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

export default function NavE() {
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
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-black/5' : 'bg-transparent backdrop-blur-sm'
      }`}>
        {/* Top utility bar */}
        <div className={`hidden lg:block border-b transition-all duration-300 ${scrolled ? 'border-black/5' : 'border-white/10'}`}>
          <div className="max-w-7xl mx-auto px-8 py-2 flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${scrolled ? 'text-black/30' : 'text-white/50'}`}>
              Sarasota&apos;s Premiere Digital Agency
            </span>
            <div className="flex items-center gap-6">
              <a href="tel:9418401381" className={`text-xs flex items-center gap-1.5 transition-colors duration-300 ${scrolled ? 'text-black/40 hover:text-black' : 'text-white/50 hover:text-white'}`}>
                <span className="text-[#14EAEA]">☎</span> (941) 840-1381
              </a>
              <a href="mailto:hello@webink.solutions" className={`text-xs transition-colors duration-300 ${scrolled ? 'text-black/40 hover:text-black' : 'text-white/50 hover:text-white'}`}>
                hello@webink.solutions
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0 min-w-[160px]">
            <Image
              src={scrolled ? '/images/logos/webink-black.png' : '/images/logos/webink-white.png'}
              alt="Webink Solutions"
              width={180}
              height={50}
              className="h-10 w-auto transition-opacity duration-300"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.slice(0, -1).map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`text-sm font-semibold transition-colors duration-200 tracking-wide font-urbanist ${
                  scrolled ? 'text-black/50 hover:text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className={`text-sm font-bold px-6 py-2.5 rounded-lg transition-all duration-200 font-urbanist ${
                scrolled
                  ? 'bg-[#14EAEA] text-black hover:bg-[#0DD4D4]'
                  : 'bg-white text-black hover:bg-[#14EAEA]'
              }`}
            >
              Get a Quote
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <div className={`w-6 h-0.5 ${scrolled ? 'bg-black' : 'bg-white'}`} />
            <div className={`w-4 h-0.5 mt-1.5 ${scrolled ? 'bg-black' : 'bg-white'}`} />
            <div className={`w-6 h-0.5 mt-1.5 ${scrolled ? 'bg-black' : 'bg-white'}`} />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-out drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
          <Image
            src="/images/logos/webink-black.png"
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
              className="text-xl font-semibold text-black/60 hover:text-black transition-colors py-3 border-b border-black/5 font-urbanist"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="px-6 pb-8 space-y-3">
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block w-full bg-[#14EAEA] text-black text-sm font-bold py-4 rounded-lg text-center font-urbanist"
          >
            Get a Free Quote
          </Link>
          <div className="text-center text-black/30 text-xs font-urbanist">
            (941) 840-1381 · hello@webink.solutions
          </div>
        </div>
      </div>
    </>
  )
}

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

export default function NavF() {
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-[0_1px_0_rgba(0,0,0,0.05)]'
          : 'bg-transparent backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0 min-w-[160px]">
            <Image
              src={scrolled ? '/images/logos/webink-black.png' : '/images/logos/webink-white.png'}
              alt="Webink Solutions"
              width={180}
              height={50}
              className="h-10 w-auto transition-all duration-300"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {links.slice(0, -1).map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`text-sm font-medium transition-colors duration-200 font-urbanist tracking-wide ${
                  scrolled ? 'text-black/45 hover:text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/contact"
              className={`text-sm font-semibold px-6 py-2.5 border rounded-full transition-all duration-300 font-urbanist ${
                scrolled
                  ? 'border-black text-black hover:bg-black hover:text-white'
                  : 'border-white/50 text-white hover:bg-white hover:text-black'
              }`}
            >
              Contact
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-6 h-px transition-all duration-200 ${scrolled ? 'bg-black' : 'bg-white'} ${
                i === 0 && mobileOpen ? 'rotate-45 translate-y-[7px]' :
                i === 1 && mobileOpen ? 'opacity-0' :
                i === 2 && mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
              } ${i > 0 ? 'mt-[6px]' : ''}`} />
            ))}
          </button>
        </div>
      </nav>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Off-canvas slide-out drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-end p-6">
          <button onClick={() => setMobileOpen(false)} className="text-black/40 hover:text-black p-2" aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col px-8 gap-5 flex-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-xl text-black/50 hover:text-black transition-colors font-urbanist"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function NavG() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0 min-w-[160px]">
            <Image
              src={scrolled ? '/images/logos/webink-black.png' : '/images/logos/webink-black.png'}
              alt="Webink Solutions"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.slice(0, -1).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-urbanist text-sm font-semibold text-black/60 hover:text-black transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="hidden md:inline-block font-urbanist font-black text-xs px-6 py-3 bg-[#0A0A0A] text-white hover:bg-[#14EAEA] hover:text-black transition-all duration-300 tracking-wider uppercase rounded-lg"
          >
            Get a Quote
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <div className="w-6 h-0.5 bg-black" />
            <div className="w-4 h-0.5 bg-black mt-1.5" />
            <div className="w-6 h-0.5 bg-black mt-1.5" />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-out drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-white border-l border-black/8 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
          <Image src="/images/logos/webink-black.png" alt="Webink Solutions" width={140} height={40} className="h-8 w-auto" />
          <button onClick={() => setMobileOpen(false)} className="text-black/40 hover:text-black p-2 transition-colors" aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
              className="text-xl font-semibold text-black/60 hover:text-black transition-colors py-3 border-b border-black/5 font-urbanist">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-8">
          <Link href="/contact" onClick={() => setMobileOpen(false)}
            className="block w-full bg-[#0A0A0A] text-white text-sm font-bold py-4 rounded-lg text-center font-urbanist hover:bg-[#14EAEA] hover:text-black transition-all duration-300">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </>
  )
}

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

export default function NavH() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
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
          background: scrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
          backdropFilter: 'blur(14px)',
          borderBottom: scrolled ? '2px solid #14EAEA' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0 min-w-[160px]">
            <Image
              src={scrolled ? '/images/logos/webink-black.png' : '/images/logos/webink-white.png'}
              alt="Webink Solutions"
              width={180}
              height={50}
              className="h-10 w-auto transition-all duration-300"
            />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {links.slice(0, -1).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-urbanist text-sm font-bold tracking-wide transition-colors duration-200"
                style={{ color: scrolled ? 'rgba(10,10,10,0.6)' : 'rgba(255,255,255,0.7)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="hidden md:inline-flex font-urbanist font-black text-xs px-7 py-3 tracking-widest uppercase transition-all duration-300 rounded-lg"
            style={{
              background: scrolled ? '#14EAEA' : 'transparent',
              color: scrolled ? '#000' : '#14EAEA',
              border: '2px solid #14EAEA',
            }}
          >
            Get a Quote
          </Link>

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
      <div className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-[#0A0A0A] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Image src="/images/logos/webink-white.png" alt="Webink Solutions" width={140} height={40} className="h-8 w-auto" />
          <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white p-2 transition-colors" aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
              className="text-xl font-bold text-white/70 hover:text-white transition-colors py-3 border-b border-white/5 font-urbanist">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-8 space-y-3">
          <Link href="/contact" onClick={() => setMobileOpen(false)}
            className="block w-full border-2 border-[#14EAEA] text-[#14EAEA] text-sm font-bold py-4 rounded-lg text-center font-urbanist hover:bg-[#14EAEA] hover:text-black transition-all duration-200">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </>
  )
}

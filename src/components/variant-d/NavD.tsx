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

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white'
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
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/variant-d/logo-dark.png"
              alt="Webink Solutions"
              width={160}
              height={44}
              className="h-9 w-auto"
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
              className="bg-[#14EAEA] text-black text-sm font-bold px-6 py-2.5 hover:bg-[#0DD4D4] transition-all duration-200"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-black"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-black transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-6 h-0.5 bg-black mt-1.5 transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-black mt-1.5 transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-black/5 px-6 py-6">
            <div className="flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-black/60 hover:text-black transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/contact"
                className="mt-2 bg-[#14EAEA] text-black text-sm font-bold px-6 py-3 text-center"
                onClick={() => setMobileOpen(false)}
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-[88px] lg:h-[116px]" />
    </>
  )
}


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

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5' : 'bg-transparent'
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
          <Link href="/" className="flex-shrink-0">
            <Image
              src={scrolled ? '/images/logos/webink-black.png' : '/images/logos/webink-white.png'}
              alt="Webink Solutions"
              width={160}
              height={44}
              className="h-9 w-auto transition-opacity duration-300"
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
              className={`text-sm font-bold px-6 py-2.5 transition-all duration-200 font-urbanist ${
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
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-6 h-0.5 transition-all duration-200 ${scrolled ? 'bg-black' : 'bg-white'} ${
                i === 0 && mobileOpen ? 'rotate-45 translate-y-1.5' :
                i === 1 && mobileOpen ? 'opacity-0' :
                i === 2 && mobileOpen ? '-rotate-45 -translate-y-1.5' : ''
              } ${i > 0 ? 'mt-1.5' : ''}`} />
            ))}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-black/5 px-6 py-6">
            <div className="flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-black/60 hover:text-black transition-colors font-urbanist"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/contact"
                className="mt-2 bg-[#14EAEA] text-black text-sm font-bold px-6 py-3 text-center font-urbanist"
                onClick={() => setMobileOpen(false)}
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

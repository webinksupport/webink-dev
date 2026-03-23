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

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/96 backdrop-blur-sm border-b border-black/5 shadow-[0_1px_0_rgba(0,0,0,0.05)]' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={scrolled ? '/images/logos/webink-black.png' : '/images/logos/webink-white.png'}
              alt="Webink Solutions"
              width={140}
              height={40}
              className="h-8 w-auto transition-all duration-300"
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
              className={`text-sm font-semibold px-6 py-2.5 border transition-all duration-300 font-urbanist ${
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

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-black/5 px-8 py-6">
            <div className="flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-black/50 hover:text-black transition-colors font-urbanist"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

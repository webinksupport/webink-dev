'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavG() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/logos/webink-black.png"
            alt="Webink Solutions"
            width={130}
            height={36}
            className="h-8 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {['Services', 'About', 'Portfolio', 'Blog'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="font-urbanist text-sm font-semibold text-black/60 hover:text-black transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          className="font-urbanist font-black text-xs px-6 py-3 bg-[#0A0A0A] text-white hover:bg-[#14EAEA] hover:text-black transition-all duration-300 tracking-wider uppercase"
        >
          Get a Quote
        </Link>
      </div>
    </nav>
  )
}

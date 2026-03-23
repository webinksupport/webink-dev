'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Results', href: '#results' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
]

export default function NavI() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY >= 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleLinkClick = () => setOpen(false)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl bg-white/85 border-b border-black/8 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-4 flex items-center justify-between">
          {/* Logo — white over hero, black when scrolled */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            {scrolled ? (
              <Image
                src="/images/logos/webink-black-4x1.png"
                alt="Webink Solutions"
                width={176}
                height={44}
                className="h-12 w-auto"
                priority
              />
            ) : (
              <Image
                src="/images/logos/webink-white.png"
                alt="Webink Solutions"
                width={176}
                height={44}
                className="h-12 w-auto"
                priority
              />
            )}
          </Link>

          {/* Desktop nav links — centered */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`font-urbanist text-sm font-semibold transition-colors duration-200 tracking-wide ${
                  scrolled
                    ? 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className={`hidden lg:inline-flex items-center gap-2 font-urbanist text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 ${
                scrolled
                  ? 'bg-[#0A0A0A] text-white hover:bg-[#14EAEA] hover:text-black'
                  : 'bg-white text-[#0A0A0A] hover:bg-[#14EAEA] hover:text-black'
              }`}
            >
              Get Free Audit
            </a>

            {/* Hamburger — all screen sizes */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="relative w-10 h-10 flex flex-col justify-center items-center gap-[6px] z-50"
            >
              <motion.span
                animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-6 h-[2px] origin-center ${scrolled ? 'bg-[#0A0A0A]' : 'bg-white'}`}
              />
              <motion.span
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className={`block w-6 h-[2px] origin-center ${scrolled ? 'bg-[#0A0A0A]' : 'bg-white'}`}
              />
              <motion.span
                animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-6 h-[2px] origin-center ${scrolled ? 'bg-[#0A0A0A]' : 'bg-white'}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Off-canvas slide-out menu — elegant side panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.nav
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-black/8">
                <Image
                  src="/images/logos/webink-black-4x1.png"
                  alt="Webink Solutions"
                  width={140}
                  height={36}
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 1L17 17M17 1L1 17" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-8 py-10">
                <div className="space-y-1">
                  {navLinks.map((l, i) => (
                    <motion.a
                      key={l.label}
                      href={l.href}
                      onClick={handleLinkClick}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.1 }}
                      className="block font-urbanist font-black text-4xl text-[#0A0A0A] py-4 border-b border-black/5 hover:text-[#14EAEA] transition-colors duration-200"
                    >
                      {l.label}
                    </motion.a>
                  ))}
                </div>

                {/* Contact in panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-12 space-y-4"
                >
                  <a
                    href="tel:9418401381"
                    className="flex items-center gap-3 font-urbanist text-base text-[#0A0A0A]/50 hover:text-[#0A0A0A] transition-colors"
                    onClick={handleLinkClick}
                  >
                    <span className="w-8 h-8 rounded-full bg-[#14EAEA]/15 flex items-center justify-center text-[#14EAEA]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.12-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                    </span>
                    (941) 840-1381
                  </a>
                  <a
                    href="mailto:hello@webink.solutions"
                    className="flex items-center gap-3 font-urbanist text-base text-[#0A0A0A]/50 hover:text-[#0A0A0A] transition-colors"
                    onClick={handleLinkClick}
                  >
                    <span className="w-8 h-8 rounded-full bg-[#14EAEA]/15 flex items-center justify-center text-[#14EAEA]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </span>
                    hello@webink.solutions
                  </a>
                </motion.div>
              </div>

              {/* CTA at bottom */}
              <div className="px-8 py-8 border-t border-black/8">
                <a
                  href="/contact"
                  onClick={handleLinkClick}
                  className="block w-full text-center font-urbanist font-bold py-4 bg-[#0A0A0A] text-white rounded-2xl hover:bg-[#14EAEA] hover:text-black transition-all duration-300 text-sm tracking-wide"
                >
                  Get a Free Audit →
                </a>
                <p className="text-center text-xs text-black/30 mt-3 font-urbanist">No commitment. Response in 24h.</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

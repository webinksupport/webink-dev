'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // autoRaf: false — we drive Lenis from GSAP ticker (or manual RAF fallback)
    // This prevents double-update jitter when both Lenis and GSAP try to RAF
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    })

    let rafId: number | null = null

    // Integrate Lenis with GSAP ScrollTrigger if GSAP is loaded
    const syncScrollTrigger = async () => {
      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        // Tell ScrollTrigger to update on Lenis scroll
        lenis.on('scroll', ScrollTrigger.update)

        // Use GSAP ticker to drive Lenis RAF — single animation loop
        gsap.ticker.add((time: number) => {
          lenis.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0)
      } catch {
        // GSAP not available, fall back to manual RAF loop
        const raf = (time: number) => {
          lenis.raf(time)
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
      }
    }

    syncScrollTrigger()

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

'use client'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Prevent Lenis from fighting GSAP ScrollTrigger pinned sections
      syncTouch: false,
    })
    lenisRef.current = lenis

    // Integrate with GSAP ScrollTrigger if available
    let gsapTicker: (() => void) | null = null
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)

        // Sync Lenis scroll position with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update)

        gsapTicker = (time?: unknown) => {
          lenis.raf((time as number) * 1000)
        }
        gsap.ticker.add(gsapTicker)

        // Disable Lenis's internal RAF since GSAP handles it
        gsap.ticker.lagSmoothing(0)
      })
    }).catch(() => {
      // Fallback to standalone RAF if GSAP isn't available
      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    })

    return () => {
      if (gsapTicker) {
        import('gsap').then(({ gsap }) => {
          gsap.ticker.remove(gsapTicker!)
        })
      }
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}

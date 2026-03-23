'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function AboutH() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30])

  return (
    <section ref={sectionRef} className="bg-[#0A0A0A] py-28 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left: Image with parallax */}
          <motion.div
            className="lg:col-span-5 relative h-[600px]"
            style={{ y: imgY }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/images/photos/sean-about.jpg"
                alt="Sean Rowe — Webink Solutions Founder"
                fill
                className="object-cover object-top"
                sizes="40vw"
              />
              {/* Bottom grad */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            </div>
            {/* Cyan left border accent */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#14EAEA]" />
          </motion.div>

          {/* Right: Editorial text */}
          <div className="lg:col-span-7 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-[2px] bg-[#14EAEA]" />
                <span className="font-urbanist text-xs font-black tracking-[0.5em] text-white/25 uppercase">Our Story</span>
              </div>

              <h2
                className="font-urbanist font-black text-white leading-[0.88] mb-10"
                style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', letterSpacing: '-0.04em' }}
              >
                A DIFFERENT<br />
                KIND OF<br />
                <span className="text-[#14EAEA]">AGENCY.</span>
              </h2>

              <p className="font-urbanist text-white/50 text-xl leading-relaxed mb-6">
                Sean Rowe founded Webink Solutions in Sarasota with a conviction that local businesses deserve world-class digital marketing — and the results to prove it.
              </p>
              <p className="font-urbanist text-white/35 leading-relaxed mb-12">
                That same mentality drives everything we do: real results, real relationships, and genuine care for the businesses we serve across Sarasota, Tampa, and Bradenton.
              </p>

              {/* Stats row */}
              <div className="flex gap-10 flex-wrap mb-12">
                {[
                  { val: '50+', label: 'Clients Served' },
                  { val: '6+', label: 'Years Active' },
                  { val: '#1', label: 'DesignRush FL' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-urbanist font-black text-4xl text-[#14EAEA] leading-none">{s.val}</div>
                    <div className="font-urbanist text-xs text-white/30 mt-1 tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              <a
                href="/about"
                className="inline-flex items-center gap-3 font-urbanist font-black text-sm text-white border-b-2 border-[#14EAEA] pb-1 hover:text-[#14EAEA] transition-colors duration-200"
              >
                Meet the Team →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

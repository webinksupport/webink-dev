'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function AboutG() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imgScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1.02])
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={sectionRef} className="bg-[#F5F5F5] py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Overlapping image collage */}
          <div className="relative h-[520px]">
            {/* Main image — scale on scroll */}
            <div className="absolute inset-0 overflow-hidden rounded-sm shadow-xl">
              <motion.div style={{ scale: imgScale }} className="relative h-full w-full">
                <Image
                  src="/images/photos/team-duo.jpg"
                  alt="Webink team"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </motion.div>
            </div>

            {/* Overlapping portrait — offset bottom right */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-8 -right-6 w-52 h-64 overflow-hidden shadow-2xl rounded-sm border-4 border-white z-10"
              style={{ transform: 'rotate(-2.5deg)' }}
            >
              <Image
                src="/images/photos/sean-street.jpg"
                alt="Sean Webink Founder"
                fill
                className="object-cover"
                sizes="25vw"
              />
            </motion.div>

            {/* Cyan accent block */}
            <div className="absolute top-6 -left-6 w-16 h-16 bg-[#14EAEA] z-0" />

            {/* Pink label */}
            <div className="absolute bottom-16 -left-4 z-20 bg-[#F813BE] px-4 py-2 rotate-[-90deg] origin-bottom-left translate-y-full">
              <span className="font-urbanist font-black text-xs text-white tracking-[0.4em] uppercase whitespace-nowrap">
                Since 2020
              </span>
            </div>
          </div>

          {/* Right: Text */}
          <motion.div style={{ y: textY }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[3px] bg-[#F813BE]" />
              <span className="font-urbanist text-xs font-black tracking-[0.4em] text-black/30 uppercase">Our Story</span>
            </div>

            <h2
              className="font-urbanist font-black text-[#0A0A0A] leading-[0.9] mb-8"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', letterSpacing: '-0.025em' }}
            >
              DRIVEN BY<br />
              RESULTS,<br />
              BUILT ON <span className="text-[#14EAEA]">TRUST.</span>
            </h2>

            <p className="font-urbanist text-black/55 text-lg leading-relaxed mb-6">
              Sean Rowe founded Webink Solutions in Sarasota with a clear mission: give local businesses the world-class digital presence they deserve. No templates, no empty promises — just real results.
            </p>
            <p className="font-urbanist text-black/45 leading-relaxed mb-10">
              We&apos;re a boutique full-service digital agency focused on one thing: growing your business. Real results. Real relationships. Local pride.
            </p>

            {/* Process steps */}
            <div className="space-y-4 mb-10">
              {[
                { num: '01', label: 'Branding', desc: 'Foundation — your identity, voice, and visual system' },
                { num: '02', label: 'Design', desc: 'Strategy-first web design engineered to convert' },
                { num: '03', label: 'Marketing', desc: 'Data-driven campaigns that grow revenue' },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-5">
                  <span className="font-urbanist font-black text-4xl text-black/10 w-10 shrink-0">{step.num}</span>
                  <div>
                    <div className="font-urbanist font-black text-black text-sm">{step.label}</div>
                    <div className="font-urbanist text-black/40 text-xs">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="inline-flex items-center gap-2 font-urbanist font-black text-sm border-b-2 border-[#14EAEA] pb-1 hover:text-[#14EAEA] transition-colors duration-200"
            >
              Meet the Team →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

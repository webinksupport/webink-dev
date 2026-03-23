'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function AboutI() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <section ref={sectionRef} id="about" className="bg-white py-24 lg:py-40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-16">
          <span className="w-8 h-[2px] bg-[#14EAEA]" />
          <span className="font-urbanist text-xs font-black tracking-[0.5em] text-black/30 uppercase">Our Story</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Image — with parallax */}
          <motion.div
            ref={imgRef}
            style={{ y: imgY }}
            className="lg:col-span-5 relative"
          >
            <div className="relative h-[500px] lg:h-[680px] rounded-[24px] overflow-hidden shadow-2xl">
              <Image
                src="/images/photos/sean-street.jpg"
                alt="Sean Rowe, founder of Webink Solutions — Sarasota digital marketing"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Subtle bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-8 -right-6 lg:-right-10 bg-white rounded-2xl shadow-xl px-7 py-5 border border-black/5"
            >
              <div className="font-urbanist font-black text-4xl text-[#14EAEA]">#1</div>
              <div className="font-urbanist text-xs text-[#0A0A0A]/50 mt-1 leading-tight">Rated Agency<br/>in Florida</div>
            </motion.div>

            {/* Cyan accent line */}
            <div className="absolute top-8 -left-3 w-1.5 h-32 bg-[#14EAEA] rounded-full" />
          </motion.div>

          {/* Text content */}
          <motion.div
            style={{ y: textY }}
            className="lg:col-span-7 lg:pl-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="font-urbanist font-black text-[#0A0A0A] leading-[0.88] mb-8"
                style={{
                  fontSize: 'clamp(2.8rem, 6vw, 6.5rem)',
                  letterSpacing: '-0.04em',
                }}
              >
                A Different<br />
                Kind of{' '}
                <span className="text-[#14EAEA]">Agency.</span>
              </h2>

              <p className="font-urbanist text-[#0A0A0A]/60 text-xl leading-relaxed mb-6">
                Sean Rowe founded Webink Solutions in Sarasota with a simple conviction: local businesses deserve world-class digital marketing — and the results to prove it.
              </p>
              <p className="font-urbanist text-[#0A0A0A]/40 text-lg leading-relaxed mb-10">
                We're a full-service digital agency serving Sarasota, Tampa, and Bradenton. No outsourcing. No cookie-cutter strategies. Just real work, real relationships, and real growth for the businesses we serve.
              </p>

              {/* 3-step process */}
              <div className="space-y-6 mb-12">
                {[
                  { step: '01', title: 'Audit & Strategy', desc: 'We start by understanding your business, your goals, and where you stand.' },
                  { step: '02', title: 'Build & Launch', desc: 'Design, development, and marketing campaigns built for your market.' },
                  { step: '03', title: 'Measure & Grow', desc: 'Monthly reporting, continuous optimization, and transparent communication.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5 group">
                    <span className="font-urbanist font-black text-lg text-[#14EAEA] w-10 shrink-0 pt-0.5">{item.step}</span>
                    <div>
                      <div className="font-urbanist font-bold text-[#0A0A0A] text-base mb-1">{item.title}</div>
                      <div className="font-urbanist text-[#0A0A0A]/45 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/about"
                className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-4 bg-[#0A0A0A] text-white rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-all duration-300"
              >
                Meet the Team →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

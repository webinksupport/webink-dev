'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { FAQ } from '@/lib/product-content'

const ease = [0.25, 0.46, 0.45, 0.94]

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-urbanist font-bold text-[15px] text-white/80 pr-8 group-hover:text-[#14EAEA] transition-colors duration-200">
          {question}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#14EAEA] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
        className="overflow-hidden"
      >
        <p className="font-urbanist text-sm text-white/40 leading-relaxed pb-5">
          {answer}
        </p>
      </motion.div>
    </div>
  )
}

interface ProductFAQProps {
  faqs: FAQ[]
}

export default function ProductFAQ({ faqs }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs.length) return null

  return (
    <section id="faq" className="bg-[#0A0A0A] px-6 md:px-16 lg:px-24 py-20 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, margin: '-60px' }}
          className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
        >
          FAQ
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, margin: '-60px' }}
          className="font-urbanist font-black text-white mb-10 leading-tight"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="bg-[#111111] rounded-2xl border border-white/8 p-6 md:p-8">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

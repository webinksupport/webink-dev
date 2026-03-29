'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, Loader2, Check, AlertCircle } from 'lucide-react'
import EditableText from '@/components/editor/EditableText'
import EditableImage from '@/components/editor/EditableImage'
import { useEditor } from '@/components/editor/EditorContext'

const ease = [0.25, 0.46, 0.45, 0.94]

const services = [
  'Web Design',
  'SEO',
  'Social Media Marketing',
  'Paid Advertising (PPC)',
  'AI Marketing',
  'Custom CRM / SaaS',
  'Web Hosting',
  'Other',
]

const budgetRanges = [
  'Under $500/mo',
  '$500 - $1,000/mo',
  '$1,000 - $2,500/mo',
  '$2,500 - $5,000/mo',
  '$5,000+/mo',
  'One-time project',
  'Not sure yet',
]

export default function ContactContent({ content }: { content: Record<string, string> }) {
  const { editMode } = useEditor()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass = 'w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-xl px-4 py-3 focus:outline-none focus:border-[#14EAEA] transition-colors placeholder:text-white/30'
  const labelClass = 'text-white/60 text-xs font-bold tracking-[2px] uppercase block mb-2'

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden">
        <div className="absolute inset-0">
          <EditableImage
            blockKey="hero_image"
            src="/images/photos/workspace-laptop.jpg"
            alt="Contact Webink Solutions"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <EditableText
              as="p"
              blockKey="hero_eyebrow"
              defaultValue="Contact Us"
              className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease }}
          >
            <EditableText
              as="h1"
              blockKey="hero_headline"
              defaultValue="Let's Talk."
              className="font-urbanist font-black text-white leading-[0.92] mb-6"
              style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', letterSpacing: '-0.04em' }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            <EditableText
              as="p"
              blockKey="hero_subtext"
              defaultValue="Ready to grow your business? Send us a message or give us a call — we'd love to hear about your project."
              className="font-urbanist text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══ FORM + INFO ═══ */}
      <section className="bg-[#0F0F0F] px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <EditableText
                as="h2"
                blockKey="form_heading"
                defaultValue="Send Us a Message"
                className="font-urbanist font-black text-white text-2xl mb-8"
              />

              {status === 'sent' ? (
                <div className="bg-[#14EAEA]/10 border border-[#14EAEA]/30 rounded-2xl p-8 text-center">
                  <Check className="w-12 h-12 text-[#14EAEA] mx-auto mb-4" />
                  <h3 className="font-urbanist font-bold text-white text-xl mb-2">Message Sent!</h3>
                  <p className="text-white/60">We will get back to you within 24 hours. Thanks for reaching out!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(941) 555-0123" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Service Interested In</label>
                      <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inputClass}>
                        <option value="">Select a service...</option>
                        {services.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Budget Range</label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputClass}>
                      <option value="">Select budget range...</option>
                      {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Message *</label>
                    <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Tell us about your project or what you need help with..." className={inputClass + ' resize-y'} />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Something went wrong. Please try again or call us directly.
                    </div>
                  )}

                  <button type="submit" disabled={status === 'sending'} className="flex items-center gap-2 bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200 disabled:opacity-50">
                    {status === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Business Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <EditableText
                as="h3"
                blockKey="info_heading"
                defaultValue="Get in Touch"
                className="font-urbanist font-bold text-white text-xl mb-8"
              />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#14EAEA]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#14EAEA]" />
                  </div>
                  <div>
                    <h4 className="font-urbanist font-bold text-white text-sm mb-1">Phone</h4>
                    <a href="tel:9418401381" onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }} className="font-urbanist text-white/60 hover:text-[#14EAEA] transition-colors">
                      <EditableText as="span" blockKey="info_phone" defaultValue="(941) 840-1381" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F813BE]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#F813BE]" />
                  </div>
                  <div>
                    <h4 className="font-urbanist font-bold text-white text-sm mb-1">Email</h4>
                    <a href="mailto:hello@webink.solutions" onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }} className="font-urbanist text-white/60 hover:text-[#F813BE] transition-colors">
                      <EditableText as="span" blockKey="info_email" defaultValue="hello@webink.solutions" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#B9FF33]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#B9FF33]" />
                  </div>
                  <div>
                    <h4 className="font-urbanist font-bold text-white text-sm mb-1">Address</h4>
                    <EditableText
                      as="p"
                      blockKey="info_address"
                      defaultValue="Webink Solutions\n1609 Georgetowne Blvd\nSarasota, FL 34232"
                      className="font-urbanist text-white/60"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#14EAEA]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#14EAEA]" />
                  </div>
                  <div>
                    <h4 className="font-urbanist font-bold text-white text-sm mb-1">Hours</h4>
                    <EditableText
                      as="p"
                      blockKey="info_hours"
                      defaultValue="Mon - Fri: 9:00 AM - 5:00 PM\nSat - Sun: By appointment"
                      className="font-urbanist text-white/60"
                    />
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-10 rounded-2xl overflow-hidden border border-white/10 h-[200px] relative bg-[#1A1A1A]">
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
                  <MapPin className="w-6 h-6 mr-2" /> Sarasota, FL
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

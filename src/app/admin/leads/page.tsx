'use client'

import { useState } from 'react'
import AdminSidebar from '../AdminSidebar'
import { Search, Download, Mail, Eye, Globe, ShieldCheck, Smartphone, Palette, X, Copy, ChevronDown, ChevronUp } from 'lucide-react'

interface Lead {
  id: string
  name: string
  type: string
  address: string
  phone: string
  website: string
  hasSSL: boolean
  mobileFriendly: boolean
  modernDesign: boolean
  score: number
}

const businessTypes = ['all', 'Restaurant', 'Contractor', 'Retail', 'Medical', 'Salon', 'Automotive', 'Legal', 'Real Estate', 'Fitness']

const emailTemplates = [
  {
    name: 'Day 1 — First Touch',
    subject: 'I noticed {business_name} doesn\'t have a website...',
    body: `Hi {owner_name},

I was looking up businesses in {city} and came across {business_name}. I noticed you don't currently have a website — and in today's market, that means you're likely missing out on customers who are searching online for exactly what you offer.

At Webink Solutions, we build professional, SEO-optimized websites in just 72 hours using AI-powered tools — for just $499. That includes custom design, mobile responsiveness, contact forms, Google Analytics, and SSL security.

Would you be open to a quick 10-minute call this week to see if it's a fit?

Best,
Sean Rowe
Webink Solutions
(941) 840-1381
hello@webink.solutions`,
  },
  {
    name: 'Day 3 — Follow Up',
    subject: 'Quick follow-up about {business_name}\'s online presence',
    body: `Hi {owner_name},

Just following up on my note from a few days ago. I know you're busy running {business_name}, so I'll keep this brief.

{pain_point} — and a professional website is the fastest way to fix that. We've helped dozens of {city} businesses get online and start attracting new customers within days.

Here's what one of our clients said: "Webink built our site in 3 days and we started getting calls the same week." — Tiffini Brown

I'd love to put together a free mockup of what your site could look like. No obligation, no pressure.

Reply "YES" and I'll have it ready in 24 hours.

Sean Rowe
Webink Solutions
(941) 840-1381`,
  },
  {
    name: 'Day 7 — Final Offer',
    subject: 'Last chance: $499 AI website for {business_name}',
    body: `Hi {owner_name},

This is my last email — I don't want to be a pest. But I genuinely believe {business_name} is leaving money on the table without a website.

Here's what I'm offering:
- Professional website built in 72 hours
- Custom design for your brand
- 5 pages, mobile responsive, SEO optimized
- Google Analytics + SSL included
- 30 days of post-launch support
- All for just $499 (one-time)

If you're interested, just reply to this email or call me at (941) 840-1381. If not, no hard feelings — I wish you nothing but success.

Sean Rowe
Founder, Webink Solutions
hello@webink.solutions
webink.solutions`,
  },
]

export default function LeadsPage() {
  const [businessType, setBusinessType] = useState('all')
  const [city, setCity] = useState('Sarasota, FL')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [apiNote, setApiNote] = useState('')
  const [mockupLead, setMockupLead] = useState<Lead | null>(null)
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const searchLeads = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (businessType !== 'all') params.set('type', businessType)
      if (city) params.set('city', city)
      const res = await fetch(`/api/admin/leads?${params}`)
      const data = await res.json()
      setLeads(data.leads || [])
      setApiNote(data.note || '')
    } catch {
      setLeads([])
    }
    setLoading(false)
  }

  const exportCSV = () => {
    const headers = ['Name', 'Type', 'Address', 'Phone', 'Website', 'SSL', 'Mobile Friendly', 'Modern Design', 'Score']
    const rows = leads.map(l => [l.name, l.type, l.address, l.phone, l.website || 'None', l.hasSSL ? 'Yes' : 'No', l.mobileFriendly ? 'Yes' : 'No', l.modernDesign ? 'Yes' : 'No', l.score.toString()])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${businessType}-${city.replace(/[^a-z0-9]/gi, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-[#F813BE]'
    if (score < 40) return 'text-[#F813BE]'
    if (score < 70) return 'text-yellow-400'
    return 'text-[#14EAEA]'
  }

  const getScoreLabel = (score: number) => {
    if (score === 0) return 'No Website'
    if (score < 40) return 'Poor'
    if (score < 70) return 'Fair'
    return 'Good'
  }

  const copyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <AdminSidebar />
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-2">Sales Tools</p>
              <h1 className="text-3xl font-bold">Lead Research</h1>
              <p className="text-[#999] mt-1 text-sm">Find local businesses without websites and generate outreach campaigns.</p>
            </div>

            {apiNote && (
              <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 mb-6 text-sm text-yellow-400">
                {apiNote}
              </div>
            )}

            {/* Search Form */}
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold tracking-[2px] uppercase text-[#999] mb-2 block">Business Type</label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-[#333] rounded-lg px-4 py-3 text-white text-sm focus:border-[#14EAEA] focus:outline-none transition-colors"
                  >
                    {businessTypes.map(t => (
                      <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold tracking-[2px] uppercase text-[#999] mb-2 block">City / State</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Sarasota, FL"
                    className="w-full bg-[#0F0F0F] border border-[#333] rounded-lg px-4 py-3 text-white text-sm focus:border-[#14EAEA] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={searchLeads}
                    disabled={loading}
                    className="bg-[#F813BE] hover:bg-[#d10fa3] text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {leads.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-[#999]">{leads.length} leads found</p>
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 text-sm text-[#14EAEA] hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>

                <div className="grid gap-4 mb-12">
                  {leads.map(lead => (
                    <div key={lead.id} className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 hover:border-[#14EAEA]/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{lead.name}</h3>
                            <span className="text-xs bg-[#333] text-[#999] px-2 py-0.5 rounded">{lead.type}</span>
                          </div>
                          <p className="text-sm text-[#999] mb-1">{lead.address}</p>
                          <p className="text-sm text-[#999]">{lead.phone}</p>
                          {lead.website && (
                            <p className="text-sm text-[#14EAEA] mt-1 truncate">{lead.website}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          {/* Quality Indicators */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1" title="SSL">
                              <ShieldCheck className={`w-4 h-4 ${lead.hasSSL ? 'text-[#14EAEA]' : 'text-[#333]'}`} />
                            </div>
                            <div className="flex items-center gap-1" title="Mobile Friendly">
                              <Smartphone className={`w-4 h-4 ${lead.mobileFriendly ? 'text-[#14EAEA]' : 'text-[#333]'}`} />
                            </div>
                            <div className="flex items-center gap-1" title="Modern Design">
                              <Palette className={`w-4 h-4 ${lead.modernDesign ? 'text-[#14EAEA]' : 'text-[#333]'}`} />
                            </div>
                          </div>
                          {/* Score */}
                          <div className="text-center min-w-[60px]">
                            <p className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</p>
                            <p className={`text-[10px] font-bold tracking-wider uppercase ${getScoreColor(lead.score)}`}>{getScoreLabel(lead.score)}</p>
                          </div>
                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setMockupLead(lead)}
                              className="border border-[#14EAEA] text-[#14EAEA] hover:bg-[#14EAEA] hover:text-[#0A0A0A] px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Mockup
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Email Campaign Builder */}
            <div className="mb-8">
              <p className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-2">Outreach</p>
              <h2 className="text-2xl font-bold mb-6">Email Campaign Templates</h2>
              <p className="text-sm text-[#999] mb-6">Pre-built email sequences for the $499 AI Website offer. Replace template variables before sending.</p>

              <div className="space-y-4">
                {emailTemplates.map((tmpl, i) => (
                  <div key={i} className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedEmail(expandedEmail === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-[#222] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#F813BE]" />
                        <div>
                          <p className="font-semibold">{tmpl.name}</p>
                          <p className="text-sm text-[#999]">Subject: {tmpl.subject}</p>
                        </div>
                      </div>
                      {expandedEmail === i ? <ChevronUp className="w-4 h-4 text-[#999]" /> : <ChevronDown className="w-4 h-4 text-[#999]" />}
                    </button>
                    {expandedEmail === i && (
                      <div className="px-5 pb-5 border-t border-[#333]">
                        <pre className="text-sm text-[#ccc] whitespace-pre-wrap mt-4 leading-relaxed font-sans">{tmpl.body}</pre>
                        <button
                          onClick={() => copyTemplate(tmpl.body, `email-${i}`)}
                          className="mt-4 flex items-center gap-2 text-sm text-[#14EAEA] hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedId === `email-${i}` ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup Modal */}
            {mockupLead && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setMockupLead(null)}>
                <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold text-[#0A0A0A]">Website Mockup: {mockupLead.name}</h3>
                    <button onClick={() => setMockupLead(null)} className="text-[#999] hover:text-[#0A0A0A]">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-0">
                    {/* Simple mockup preview */}
                    <div className="bg-[#0F0F0F] text-white">
                      {/* Nav */}
                      <div className="flex items-center justify-between px-8 py-4 border-b border-[#333]">
                        <span className="text-xl font-bold">{mockupLead.name}</span>
                        <div className="flex gap-6 text-sm text-[#999]">
                          <span>Home</span><span>About</span><span>Services</span><span>Contact</span>
                        </div>
                      </div>
                      {/* Hero */}
                      <div className="px-8 py-16 text-center bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A]">
                        <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4">{mockupLead.type} in Sarasota</p>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to {mockupLead.name}</h1>
                        <p className="text-[#999] max-w-lg mx-auto mb-8">Your trusted local {mockupLead.type.toLowerCase()} serving Sarasota and surrounding areas. Quality service you can count on.</p>
                        <div className="flex gap-4 justify-center">
                          <span className="bg-[#F813BE] text-white px-6 py-3 rounded-full text-sm font-semibold">Get a Quote</span>
                          <span className="border border-[#14EAEA] text-[#14EAEA] px-6 py-3 rounded-full text-sm font-semibold">Learn More</span>
                        </div>
                      </div>
                      {/* Services */}
                      <div className="px-8 py-12 bg-[#F8F8F8] text-[#0A0A0A]">
                        <p className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-2 text-center">What We Offer</p>
                        <h2 className="text-2xl font-bold text-center mb-8">Our Services</h2>
                        <div className="grid grid-cols-3 gap-6">
                          {['Professional Service', 'Quality Work', 'Customer Support'].map((s, i) => (
                            <div key={i} className="bg-white border border-[#E5E5E5] rounded-xl p-6 text-center">
                              <div className={`w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center ${i === 0 ? 'bg-[#14EAEA]' : i === 1 ? 'bg-[#F813BE]' : 'bg-[#B9FF33]'}`}>
                                <Globe className="w-5 h-5 text-[#0A0A0A]" />
                              </div>
                              <h3 className="font-bold mb-2">{s}</h3>
                              <p className="text-sm text-[#666]">We deliver exceptional {s.toLowerCase()} to all our valued customers.</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* CTA */}
                      <div className="px-8 py-12 text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-[#999] mb-6">Contact us today for a free consultation.</p>
                        <p className="text-[#14EAEA]">{mockupLead.phone}</p>
                        <p className="text-[#999] text-sm mt-2">{mockupLead.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-[#F8F8F8] text-center">
                    <p className="text-xs text-[#999]">This is a preview mockup. Actual design will be customized for {mockupLead.name}.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

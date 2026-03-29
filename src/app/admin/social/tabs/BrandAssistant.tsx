'use client'

import { useState, useEffect } from 'react'
import {
  Palette, Save, Loader2, Sparkles, ArrowRight, Clock, ImageIcon, CheckCircle,
} from 'lucide-react'

interface BrandProfile {
  id?: string
  businessName: string
  tagline: string
  brandVoice: string
  primaryColors: string[]
  targetAudience: string
  keyServices: string
  brandKeywords: string
  competitorHandles: string
  logoPath: string
}

interface Variation {
  length: string
  caption: string
  hashtags: string
}

interface GeneratedContent {
  variations: Variation[]
  imagePrompt: string
  bestTimeToPost: string
}

interface Props {
  onUseContent: (draft: { caption?: string; hashtags?: string; imagePrompt?: string }) => void
  onGoToImageStudio: (prompt: string) => void
}

const CONTENT_TYPES = [
  'Service Spotlight', 'Case Study Teaser', 'Testimonial Feature', 'Behind the Scenes',
  'Seasonal Promotion', 'Product Launch', 'Educational Post', 'Brand Story',
]

const VOICE_OPTIONS = ['Professional', 'Casual', 'Witty', 'Inspirational', 'Bold']

const defaultProfile: BrandProfile = {
  businessName: 'Webink Solutions',
  tagline: 'Rethink Design',
  brandVoice: 'Professional',
  primaryColors: ['#14EAEA', '#F813BE', '#B9FF33'],
  targetAudience: '',
  keyServices: '',
  brandKeywords: '',
  competitorHandles: '',
  logoPath: '',
}

export default function BrandAssistant({ onUseContent, onGoToImageStudio }: Props) {
  const [profile, setProfile] = useState<BrandProfile>(defaultProfile)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Generator state
  const [contentType, setContentType] = useState(CONTENT_TYPES[0])
  const [platform, setPlatform] = useState('Instagram')
  const [tone, setTone] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch('/api/social/brand-profile')
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setProfile({
            ...defaultProfile,
            ...data,
            primaryColors: data.primaryColors || defaultProfile.primaryColors,
          })
        }
      }
    } catch {
      // Use defaults
    }
  }

  async function saveProfile() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/social/brand-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      // silent fail
    }
    setSaving(false)
  }

  async function generateContent() {
    setGenerating(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/social/brand-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          platform,
          tone: tone || profile.brandVoice || 'Professional',
          sourceText,
        }),
      })
      const data = await res.json()
      if (data.variations) {
        setResult(data)
      } else {
        setError(data.error || 'Generation failed')
      }
    } catch {
      setError('Request failed')
    }
    setGenerating(false)
  }

  function updateColor(idx: number, value: string) {
    const colors = [...profile.primaryColors]
    colors[idx] = value
    setProfile({ ...profile, primaryColors: colors })
  }

  return (
    <div className="space-y-6">
      {/* Brand Profile Card */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette className="w-5 h-5 text-[#F813BE]" />
          <h2 className="text-white font-semibold">Brand Profile</h2>
          <span className="text-[#555] text-xs ml-auto">Saved to database for all AI generations</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Business Name</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F813BE]"
            />
          </div>
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Tagline</label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F813BE]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Brand Voice</label>
            <select
              value={profile.brandVoice}
              onChange={(e) => setProfile({ ...profile, brandVoice: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F813BE]"
            >
              {VOICE_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Primary Colors</label>
            <div className="flex gap-2">
              {profile.primaryColors.map((color, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(i, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-[#333] bg-transparent"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(i, e.target.value)}
                    className="w-20 bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-[#888] text-xs focus:outline-none focus:border-[#F813BE]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-[#666] block mb-1.5">Target Audience</label>
          <input
            type="text"
            value={profile.targetAudience}
            onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })}
            placeholder="e.g. Small business owners in Sarasota, FL looking for digital marketing solutions"
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-[#666] block mb-1.5">Key Services / Products</label>
          <textarea
            value={profile.keyServices}
            onChange={(e) => setProfile({ ...profile, keyServices: e.target.value })}
            rows={2}
            placeholder="e.g. Web design, SEO, social media marketing, PPC advertising, web hosting, AI-powered marketing"
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE] resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Brand Keywords (comma-separated)</label>
            <input
              type="text"
              value={profile.brandKeywords}
              onChange={(e) => setProfile({ ...profile, brandKeywords: e.target.value })}
              placeholder="professional, results-driven, innovative, Florida"
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
            />
          </div>
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Competitor Handles (optional)</label>
            <input
              type="text"
              value={profile.competitorHandles}
              onChange={(e) => setProfile({ ...profile, competitorHandles: e.target.value })}
              placeholder="@competitor1, @competitor2"
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Brand Profile
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" /> Saved!
            </span>
          )}
        </div>
      </div>

      {/* Content Generator */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-[#14EAEA]" />
          <h2 className="text-white font-semibold">Promotional Content Generator</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#14EAEA]"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#14EAEA]"
            >
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Tone Override (optional)</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#14EAEA]"
            >
              <option value="">Use Brand Voice ({profile.brandVoice || 'Professional'})</option>
              {VOICE_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-[#666] block mb-1.5">Reference URL or Text (optional)</label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={2}
            placeholder="Paste a URL, client review, case study notes, or any content to base the post on..."
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#14EAEA] resize-none"
          />
        </div>

        <button
          onClick={generateContent}
          disabled={generating}
          className="flex items-center gap-2 bg-[#14EAEA] hover:bg-[#11cccc] text-[#0A0A0A] px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? 'Generating...' : 'Generate Branded Content'}
        </button>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Caption Variations */}
          {result.variations.map((v, i) => (
            <div key={i} className="bg-[#141414] border border-[#222] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#14EAEA] text-xs font-medium uppercase tracking-wider">
                  {v.length} caption
                </span>
                <button
                  onClick={() => onUseContent({ caption: v.caption, hashtags: v.hashtags, imagePrompt: result.imagePrompt })}
                  className="flex items-center gap-1.5 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Use This
                </button>
              </div>
              <p className="text-[#ccc] text-sm leading-relaxed mb-2">{v.caption}</p>
              <p className="text-[#14EAEA] text-xs">{v.hashtags}</p>
            </div>
          ))}

          {/* Image Prompt Suggestion */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#F813BE]" />
                <span className="text-white text-sm font-medium">Suggested Image Prompt</span>
              </div>
              <button
                onClick={() => onGoToImageStudio(result.imagePrompt)}
                className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Open in Image Studio
              </button>
            </div>
            <p className="text-[#888] text-sm leading-relaxed">{result.imagePrompt}</p>
          </div>

          {/* Best Time */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#14EAEA]" />
              <span className="text-white text-sm font-medium">Best Time to Post</span>
            </div>
            <p className="text-[#888] text-sm">{result.bestTimeToPost}</p>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import {
  Layers, Film, Sparkles, Loader2, Save, ImageIcon,
  ChevronLeft, ChevronRight, Music, Video, Type
} from 'lucide-react'

interface Slide {
  slideNumber: number
  type: 'cover' | 'content' | 'cta'
  headline: string
  body: string
  imagePrompt: string
}

interface CarouselResult {
  slides: Slide[]
  caption: string
  hashtags: string
}

interface ReelSegment {
  startTime: number
  endTime: number
  type: 'hook' | 'content' | 'cta'
  spokenText: string
  onScreenText: string
  bRollSuggestion: string
}

interface ReelResult {
  segments: ReelSegment[]
  suggestedAudio: string
  caption: string
  hashtags: string
}

interface Props {
  onSaveAsPost: (data: {
    caption: string
    hashtags: string
    postType: string
    carouselSlides?: Slide[]
  }) => void
  onGenerateImages?: (prompts: string[]) => void
}

export default function CarouselBuilder({ onSaveAsPost, onGenerateImages }: Props) {
  const [mode, setMode] = useState<'carousel' | 'reel'>('carousel')

  // Carousel state
  const [carouselTopic, setCarouselTopic] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [slideCount, setSlideCount] = useState(5)
  const [carouselResult, setCarouselResult] = useState<CarouselResult | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [generatingCarousel, setGeneratingCarousel] = useState(false)

  // Reel state
  const [reelTopic, setReelTopic] = useState('')
  const [hookStyle, setHookStyle] = useState('Question')
  const [duration, setDuration] = useState(30)
  const [reelResult, setReelResult] = useState<ReelResult | null>(null)
  const [generatingReel, setGeneratingReel] = useState(false)

  const [saving, setSaving] = useState(false)

  async function generateCarousel() {
    if (!carouselTopic.trim()) return
    setGeneratingCarousel(true)
    setCarouselResult(null)
    try {
      const res = await fetch('/api/social/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: carouselTopic, sourceText, slideCount }),
      })
      const data = await res.json()
      if (data.slides) {
        setCarouselResult(data)
        setCurrentSlide(0)
      }
    } catch { /* ignore */ }
    setGeneratingCarousel(false)
  }

  async function generateReel() {
    if (!reelTopic.trim()) return
    setGeneratingReel(true)
    setReelResult(null)
    try {
      const res = await fetch('/api/social/reel-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: reelTopic, hookStyle, duration }),
      })
      const data = await res.json()
      if (data.segments) {
        setReelResult(data)
      }
    } catch { /* ignore */ }
    setGeneratingReel(false)
  }

  async function saveCarouselAsPost() {
    if (!carouselResult) return
    setSaving(true)
    try {
      const res = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: carouselResult.caption,
          hashtags: carouselResult.hashtags,
          platforms: ['instagram'],
          status: 'DRAFT',
          postType: 'CAROUSEL',
          carouselSlides: carouselResult.slides,
        }),
      })
      if (res.ok) {
        onSaveAsPost({
          caption: carouselResult.caption,
          hashtags: carouselResult.hashtags,
          postType: 'CAROUSEL',
          carouselSlides: carouselResult.slides,
        })
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function saveReelAsPost() {
    if (!reelResult) return
    setSaving(true)
    try {
      const res = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: reelResult.caption,
          hashtags: reelResult.hashtags,
          platforms: ['instagram'],
          status: 'DRAFT',
          postType: 'REEL',
        }),
      })
      if (res.ok) {
        onSaveAsPost({
          caption: reelResult.caption,
          hashtags: reelResult.hashtags,
          postType: 'REEL',
        })
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  const slideTypeColors: Record<string, string> = {
    cover: '#F813BE',
    content: '#14EAEA',
    cta: '#B9FF33',
  }

  const segmentTypeColors: Record<string, string> = {
    hook: '#F813BE',
    content: '#14EAEA',
    cta: '#B9FF33',
  }

  return (
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div className="flex gap-2 bg-[#1A1A1A] rounded-xl p-1 w-fit">
        <button
          onClick={() => setMode('carousel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'carousel' ? 'bg-[#F813BE] text-white' : 'text-[#666] hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Carousel Builder
        </button>
        <button
          onClick={() => setMode('reel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'reel' ? 'bg-[#F813BE] text-white' : 'text-[#666] hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          Reel Script Builder
        </button>
      </div>

      {mode === 'carousel' ? (
        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          {/* Left: Input */}
          <div className="space-y-5">
            <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Layers className="w-5 h-5 text-[#F813BE]" />
                <h2 className="text-white font-semibold">Carousel Builder</h2>
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#666] block mb-1.5">Topic</label>
                <input
                  type="text"
                  value={carouselTopic}
                  onChange={(e) => setCarouselTopic(e.target.value)}
                  placeholder="e.g. 5 signs your website needs a redesign"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#666] block mb-1.5">Source Text or URL (optional)</label>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  rows={3}
                  placeholder="Paste a blog post, article, or URL to base the carousel on..."
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE] resize-none"
                />
              </div>

              <div className="mb-5">
                <label className="text-xs text-[#666] block mb-1.5">Slide Count</label>
                <div className="flex gap-2">
                  {[3, 5, 7, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSlideCount(n)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        slideCount === n
                          ? 'bg-[#14EAEA]/20 border border-[#14EAEA]/40 text-[#14EAEA]'
                          : 'bg-[#1A1A1A] border border-[#333] text-[#666] hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateCarousel}
                disabled={generatingCarousel || !carouselTopic.trim()}
                className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {generatingCarousel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Carousel
              </button>
            </div>

            {/* Generated caption & hashtags */}
            {carouselResult && (
              <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-3">
                <div>
                  <label className="text-xs text-[#666] block mb-1">Caption</label>
                  <p className="text-white text-sm leading-relaxed">{carouselResult.caption}</p>
                </div>
                <div>
                  <label className="text-xs text-[#666] block mb-1">Hashtags</label>
                  <p className="text-[#14EAEA] text-sm">{carouselResult.hashtags}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  {onGenerateImages && (
                    <button
                      onClick={() => onGenerateImages(carouselResult.slides.map((s) => s.imagePrompt))}
                      className="flex items-center gap-2 bg-[#14EAEA]/20 hover:bg-[#14EAEA]/30 border border-[#14EAEA]/40 text-[#14EAEA] px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Generate Images
                    </button>
                  )}
                  <button
                    onClick={saveCarouselAsPost}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save as Post
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Slide Preview */}
          <div>
            {carouselResult ? (
              <div className="bg-[#141414] border border-[#222] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-sm font-medium">Slide Preview</h3>
                  <span className="text-[#666] text-xs">
                    {currentSlide + 1} / {carouselResult.slides.length}
                  </span>
                </div>

                {/* Slide Card */}
                <div
                  className="rounded-xl p-6 min-h-[380px] flex flex-col justify-center text-center relative"
                  style={{
                    background: `linear-gradient(135deg, #0F0F0F 0%, ${slideTypeColors[carouselResult.slides[currentSlide].type]}15 100%)`,
                    border: `1px solid ${slideTypeColors[carouselResult.slides[currentSlide].type]}40`,
                  }}
                >
                  <span
                    className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full font-medium uppercase"
                    style={{
                      backgroundColor: slideTypeColors[carouselResult.slides[currentSlide].type] + '20',
                      color: slideTypeColors[carouselResult.slides[currentSlide].type],
                    }}
                  >
                    {carouselResult.slides[currentSlide].type}
                  </span>
                  <h3 className="text-white text-xl font-bold mb-3 leading-tight">
                    {carouselResult.slides[currentSlide].headline}
                  </h3>
                  {carouselResult.slides[currentSlide].body && (
                    <p className="text-[#999] text-sm leading-relaxed">
                      {carouselResult.slides[currentSlide].body}
                    </p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                    className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-[#999] transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1.5">
                    {carouselResult.slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentSlide ? 'bg-[#F813BE] w-4' : 'bg-[#333]'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentSlide(Math.min(carouselResult.slides.length - 1, currentSlide + 1))}
                    disabled={currentSlide === carouselResult.slides.length - 1}
                    className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-[#999] transition-colors disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Image prompt preview */}
                <div className="mt-4 p-3 bg-[#0A0A0A] rounded-lg">
                  <p className="text-[#555] text-xs mb-1">Image Prompt:</p>
                  <p className="text-[#888] text-xs italic">{carouselResult.slides[currentSlide].imagePrompt}</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#141414] border border-[#222] rounded-xl p-8 text-center">
                <Layers className="w-10 h-10 mx-auto mb-3 text-[#333]" />
                <p className="text-[#555] text-sm">Enter a topic and generate to preview slides</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* REEL MODE */
        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          {/* Left: Input */}
          <div className="space-y-5">
            <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Film className="w-5 h-5 text-[#F813BE]" />
                <h2 className="text-white font-semibold">Reel Script Builder</h2>
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#666] block mb-1.5">Topic</label>
                <input
                  type="text"
                  value={reelTopic}
                  onChange={(e) => setReelTopic(e.target.value)}
                  placeholder="e.g. Why your business needs a website in 2026"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#666] block mb-1.5">Hook Style</label>
                <div className="flex gap-2 flex-wrap">
                  {['Question', 'Bold Statement', 'Statistic', 'Story'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setHookStyle(style)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        hookStyle === style
                          ? 'bg-[#F813BE]/20 border border-[#F813BE]/40 text-[#F813BE]'
                          : 'bg-[#1A1A1A] border border-[#333] text-[#666] hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs text-[#666] block mb-1.5">Duration</label>
                <div className="flex gap-2">
                  {[15, 30, 60].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        duration === d
                          ? 'bg-[#14EAEA]/20 border border-[#14EAEA]/40 text-[#14EAEA]'
                          : 'bg-[#1A1A1A] border border-[#333] text-[#666] hover:text-white'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateReel}
                disabled={generatingReel || !reelTopic.trim()}
                className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {generatingReel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Reel Script
              </button>
            </div>

            {/* Audio & caption info */}
            {reelResult && (
              <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#F813BE]" />
                  <label className="text-xs text-[#666]">Suggested Audio</label>
                </div>
                <p className="text-white text-sm">{reelResult.suggestedAudio}</p>
                <div>
                  <label className="text-xs text-[#666] block mb-1">Caption</label>
                  <p className="text-white text-sm leading-relaxed">{reelResult.caption}</p>
                </div>
                <div>
                  <label className="text-xs text-[#666] block mb-1">Hashtags</label>
                  <p className="text-[#14EAEA] text-sm">{reelResult.hashtags}</p>
                </div>
                <button
                  onClick={saveReelAsPost}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save as Post
                </button>
              </div>
            )}
          </div>

          {/* Right: Timeline Preview */}
          <div>
            {reelResult ? (
              <div className="bg-[#141414] border border-[#222] rounded-xl p-4">
                <h3 className="text-white text-sm font-medium mb-4">Script Timeline</h3>
                <div className="space-y-0">
                  {reelResult.segments.map((seg, i) => (
                    <div key={i} className="relative pl-8 pb-5 last:pb-0">
                      {/* Timeline line */}
                      {i < reelResult.segments.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[#333]" />
                      )}
                      {/* Dot */}
                      <div
                        className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: segmentTypeColors[seg.type] + '20',
                          color: segmentTypeColors[seg.type],
                          border: `1px solid ${segmentTypeColors[seg.type]}40`,
                        }}
                      >
                        {seg.startTime}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-1.5 py-0.5 rounded uppercase font-medium"
                            style={{
                              backgroundColor: segmentTypeColors[seg.type] + '20',
                              color: segmentTypeColors[seg.type],
                            }}
                          >
                            {seg.type}
                          </span>
                          <span className="text-[#555] text-xs">{seg.startTime}s–{seg.endTime}s</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Type className="w-3 h-3 text-[#555] mt-0.5 shrink-0" />
                          <p className="text-white text-xs leading-relaxed">{seg.onScreenText}</p>
                        </div>
                        <p className="text-[#888] text-xs italic">&ldquo;{seg.spokenText}&rdquo;</p>
                        <div className="flex items-start gap-1.5">
                          <Video className="w-3 h-3 text-[#555] mt-0.5 shrink-0" />
                          <p className="text-[#555] text-xs">{seg.bRollSuggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#141414] border border-[#222] rounded-xl p-8 text-center">
                <Film className="w-10 h-10 mx-auto mb-3 text-[#333]" />
                <p className="text-[#555] text-sm">Enter a topic and generate to preview the script timeline</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

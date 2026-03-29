'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Pencil,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react'

interface TrendingTopic {
  topic: string
  why: string
  angle: string
}

interface ContentIdea {
  hook: string
  caption: string
  hashtags: string
}

interface ImageProvider {
  provider: string
  label: string
  models: { id: string; provider: string; label: string; desc: string; cost: string }[]
}

const STEPS = [
  { num: 1, label: 'Topic' },
  { num: 2, label: 'Content Idea' },
  { num: 3, label: 'Image Prompt' },
  { num: 4, label: 'Generate Image' },
  { num: 5, label: 'Build & Schedule' },
]

export default function PostBuilder({ onGoToCalendar }: { onGoToCalendar?: () => void }) {
  const [step, setStep] = useState(1)

  // Step 1
  const [topic, setTopic] = useState('')
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [loadingTrending, setLoadingTrending] = useState(false)

  // Step 2
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [selectedIdeaIdx, setSelectedIdeaIdx] = useState<number | null>(null)
  const [customIdea, setCustomIdea] = useState('')
  const [loadingIdeas, setLoadingIdeas] = useState(false)

  // Step 3
  const [imagePrompt, setImagePrompt] = useState('')
  const [loadingPrompt, setLoadingPrompt] = useState(false)
  const [imageProviders, setImageProviders] = useState<ImageProvider[]>([])
  const [selectedModel, setSelectedModel] = useState('')

  // Step 4
  const [generatedImage, setGeneratedImage] = useState('')
  const [loadingImage, setLoadingImage] = useState(false)

  // Step 5
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [improvingCaption, setImprovingCaption] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Fetch trending topics
  async function fetchTrending() {
    setLoadingTrending(true)
    try {
      const res = await fetch('/api/social/trending-topics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      if (res.ok) {
        const data = await res.json()
        setTrendingTopics(data.topics || [])
      }
    } catch { /* ignore */ }
    setLoadingTrending(false)
  }

  // Fetch content ideas
  const fetchIdeas = useCallback(async () => {
    if (!topic) return
    setLoadingIdeas(true)
    setSelectedIdeaIdx(null)
    setCustomIdea('')
    try {
      const res = await fetch('/api/social/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })
      if (res.ok) {
        const data = await res.json()
        setIdeas((data.ideas || []).slice(0, 3))
      }
    } catch { /* ignore */ }
    setLoadingIdeas(false)
  }, [topic])

  // Fetch suggested image prompt
  const fetchSuggestedPrompt = useCallback(async () => {
    setLoadingPrompt(true)
    const ideaContext = selectedIdeaIdx !== null && ideas[selectedIdeaIdx]
      ? `Hook: ${ideas[selectedIdeaIdx].hook}. ${ideas[selectedIdeaIdx].caption}`
      : customIdea
    try {
      const res = await fetch('/api/social/suggest-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, idea: ideaContext }),
      })
      if (res.ok) {
        const data = await res.json()
        setImagePrompt(data.prompt || '')
      }
    } catch { /* ignore */ }
    setLoadingPrompt(false)
  }, [topic, selectedIdeaIdx, ideas, customIdea])

  // Fetch available image providers
  useEffect(() => {
    fetch('/api/social/available-models')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.imageProviders) {
          setImageProviders(data.imageProviders)
          if (data.imageProviders.length > 0 && data.imageProviders[0].models.length > 0) {
            setSelectedModel(`${data.imageProviders[0].models[0].provider}:${data.imageProviders[0].models[0].id}`)
          }
        }
      })
      .catch(() => {})
  }, [])

  // Auto-fetch ideas when entering step 2
  useEffect(() => {
    if (step === 2 && ideas.length === 0) fetchIdeas()
  }, [step, ideas.length, fetchIdeas])

  // Auto-fetch prompt when entering step 3
  useEffect(() => {
    if (step === 3 && !imagePrompt) fetchSuggestedPrompt()
  }, [step, imagePrompt, fetchSuggestedPrompt])

  // Generate image
  async function generateImage() {
    setLoadingImage(true)
    setGeneratedImage('')
    const [provider, modelId] = selectedModel.split(':')
    try {
      const res = await fetch('/api/social/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, provider, model: modelId }),
      })
      if (res.ok) {
        const data = await res.json()
        setGeneratedImage(data.imagePath || data.url || '')
      }
    } catch { /* ignore */ }
    setLoadingImage(false)
  }

  // Auto-generate when entering step 4
  useEffect(() => {
    if (step === 4 && !generatedImage && !loadingImage) generateImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Pre-fill caption on step 5
  useEffect(() => {
    if (step === 5 && !caption) {
      if (selectedIdeaIdx !== null && ideas[selectedIdeaIdx]) {
        setCaption(ideas[selectedIdeaIdx].caption)
        setHashtags(ideas[selectedIdeaIdx].hashtags)
      } else if (customIdea) {
        setCaption(customIdea)
      }
    }
  }, [step, caption, selectedIdeaIdx, ideas, customIdea])

  async function improveCaption() {
    setImprovingCaption(true)
    try {
      const res = await fetch('/api/social/improve-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      })
      if (res.ok) {
        const data = await res.json()
        setCaption(data.caption || caption)
      }
    } catch { /* ignore */ }
    setImprovingCaption(false)
  }

  async function saveAsDraft() {
    setSaving(true)
    try {
      const res = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic,
          caption,
          hashtags,
          mediaPath: generatedImage,
          status: 'DRAFT',
          platforms: ['instagram', 'facebook'],
        }),
      })
      if (res.ok) setSaved(true)
    } catch { /* ignore */ }
    setSaving(false)
  }

  function canGoNext(): boolean {
    switch (step) {
      case 1: return topic.trim().length > 0
      case 2: return selectedIdeaIdx !== null || customIdea.trim().length > 0
      case 3: return imagePrompt.trim().length > 0
      case 4: return generatedImage.length > 0
      default: return false
    }
  }

  function goNext() {
    if (step < 5 && canGoNext()) setStep(step + 1)
  }

  function goBack() {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s.num
                    ? 'bg-[#14EAEA] text-[#0A0A0A]'
                    : step === s.num
                    ? 'bg-[#F813BE] text-white'
                    : 'bg-[#1A1A1A] text-[#555] border border-[#333]'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[10px] mt-1.5 font-medium ${step >= s.num ? 'text-white' : 'text-[#555]'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 sm:w-20 h-px mx-2 ${step > s.num ? 'bg-[#14EAEA]' : 'bg-[#333]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-[#282828] p-6 sm:p-8 min-h-[360px]">
        {/* STEP 1 — Topic */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">What&apos;s this post about?</h2>
            <p className="text-[#666] text-sm mb-6">Enter a topic or find what&apos;s trending.</p>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Spring SEO tips for local businesses"
              className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:border-[#14EAEA] focus:outline-none transition-colors"
            />

            <button
              onClick={fetchTrending}
              disabled={loadingTrending}
              className="mt-4 flex items-center gap-2 text-sm text-[#14EAEA] hover:text-white transition-colors disabled:opacity-50"
            >
              {loadingTrending ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              Find Trending Topics
            </button>

            {trendingTopics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingTopics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setTopic(t.topic)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      topic === t.topic
                        ? 'border-[#14EAEA] bg-[#14EAEA]/10 text-[#14EAEA]'
                        : 'border-[#333] text-[#999] hover:border-[#555] hover:text-white'
                    }`}
                    title={t.why}
                  >
                    {t.topic}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — Content Idea */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Pick a content angle</h2>
            <p className="text-[#666] text-sm mb-6">Choose an AI-generated idea or write your own.</p>

            {loadingIdeas ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#F813BE]" />
                <span className="ml-3 text-[#666]">Generating ideas...</span>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {ideas.map((idea, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedIdeaIdx(i); setCustomIdea('') }}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedIdeaIdx === i
                          ? 'border-[#F813BE] bg-[#F813BE]/5'
                          : 'border-[#282828] bg-[#141414] hover:border-[#444]'
                      }`}
                    >
                      <p className="text-white font-semibold text-sm mb-1">{idea.hook}</p>
                      <p className="text-[#888] text-xs leading-relaxed line-clamp-2">{idea.caption}</p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={fetchIdeas}
                  className="flex items-center gap-1.5 text-xs text-[#14EAEA] hover:text-white transition-colors mb-4"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>

                <textarea
                  value={customIdea}
                  onChange={(e) => { setCustomIdea(e.target.value); setSelectedIdeaIdx(null) }}
                  placeholder="Or type your own idea..."
                  rows={2}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#14EAEA] focus:outline-none transition-colors resize-none"
                />
              </>
            )}
          </div>
        )}

        {/* STEP 3 — Image Prompt */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Describe your image</h2>
            <p className="text-[#666] text-sm mb-6">Edit the AI-suggested prompt or write your own.</p>

            {loadingPrompt ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#14EAEA]" />
                <span className="ml-3 text-[#666]">Generating prompt...</span>
              </div>
            ) : (
              <>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#14EAEA] focus:outline-none transition-colors resize-none mb-4"
                />

                <div>
                  <label className="text-[#888] text-xs font-medium block mb-2">Image Provider</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:border-[#14EAEA] focus:outline-none transition-colors"
                  >
                    {imageProviders.map((prov) =>
                      prov.models.map((m) => (
                        <option key={`${m.provider}:${m.id}`} value={`${m.provider}:${m.id}`}>
                          {prov.label} — {m.label} ({m.cost})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4 — Generate Image */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Your image</h2>
            <p className="text-[#666] text-sm mb-6">AI-generated from your prompt.</p>

            {loadingImage ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#F813BE] mb-3" />
                <span className="text-[#666] text-sm">Generating image...</span>
              </div>
            ) : generatedImage ? (
              <div>
                <div className="rounded-xl overflow-hidden border border-[#282828] mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={generatedImage} alt="Generated" className="w-full object-contain max-h-[400px]" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={generateImage}
                    className="flex items-center gap-1.5 text-xs text-[#14EAEA] hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  <button
                    onClick={() => { setStep(3); setGeneratedImage('') }}
                    className="flex items-center gap-1.5 text-xs text-[#F813BE] hover:text-white transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit Prompt
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-[#555]">
                <ImageIcon className="w-10 h-10 mb-3" />
                <p className="text-sm">Failed to generate. Try again.</p>
                <button
                  onClick={generateImage}
                  className="mt-3 flex items-center gap-1.5 text-xs text-[#14EAEA] hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 5 — Build & Schedule */}
        {step === 5 && (
          <div>
            {saved ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-14 h-14 rounded-full bg-[#14EAEA]/10 flex items-center justify-center mb-4">
                  <Check className="w-7 h-7 text-[#14EAEA]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Post saved!</h2>
                <p className="text-[#888] text-sm mb-4">Your draft is ready in the calendar.</p>
                {onGoToCalendar && (
                  <button
                    onClick={onGoToCalendar}
                    className="flex items-center gap-2 text-sm text-[#F813BE] hover:text-white transition-colors"
                  >
                    <Calendar className="w-4 h-4" /> View in Calendar →
                  </button>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-1">Build your post</h2>
                <p className="text-[#666] text-sm mb-6">Review and finalize before saving.</p>

                <div className="flex gap-4 mb-5">
                  {generatedImage && (
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-[#282828]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={generatedImage} alt="Post" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <label className="text-[#888] text-xs font-medium block mb-1.5">Caption</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      rows={4}
                      className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#14EAEA] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-[#888] text-xs font-medium block mb-1.5">Hashtags</label>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#webdesign #seo #sarasota"
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#14EAEA] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={improveCaption}
                    disabled={improvingCaption || !caption}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-[#333] text-[#14EAEA] hover:bg-[#14EAEA]/10 transition-colors disabled:opacity-40"
                  >
                    {improvingCaption ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Improve Caption
                  </button>

                  <button
                    onClick={saveAsDraft}
                    disabled={saving || !caption}
                    className="flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-semibold bg-[#F813BE] text-white hover:bg-[#d10fa3] transition-colors disabled:opacity-40 ml-auto"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save as Draft
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {!(step === 5 && saved) && (
        <div className="flex justify-between mt-6">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm text-[#888] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < 5 && (
            <button
              onClick={goNext}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#F813BE] text-white hover:bg-[#d10fa3] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

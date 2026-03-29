'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  Tag,
  Zap,
  Star,
  Crown,
  Dice5,
  Upload,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import Image from 'next/image'
import { useAvailableModels, type ImageModel } from '@/hooks/useAvailableModels'

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

interface BrandAsset {
  id: string
  filename: string
  filepath: string
  altText: string | null
  assetType: string
  clientName: string | null
}

interface BrandProfile {
  businessName: string
  tagline: string
  brandVoice: string
  primaryColors: string[]
  targetAudience: string
  keyServices: string
}

const STEPS = [
  { num: 1, label: 'Topic' },
  { num: 2, label: 'Content Idea' },
  { num: 3, label: 'Image Prompt' },
  { num: 4, label: 'Generate Image' },
  { num: 5, label: 'Build & Schedule' },
]

const ASPECT_RATIOS = [
  { value: '4:5', label: '4:5 Portrait' },
  { value: '1:1', label: '1:1 Square' },
  { value: '9:16', label: '9:16 Story' },
  { value: '16:9', label: '16:9 Landscape' },
]

const COST_TIER_ICONS: Record<string, typeof Zap> = {
  Free: Zap,
  Fast: Zap,
  Standard: Star,
  Premium: Crown,
}

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

  // Step 3 — Smart Prompt Builder
  const [imagePrompt, setImagePrompt] = useState('')
  const [loadingPrompt, setLoadingPrompt] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')
  const [aspectRatio, setAspectRatio] = useState('4:5')
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([])
  const [enabledAssetIds, setEnabledAssetIds] = useState<Set<string>>(new Set())
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null)
  const [referenceUrls, setReferenceUrls] = useState<string[]>([])

  // Step 4
  const [generatedImage, setGeneratedImage] = useState('')
  const [loadingImage, setLoadingImage] = useState(false)

  // Step 5
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [improvingCaption, setImprovingCaption] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Manual mode — skip AI steps, go straight to compose
  const [manualMode, setManualMode] = useState(false)
  const [manualImage, setManualImage] = useState('')
  const manualFileRef = useRef<HTMLInputElement>(null)

  // I'm Feeling Lucky
  const [luckyRunning, setLuckyRunning] = useState(false)
  const [luckyStep, setLuckyStep] = useState('')

  const { imageProviders } = useAvailableModels()

  // Auto-select first model
  useEffect(() => {
    if (imageProviders.length > 0 && !selectedModelId) {
      const first = imageProviders[0].models[0]
      if (first) {
        setSelectedProvider(first.provider)
        setSelectedModelId(first.id)
      }
    }
  }, [imageProviders, selectedModelId])

  // Fetch brand assets + profile on mount
  useEffect(() => {
    fetchBrandAssets()
    fetchBrandProfile()
  }, [])

  async function fetchBrandAssets() {
    try {
      const res = await fetch('/api/social/brand-assets')
      if (res.ok) {
        const data: BrandAsset[] = await res.json()
        setBrandAssets(data)
        // Enable all assets by default
        setEnabledAssetIds(new Set(data.map((a) => a.id)))
      }
    } catch { /* silent */ }
  }

  async function fetchBrandProfile() {
    try {
      const res = await fetch('/api/social/brand-profile')
      if (res.ok) {
        const data = await res.json()
        if (data) setBrandProfile(data)
      }
    } catch { /* silent */ }
  }

  // Get the selected content idea text
  function getSelectedIdeaText(): string {
    if (selectedIdeaIdx !== null && ideas[selectedIdeaIdx]) {
      return `${ideas[selectedIdeaIdx].hook}. ${ideas[selectedIdeaIdx].caption}`
    }
    return customIdea
  }

  // Find current model
  const currentModel: ImageModel | undefined = imageProviders
    .flatMap((g) => g.models)
    .find((m) => m.id === selectedModelId && m.provider === selectedProvider)

  // Map asset type names to prompt builder types
  function mapAssetType(assetType: string): string {
    const map: Record<string, string> = {
      Scout: 'character',
      Logo: 'logo',
      Product: 'product',
      Background: 'background',
      Other: 'style',
    }
    return map[assetType] || 'style'
  }

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

  // Smart prompt builder — calls /api/social/build-prompt
  const buildSmartPrompt = useCallback(async () => {
    setLoadingPrompt(true)
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''

    // Collect enabled brand assets
    const enabledAssets = brandAssets
      .filter((a) => enabledAssetIds.has(a.id))
      .map((a) => ({
        url: `${siteUrl}${a.filepath}`,
        type: mapAssetType(a.assetType),
        name: a.filename,
      }))

    try {
      const res = await fetch('/api/social/build-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentIdea: getSelectedIdeaText(),
          brandAssets: enabledAssets,
          brandProfile: brandProfile ? {
            colors: brandProfile.primaryColors || [],
            tone: brandProfile.brandVoice || 'Professional',
            industry: 'Digital Marketing',
            name: brandProfile.businessName || 'Webink Solutions',
          } : { colors: [], tone: 'Professional', industry: '', name: '' },
          model: selectedModelId,
          aspectRatio,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setImagePrompt(data.prompt || '')
        setReferenceUrls(data.referenceImageUrls || [])
      }
    } catch { /* ignore */ }
    setLoadingPrompt(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, selectedIdeaIdx, ideas, customIdea, brandAssets, enabledAssetIds, brandProfile, selectedModelId, aspectRatio])

  // Auto-fetch ideas when entering step 2
  useEffect(() => {
    if (step === 2 && ideas.length === 0) fetchIdeas()
  }, [step, ideas.length, fetchIdeas])

  // Auto-build prompt when entering step 3
  useEffect(() => {
    if (step === 3 && !imagePrompt) buildSmartPrompt()
  }, [step, imagePrompt, buildSmartPrompt])

  // Generate image
  async function generateImage() {
    setLoadingImage(true)
    setGeneratedImage('')
    try {
      const res = await fetch('/api/social/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          provider: selectedProvider,
          model: selectedModelId,
          referenceImageUrls: referenceUrls.length > 0 ? referenceUrls : undefined,
          aspectRatio,
        }),
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

  function toggleAsset(id: string) {
    setEnabledAssetIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function feelingLucky() {
    setLuckyRunning(true)
    try {
      // Step 1: Fetch trending topics
      setLuckyStep('Finding trending topics...')
      const trendRes = await fetch('/api/social/trending-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      let luckyTopic = 'Digital marketing tips for small businesses'
      if (trendRes.ok) {
        const trendData = await trendRes.json()
        const topics = trendData.topics || []
        if (topics.length > 0) {
          const pick = topics[Math.floor(Math.random() * topics.length)]
          luckyTopic = pick.topic
        }
      }
      setTopic(luckyTopic)

      // Step 2: Generate content idea
      setLuckyStep('Generating content idea...')
      const ideaRes = await fetch('/api/social/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: luckyTopic }),
      })
      let luckyIdea: ContentIdea | null = null
      if (ideaRes.ok) {
        const ideaData = await ideaRes.json()
        const allIdeas = (ideaData.ideas || []) as ContentIdea[]
        if (allIdeas.length > 0) {
          luckyIdea = allIdeas[Math.floor(Math.random() * Math.min(allIdeas.length, 3))]
          setIdeas(allIdeas.slice(0, 3))
          setSelectedIdeaIdx(0)
        }
      }

      // Step 3: Build image prompt
      setLuckyStep('Building image prompt...')
      const ideaText = luckyIdea ? `${luckyIdea.hook}. ${luckyIdea.caption}` : luckyTopic
      const promptRes = await fetch('/api/social/suggest-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: luckyTopic, idea: ideaText }),
      })
      let luckyPrompt = ideaText
      if (promptRes.ok) {
        const promptData = await promptRes.json()
        if (promptData.prompt) luckyPrompt = promptData.prompt
      }
      setImagePrompt(luckyPrompt)

      // Step 4: Generate image with FLUX.1 Kontext Pro (default)
      setLuckyStep('Generating image...')
      const imgModel = 'black-forest-labs/FLUX.1-Kontext-pro'
      const imgProvider = 'together'
      setSelectedProvider(imgProvider)
      setSelectedModelId(imgModel)

      const imgRes = await fetch('/api/social/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: luckyPrompt,
          provider: imgProvider,
          model: imgModel,
          aspectRatio,
        }),
      })
      if (imgRes.ok) {
        const imgData = await imgRes.json()
        setGeneratedImage(imgData.imagePath || imgData.url || '')
      }

      // Step 5: Pre-fill caption and jump to Build & Schedule
      setLuckyStep('Compiling post...')
      if (luckyIdea) {
        setCaption(luckyIdea.caption)
        setHashtags(luckyIdea.hashtags)
      }
      setStep(5)
    } catch (err) {
      console.error('Feeling Lucky error:', err)
    }
    setLuckyRunning(false)
    setLuckyStep('')
  }

  async function handleManualImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.results?.[0]?.path) {
        setManualImage(data.results[0].path)
        setGeneratedImage(data.results[0].path)
      }
    } catch { /* silent */ }
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
      {/* Manual Mode Toggle */}
      {!luckyRunning && !saved && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              setManualMode(!manualMode)
              if (!manualMode) setStep(5) // Jump to compose step
              else setStep(1) // Back to step 1
            }}
            className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors"
          >
            {manualMode ? (
              <ToggleRight className="w-5 h-5 text-[#14EAEA]" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
            Manual Mode {manualMode ? '(ON)' : '(OFF)'}
          </button>
          {manualMode && (
            <span className="text-[#555] text-xs">Skip AI steps — compose from scratch</span>
          )}
        </div>
      )}

      {/* Manual Mode — Image Upload */}
      {manualMode && !saved && step === 5 && !generatedImage && (
        <div className="mb-4 p-4 bg-[#141414] border border-[#282828] rounded-xl">
          <label className="text-[#888] text-xs font-medium block mb-2">Upload Image (optional)</label>
          {manualImage ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#282828]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={manualImage} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => { setManualImage(''); setGeneratedImage('') }}
                className="text-xs text-red-400 hover:text-red-300"
              >Remove</button>
            </div>
          ) : (
            <button
              onClick={() => manualFileRef.current?.click()}
              className="flex items-center gap-2 text-sm text-[#14EAEA] hover:text-white bg-[#14EAEA]/10 px-4 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          )}
          <input ref={manualFileRef} type="file" accept="image/*" onChange={handleManualImageUpload} className="hidden" />
        </div>
      )}

      {/* I'm Feeling Lucky */}
      {!luckyRunning && step === 1 && !saved && !manualMode && (
        <button
          onClick={feelingLucky}
          className="w-full mb-6 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#F813BE] to-[#14EAEA] text-white hover:opacity-90 transition-opacity"
        >
          <Dice5 className="w-5 h-5" />
          I&apos;m Feeling Lucky — Auto-Build a Post
        </button>
      )}

      {luckyRunning && (
        <div className="mb-6 p-5 rounded-xl border border-[#282828] bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="w-6 h-6 animate-spin text-[#F813BE]" />
              <Sparkles className="w-3 h-3 text-[#14EAEA] absolute -top-1 -right-1" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Building your post...</p>
              <p className="text-[#14EAEA] text-xs mt-0.5">{luckyStep}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step Indicators — hidden in manual mode */}
      {!manualMode && <div className="flex items-center justify-between mb-10">
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
      </div>}

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

        {/* STEP 3 — Smart Image Prompt */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Image prompt</h2>
            <p className="text-[#666] text-sm mb-6">Smart-built from your topic, idea, and brand assets.</p>

            {loadingPrompt ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#14EAEA]" />
                <span className="ml-3 text-[#666]">Building smart prompt...</span>
              </div>
            ) : (
              <>
                {/* Editable prompt */}
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#14EAEA] focus:outline-none transition-colors resize-none mb-4"
                />

                {/* Brand assets toggle */}
                {brandAssets.length > 0 && (
                  <div className="mb-4">
                    <label className="text-[#888] text-xs font-medium block mb-2">
                      Brand Assets as References
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {brandAssets.map((asset) => {
                        const enabled = enabledAssetIds.has(asset.id)
                        return (
                          <button
                            key={asset.id}
                            onClick={() => toggleAsset(asset.id)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                              enabled
                                ? 'border-[#14EAEA] ring-1 ring-[#14EAEA]/30'
                                : 'border-[#333] opacity-50'
                            }`}
                            style={{ paddingBottom: '100%' }}
                          >
                            <Image
                              src={asset.filepath}
                              alt={asset.altText || asset.filename}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                            <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[8px] px-1 py-0.5 truncate flex items-center gap-0.5">
                              <Tag className="w-2 h-2 text-[#14EAEA]" />
                              <span className="text-[#14EAEA]">{asset.assetType}</span>
                            </span>
                            {enabled && (
                              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#14EAEA] flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-[#0A0A0A]" />
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Reference URL previews */}
                {referenceUrls.length > 0 && (
                  <div className="mb-4 p-3 bg-[#141414] border border-[#282828] rounded-lg">
                    <p className="text-[#888] text-xs mb-2">Reference images that will be sent to the model:</p>
                    <div className="flex gap-2">
                      {referenceUrls.map((url, i) => (
                        <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0A0A0A] border border-[#333]">
                          <Image src={url} alt={`Ref ${i + 1}`} fill className="object-cover" sizes="48px" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model picker */}
                <div className="mb-4">
                  <label className="text-[#888] text-xs font-medium block mb-2">Image Model</label>
                  <div className="space-y-2">
                    {imageProviders.map((group) => (
                      <div key={group.provider}>
                        <p className="text-[#555] text-[10px] uppercase tracking-wider mb-1">{group.label}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {group.models.map((m) => {
                            const isActive = selectedProvider === m.provider && selectedModelId === m.id
                            const CostIcon = COST_TIER_ICONS[m.cost] || Star
                            return (
                              <button
                                key={`${m.provider}-${m.id}`}
                                onClick={() => {
                                  setSelectedProvider(m.provider)
                                  setSelectedModelId(m.id)
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1.5 ${
                                  isActive
                                    ? 'border-[#F813BE] bg-[#F813BE]/10 text-white'
                                    : 'border-[#333] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white'
                                }`}
                              >
                                <CostIcon className="w-3 h-3" />
                                {m.label}
                                {m.supportsReference && (
                                  <span className="text-[8px] bg-[#14EAEA]/20 text-[#14EAEA] px-1 py-0.5 rounded-full">REF</span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aspect ratio */}
                <div className="mb-4">
                  <label className="text-[#888] text-xs font-medium block mb-2">Aspect Ratio</label>
                  <div className="flex gap-2">
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setAspectRatio(r.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          aspectRatio === r.value
                            ? 'bg-[#14EAEA]/20 text-[#14EAEA] border border-[#14EAEA]'
                            : 'bg-[#141414] border border-[#333] text-[#888] hover:border-[#444]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rebuild prompt button */}
                <button
                  onClick={() => { setImagePrompt(''); buildSmartPrompt() }}
                  className="flex items-center gap-1.5 text-xs text-[#14EAEA] hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Rebuild Prompt
                </button>
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
                <span className="text-[#555] text-xs mt-1">
                  Using {currentModel?.label || selectedModelId}
                </span>
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

      {/* Navigation Buttons — hidden in manual mode */}
      {!(step === 5 && saved) && !manualMode && (
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

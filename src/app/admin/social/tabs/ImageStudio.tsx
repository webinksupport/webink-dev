'use client'

import { useState, useEffect, useRef } from 'react'
import { Wand2, Download, ArrowRight, Loader2, ImageIcon, Info, Upload, X, FolderOpen, AlertCircle, Sparkles, Zap, Star, Crown } from 'lucide-react'
import Image from 'next/image'
import { useAvailableModels, type ImageModel } from '@/hooks/useAvailableModels'

interface GeneratedImage {
  url: string
  filename: string
  prompt: string
  model: string
  timestamp: number
}

interface BrandAsset {
  id: string
  filename: string
  filepath: string
  altText: string | null
  assetType: string
  clientName: string | null
}

interface Props {
  onUseImage: (path: string) => void
  initialPrompt?: string
  initialTopic?: string
  initialIdea?: string
}

const ASPECT_RATIOS = [
  { value: '4:5', label: '4:5 Portrait', desc: 'Instagram' },
  { value: '1:1', label: '1:1 Square', desc: 'Feed' },
  { value: '9:16', label: '9:16 Story', desc: 'Stories/Reels' },
  { value: '16:9', label: '16:9 Landscape', desc: 'YouTube/Blog' },
]

const COST_TIER_ICONS: Record<string, typeof Zap> = {
  Free: Zap,
  Fast: Zap,
  Standard: Star,
  Premium: Crown,
}

export default function ImageStudio({ onUseImage, initialPrompt, initialTopic, initialIdea }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt || '')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gallery, setGallery] = useState<GeneratedImage[]>([])
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [showAssetPicker, setShowAssetPicker] = useState(false)
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([])
  const [suggestingPrompt, setSuggestingPrompt] = useState(false)
  const [aspectRatio, setAspectRatio] = useState('4:5')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lightboxImage, setLightboxImage] = useState<GeneratedImage | null>(null)

  const { imageProviders, hasAnyImageKey, loading: modelsLoading } = useAvailableModels()

  // Auto-select first available model
  useEffect(() => {
    if (imageProviders.length > 0 && !selectedModel) {
      const first = imageProviders[0].models[0]
      if (first) {
        setSelectedProvider(first.provider)
        setSelectedModel(first.id)
      }
    }
  }, [imageProviders, selectedModel])

  useEffect(() => {
    fetchBrandAssets()
  }, [])

  const [ideaBanner, setIdeaBanner] = useState<{ topic: string; idea: string } | null>(null)

  // Update prompt if initialPrompt changes
  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt)
  }, [initialPrompt])

  // When arriving from Ideas tab with context, show banner and auto-suggest prompt
  useEffect(() => {
    if (initialTopic || initialIdea) {
      setIdeaBanner({ topic: initialTopic || '', idea: initialIdea || '' })
      // Auto-suggest a prompt based on the idea
      if (!initialPrompt) {
        setSuggestingPrompt(true)
        fetch('/api/social/suggest-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: initialTopic, idea: initialIdea }),
        })
          .then((res) => res.json())
          .then((data) => { if (data.prompt) setPrompt(data.prompt) })
          .catch(() => {})
          .finally(() => setSuggestingPrompt(false))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopic, initialIdea])

  async function fetchBrandAssets() {
    try {
      const res = await fetch('/api/social/brand-assets')
      if (res.ok) setBrandAssets(await res.json())
    } catch { /* silent */ }
  }

  function selectModel(provider: string, id: string) {
    setSelectedProvider(provider)
    setSelectedModel(id)
  }

  // Find current model entry
  const currentModel: ImageModel | undefined = imageProviders
    .flatMap((g) => g.models)
    .find((m) => m.id === selectedModel && m.provider === selectedProvider)

  const currentModelSupportsRef = currentModel?.supportsReference ?? false
  const maxRefs = currentModel?.maxReferenceImages ?? 0

  function selectBrandAsset(asset: BrandAsset) {
    const siteUrl = window.location.origin
    const url = `${siteUrl}${asset.filepath}`
    if (maxRefs <= 1) {
      setReferenceImages([url])
    } else {
      setReferenceImages((prev) => {
        if (prev.includes(url)) return prev
        if (prev.length >= maxRefs) return [...prev.slice(1), url]
        return [...prev, url]
      })
    }
    setShowAssetPicker(false)
  }

  function removeReferenceImage(idx: number) {
    setReferenceImages((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleReferenceUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.results?.[0]?.path) {
      const siteUrl = window.location.origin
      const url = `${siteUrl}${data.results[0].path}`
      if (maxRefs <= 1) {
        setReferenceImages([url])
      } else {
        setReferenceImages((prev) => [...prev, url].slice(0, maxRefs || 4))
      }
    }
  }

  async function suggestPrompt() {
    setSuggestingPrompt(true)
    try {
      const res = await fetch('/api/social/suggest-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: prompt || undefined, topic: initialTopic, idea: initialIdea }),
      })
      const data = await res.json()
      if (data.prompt) setPrompt(data.prompt)
      else setError(data.error || 'Failed to suggest prompt')
    } catch {
      setError('Failed to suggest prompt')
    } finally {
      setSuggestingPrompt(false)
    }
  }

  async function generate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/social/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          provider: selectedProvider,
          referenceImageUrls: referenceImages.length > 0 ? referenceImages : undefined,
          referenceImageUrl: referenceImages[0] || undefined,
          aspectRatio,
        }),
      })
      const data = await res.json()

      if (data.url) {
        setGallery((prev) => [
          { url: data.url, filename: data.filename, prompt, model: data.model, timestamp: Date.now() },
          ...prev,
        ])
      } else {
        setError(data.error || 'Generation failed')
      }
    } catch {
      setError('Request failed')
    } finally {
      setLoading(false)
    }
  }

  function downloadImage(url: string, filename: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  if (modelsLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#666]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading available models...
      </div>
    )
  }

  if (!hasAnyImageKey) {
    return (
      <div className="bg-[#141414] border border-[#222] rounded-xl p-8 text-center">
        <AlertCircle className="w-10 h-10 text-[#F813BE] mx-auto mb-3" />
        <h3 className="text-white font-semibold mb-2">No Image API Keys Configured</h3>
        <p className="text-[#888] text-sm mb-4">
          Add at least one API key (Together AI, Google AI, OpenAI, or xAI) in Admin &rarr; Integrations to enable image generation.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Generator */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5 text-[#F813BE]" />
          <h2 className="text-white font-semibold">AI Image Generation</h2>
          <span className="text-xs text-[#555] ml-auto">
            {ASPECT_RATIOS.find((r) => r.value === aspectRatio)?.label || '4:5 Portrait'}
          </span>
        </div>

        {/* Selected model summary */}
        {currentModel && (
          <div className="mb-4 px-3 py-2 bg-[#F813BE]/5 border border-[#F813BE]/20 rounded-lg flex items-center gap-2">
            <span className="text-[#888] text-xs">Selected:</span>
            <span className="text-white text-sm font-semibold">{currentModel.label}</span>
            {currentModel.supportsReference ? (
              <span className="text-[9px] bg-[#14EAEA]/20 text-[#14EAEA] px-1.5 py-0.5 rounded-full">Ref ✓</span>
            ) : (
              <span className="text-[9px] bg-[#333] text-[#888] px-1.5 py-0.5 rounded-full">Text Only</span>
            )}
          </div>
        )}

        {/* Grouped Model Selector — one section per provider */}
        <div className="space-y-4 mb-5">
          {imageProviders.map((group) => (
            <div key={group.provider}>
              <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-2">{group.label}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {group.models.map((m) => {
                  const isActive = selectedProvider === m.provider && selectedModel === m.id
                  const CostIcon = COST_TIER_ICONS[m.cost] || Star
                  return (
                    <button
                      key={`${m.provider}-${m.id}`}
                      onClick={() => selectModel(m.provider, m.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isActive
                          ? 'border-[#F813BE] bg-[#F813BE]/10'
                          : 'border-[#333] bg-[#1A1A1A] hover:border-[#444]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-sm font-medium">{m.label}</span>
                        {m.supportsReference ? (
                          <span className="text-[9px] bg-[#14EAEA]/20 text-[#14EAEA] px-1.5 py-0.5 rounded-full" title={`Supports up to ${m.maxReferenceImages || 1} reference images`}>
                            Ref ✓
                          </span>
                        ) : (
                          <span className="text-[9px] bg-[#333] text-[#666] px-1.5 py-0.5 rounded-full">
                            Text Only
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 text-xs mt-1.5 ${isActive ? 'text-[#F813BE]' : 'text-[#555]'}`}>
                        <CostIcon className="w-3 h-3" />
                        {m.cost}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Idea Banner — when arriving from Ideas tab */}
        {ideaBanner && (ideaBanner.topic || ideaBanner.idea) && (
          <div className="mb-4 p-3 bg-[#14EAEA]/5 border border-[#14EAEA]/20 rounded-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[#14EAEA] text-xs font-semibold mb-1">Using idea from Ideas tab:</p>
                {ideaBanner.topic && (
                  <p className="text-white text-sm font-medium">{ideaBanner.topic}</p>
                )}
                {ideaBanner.idea && (
                  <p className="text-[#888] text-xs mt-1 line-clamp-2">{ideaBanner.idea}</p>
                )}
              </div>
              <button
                onClick={() => setIdeaBanner(null)}
                className="text-[#666] hover:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Aspect Ratio Selector */}
        <div className="mb-4">
          <label className="text-xs text-[#666] block mb-2">Aspect Ratio</label>
          <div className="flex gap-2">
            {ASPECT_RATIOS.map((r) => (
              <button
                key={r.value}
                onClick={() => setAspectRatio(r.value)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  aspectRatio === r.value
                    ? 'bg-[#14EAEA]/20 text-[#14EAEA] border border-[#14EAEA]'
                    : 'bg-[#1A1A1A] border border-[#333] text-[#888] hover:border-[#444]'
                }`}
              >
                {r.label}
                <span className="text-[10px] block text-[#555]">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reference Image Section — Show only when model supports references */}
        {currentModelSupportsRef && (
          <div className="mb-4 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg">
            <label className="text-xs text-[#666] block mb-2">
              Reference Images {currentModelSupportsRef
                ? `(up to ${maxRefs} for brand consistency)`
                : '(not supported by this model)'}
            </label>

            {referenceImages.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {referenceImages.map((url, idx) => (
                    <div key={idx} className="relative">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#0A0A0A]">
                        <Image src={url} alt={`Reference ${idx + 1}`} fill className="object-cover" sizes="64px" />
                      </div>
                      <button
                        onClick={() => removeReferenceImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                {referenceImages.length < maxRefs && currentModelSupportsRef && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAssetPicker(!showAssetPicker)}
                      className="flex items-center gap-2 text-[#14EAEA] hover:text-white text-xs transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      Add from Assets
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-[#666] hover:text-white text-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </button>
                  </div>
                )}
                {!currentModelSupportsRef && (
                  <button
                    onClick={() => setReferenceImages([])}
                    className="text-[#666] hover:text-red-400 text-xs transition-colors"
                  >
                    Clear references
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAssetPicker(!showAssetPicker)}
                  disabled={!currentModelSupportsRef}
                  className="flex items-center gap-2 text-[#14EAEA] hover:text-white text-xs transition-colors bg-[#14EAEA]/10 px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FolderOpen className="w-4 h-4" />
                  Pick from Brand Assets
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!currentModelSupportsRef}
                  className="flex items-center gap-2 text-[#666] hover:text-white text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  Upload new
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleReferenceUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Brand Assets Picker Panel */}
        {showAssetPicker && brandAssets.length > 0 && (
          <div className="mb-4 p-3 bg-[#0A0A0A] border border-[#222] rounded-lg">
            <p className="text-[#666] text-xs mb-2">Select a brand asset as reference:</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {brandAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => selectBrandAsset(asset)}
                  className="relative w-full rounded-lg overflow-hidden border border-[#333] hover:border-[#14EAEA] transition-colors"
                  style={{ paddingBottom: '100%' }}
                >
                  <Image src={asset.filepath} alt={asset.altText || asset.filename} fill className="object-cover" sizes="80px" />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[8px] text-[#14EAEA] px-1 py-0.5 truncate">
                    {asset.assetType}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reference image warning for unsupported models */}
        {referenceImages.length > 0 && !currentModelSupportsRef && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-yellow-400 text-xs">
              This model doesn&apos;t support reference images. The reference will be ignored, or switch to FLUX.2 Pro for reference support.
            </p>
          </div>
        )}

        {/* Prompt Input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-[#666]">Image Prompt</label>
            <button
              onClick={suggestPrompt}
              disabled={suggestingPrompt}
              className="flex items-center gap-1 text-xs text-[#14EAEA] hover:text-white bg-[#14EAEA]/10 hover:bg-[#14EAEA]/20 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
            >
              {suggestingPrompt ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {suggestingPrompt ? 'Thinking...' : 'Suggest Prompt'}
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. A sleek dark web design workspace with glowing monitors, professional digital marketing agency aesthetic, cyan and pink accents, Instagram portrait format..."
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE] resize-none"
          />
          <p className="text-[#555] text-xs mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Tip: Describe the mood, colors, and composition. Mention &quot;Webink Solutions&quot; or brand colors for on-brand results.
          </p>
        </div>

        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate Image
            </>
          )}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.prompt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <p className="text-white/80 text-xs truncate mb-2">{lightboxImage.prompt}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { onUseImage(lightboxImage.url); setLightboxImage(null) }}
                  className="flex items-center gap-1.5 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Use in Post Builder
                </button>
                <button
                  onClick={() => downloadImage(lightboxImage.url, lightboxImage.filename)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Gallery */}
      {gallery.length > 0 && (
        <div>
          <h3 className="text-white font-medium mb-3">Generated Images ({gallery.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((img) => (
              <div key={img.timestamp} className="group bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
                <button
                  onClick={() => setLightboxImage(img)}
                  className="relative w-full block cursor-zoom-in"
                  style={{ paddingBottom: '125%' }}
                >
                  <Image
                    src={img.url}
                    alt={img.prompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </button>
                <div className="p-2 space-y-1.5">
                  <p className="text-[#555] text-xs truncate">{img.prompt}</p>
                  <p className="text-[#444] text-[10px]">{img.model}</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onUseImage(img.url)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#F813BE] hover:bg-[#d10fa0] text-white py-1.5 rounded-md text-xs transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                      Use
                    </button>
                    <button
                      onClick={() => downloadImage(img.url, img.filename)}
                      className="flex items-center justify-center bg-[#1A1A1A] hover:bg-[#252525] text-[#999] p-1.5 rounded-md transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gallery.length === 0 && !loading && (
        <div className="text-center py-16 text-[#444]">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Generated images will appear here</p>
        </div>
      )}
    </div>
  )
}

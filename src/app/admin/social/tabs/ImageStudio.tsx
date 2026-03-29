'use client'

import { useState, useEffect, useRef } from 'react'
import { Wand2, Download, ArrowRight, Loader2, ImageIcon, Info, Upload, X, FolderOpen, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useAvailableModels } from '@/hooks/useAvailableModels'

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
}

export default function ImageStudio({ onUseImage, initialPrompt }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt || '')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gallery, setGallery] = useState<GeneratedImage[]>([])
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [showAssetPicker, setShowAssetPicker] = useState(false)
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  function selectBrandAsset(asset: BrandAsset) {
    const siteUrl = window.location.origin
    setReferenceImage(`${siteUrl}${asset.filepath}`)
    setShowAssetPicker(false)
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
      setReferenceImage(`${siteUrl}${data.results[0].path}`)
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
          referenceImageUrl: referenceImage || undefined,
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

  const currentModelSupportsRef = imageProviders
    .flatMap((g) => g.models)
    .find((m) => m.id === selectedModel && m.provider === selectedProvider)
    ?.supportsReference

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
          <span className="text-xs text-[#555] ml-auto">1080x1350px (Instagram 4:5)</span>
        </div>

        {/* Dynamic Provider/Model Selector */}
        <div className="space-y-4 mb-5">
          {imageProviders.map((group) => (
            <div key={group.provider}>
              <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-2">{group.label}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {group.models.map((m) => {
                  const isActive = selectedProvider === m.provider && selectedModel === m.id
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
                      <div className="text-white text-sm font-medium">{m.label}</div>
                      <div className="text-[#666] text-xs mt-0.5">{m.desc}</div>
                      <div className={`text-xs mt-1 ${isActive ? 'text-[#F813BE]' : 'text-[#555]'}`}>{m.cost}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Reference Image — Brand Assets Picker + Upload */}
        <div className="mb-4 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg">
          <label className="text-xs text-[#666] block mb-2">
            Reference Image {currentModelSupportsRef ? '(for brand consistency)' : '(available for reference-supporting models)'}
          </label>
          {referenceImage ? (
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#0A0A0A]">
                <Image src={referenceImage} alt="Reference" fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1">
                <p className="text-[#888] text-xs truncate">{referenceImage}</p>
              </div>
              <button
                onClick={() => setReferenceImage(null)}
                className="text-[#666] hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAssetPicker(!showAssetPicker)}
                className="flex items-center gap-2 text-[#14EAEA] hover:text-white text-xs transition-colors bg-[#14EAEA]/10 px-3 py-1.5 rounded-lg"
              >
                <FolderOpen className="w-4 h-4" />
                Pick from Brand Assets
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-[#666] hover:text-white text-xs transition-colors"
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

        {/* Prompt Input */}
        <div className="mb-4">
          <label className="text-xs text-[#666] block mb-1.5">Image Prompt</label>
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

      {/* Generated Gallery */}
      {gallery.length > 0 && (
        <div>
          <h3 className="text-white font-medium mb-3">Generated Images ({gallery.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((img) => (
              <div key={img.timestamp} className="group bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
                <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                  <Image
                    src={img.url}
                    alt={img.prompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
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

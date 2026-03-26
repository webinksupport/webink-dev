'use client'

import { useState } from 'react'
import { Wand2, Download, ArrowRight, Loader2, ImageIcon, Info } from 'lucide-react'
import Image from 'next/image'

interface GeneratedImage {
  url: string
  filename: string
  prompt: string
  model: string
  timestamp: number
}

interface Props {
  onUseImage: (path: string) => void
}

export default function ImageStudio({ onUseImage }: Props) {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('schnell')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gallery, setGallery] = useState<GeneratedImage[]>([])

  async function generate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/social/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
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

  return (
    <div className="space-y-6">
      {/* Generator */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5 text-[#F813BE]" />
          <h2 className="text-white font-semibold">AI Image Generation</h2>
          <span className="text-xs text-[#555] ml-auto">1080×1350px (Instagram 4:5)</span>
        </div>

        {/* Model Selector */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setModel('schnell')}
            className={`p-3 rounded-lg border text-left transition-all ${
              model === 'schnell'
                ? 'border-[#F813BE] bg-[#F813BE]/10'
                : 'border-[#333] bg-[#1A1A1A] hover:border-[#444]'
            }`}
          >
            <div className="text-white text-sm font-medium">FLUX.1 Schnell ⚡</div>
            <div className="text-[#666] text-xs mt-0.5">Fast drafts · Free tier · ~4 steps</div>
          </button>
          <button
            onClick={() => setModel('schnell_paid')}
            className={`p-3 rounded-lg border text-left transition-all ${
              model === 'schnell_paid'
                ? 'border-[#F813BE] bg-[#F813BE]/10'
                : 'border-[#333] bg-[#1A1A1A] hover:border-[#444]'
            }`}
          >
            <div className="text-white text-sm font-medium">FLUX.1 Schnell Pro</div>
            <div className="text-[#666] text-xs mt-0.5">$0.003/image · Paid · Faster</div>
          </button>
        </div>

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
            Tip: Describe the mood, colors, and composition. Mention "Webink Solutions" or brand colors for on-brand results.
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
                {/* Image Preview — 4:5 ratio */}
                <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                  <Image
                    src={img.url}
                    alt={img.prompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                {/* Actions */}
                <div className="p-2 space-y-1.5">
                  <p className="text-[#555] text-xs truncate">{img.prompt}</p>
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

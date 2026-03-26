'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Sparkles, Save, Trash2, ArrowRight, BookmarkCheck } from 'lucide-react'

interface Idea {
  hook: string
  caption: string
  hashtags: string
}

interface SavedIdea {
  id: string
  topic: string
  hook: string
  caption: string
  hashtags: string | null
  brandVoice: string | null
  used: boolean
  createdAt: string
}

interface Props {
  onUseIdea: (draft: { caption?: string; hashtags?: string }) => void
}

export default function IdeaGenerator({ onUseIdea }: Props) {
  const [topic, setTopic] = useState('')
  const [brandVoice, setBrandVoice] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([])
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [showSaved, setShowSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSaved()
  }, [])

  async function fetchSaved() {
    const res = await fetch('/api/social/ideas')
    if (res.ok) setSavedIdeas(await res.json())
  }

  async function generate() {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setIdeas([])
    try {
      const res = await fetch('/api/social/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, brandVoice }),
      })
      const data = await res.json()
      if (data.ideas) {
        setIdeas(data.ideas)
      } else {
        setError(data.error || 'Failed to generate ideas')
      }
    } catch {
      setError('Request failed')
    } finally {
      setLoading(false)
    }
  }

  async function saveIdea(idx: number) {
    const idea = ideas[idx]
    const res = await fetch('/api/social/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', topic, brandVoice, ...idea }),
    })
    if (res.ok) {
      setSavedIds((prev) => new Set(Array.from(prev).concat(idx)))
      fetchSaved()
    }
  }

  async function markIdeaUsed(id: string) {
    await fetch('/api/social/ideas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, used: true }),
    })
    fetchSaved()
  }

  async function deleteIdea(id: string) {
    await fetch('/api/social/ideas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchSaved()
  }

  return (
    <div className="space-y-6">
      {/* Generator Card */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[#F813BE]" />
          <h2 className="text-white font-semibold">Generate Content Ideas</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Topic or Theme</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
              placeholder="e.g. web design tips, SEO for restaurants..."
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
            />
          </div>
          <div>
            <label className="text-xs text-[#666] block mb-1.5">Brand Voice</label>
            <select
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F813BE]"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual & Friendly</option>
              <option value="bold">Bold & Punchy</option>
              <option value="educational">Educational</option>
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate Ideas'}
        </button>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Generated Ideas */}
      {ideas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Generated Ideas ({ideas.length})</h3>
            <span className="text-[#666] text-xs">Topic: {topic}</span>
          </div>
          <div className="space-y-3">
            {ideas.map((idea, i) => (
              <div key={i} className="bg-[#141414] border border-[#222] rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#14EAEA] font-medium text-sm mb-2">"{idea.hook}"</p>
                    <p className="text-[#aaa] text-sm leading-relaxed mb-3">{idea.caption}</p>
                    <p className="text-[#555] text-xs">{idea.hashtags}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => onUseIdea({ caption: idea.caption, hashtags: idea.hashtags })}
                      className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#F813BE] text-[#999] hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Use
                    </button>
                    <button
                      onClick={() => saveIdea(i)}
                      disabled={savedIds.has(i)}
                      className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#14EAEA]/10 text-[#999] hover:text-[#14EAEA] px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
                    >
                      {savedIds.has(i) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                      {savedIds.has(i) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Ideas Toggle */}
      <div>
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="text-[#666] hover:text-white text-sm transition-colors mb-3"
        >
          {showSaved ? '▼' : '▶'} Saved Ideas ({savedIdeas.length})
        </button>

        {showSaved && savedIdeas.length > 0 && (
          <div className="space-y-3">
            {savedIdeas.map((idea) => (
              <div key={idea.id} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#555] text-xs bg-[#1A1A1A] px-2 py-0.5 rounded">{idea.topic}</span>
                      {idea.brandVoice && (
                        <span className="text-[#555] text-xs">{idea.brandVoice}</span>
                      )}
                      {idea.used && (
                        <span className="text-green-500 text-xs bg-green-500/10 px-2 py-0.5 rounded">Used</span>
                      )}
                    </div>
                    <p className="text-[#14EAEA] text-sm mb-1.5">"{idea.hook}"</p>
                    <p className="text-[#777] text-xs leading-relaxed line-clamp-2">{idea.caption}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { markIdeaUsed(idea.id); onUseIdea({ caption: idea.caption, hashtags: idea.hashtags || '' }) }}
                      className={`transition-colors ${idea.used ? 'text-green-500' : 'text-[#666] hover:text-white'}`}
                      title={idea.used ? 'Already used' : 'Use this idea'}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="text-[#666] hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showSaved && savedIdeas.length === 0 && (
          <p className="text-[#555] text-sm">No saved ideas yet. Generate some and save the ones you like.</p>
        )}
      </div>
    </div>
  )
}

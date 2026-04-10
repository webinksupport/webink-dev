'use client'

import { useState, useEffect } from 'react'
import {
  Lightbulb, Sparkles, Save, Trash2, ArrowRight, BookmarkCheck,
  Calendar, Plus, X, Layers, Bot, TrendingUp, Loader2,
} from 'lucide-react'
import { useAvailableModels } from '@/hooks/useAvailableModels'

interface Idea {
  hook: string
  caption: string
  hashtags: string
  dayOfWeek?: string
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

interface ContentPillar {
  id: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
}

interface Props {
  onUseIdea: (draft: { caption?: string; hashtags?: string }) => void
  onSendToImageStudio?: (topic: string, idea: string) => void
}

const TOPIC_CATEGORIES = [
  'Industry Trends', 'Client Success', 'Behind the Scenes', 'Educational/Tips',
  'Promotional', 'Seasonal/Holiday', 'Community', 'Q&A', 'Product/Service Spotlight',
]

export default function IdeaGenerator({ onUseIdea, onSendToImageStudio }: Props) {
  const [topic, setTopic] = useState('')
  const [brandVoice, setBrandVoice] = useState('professional')
  const [category, setCategory] = useState('')
  const [selectedPillar, setSelectedPillar] = useState('')
  const [bulkGenerate, setBulkGenerate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([])
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [showSaved, setShowSaved] = useState(false)
  const [error, setError] = useState('')

  // Text model selector
  const [selectedTextModel, setSelectedTextModel] = useState('')
  const { textProviders } = useAvailableModels()

  // Trending topics
  const [researchingTrends, setResearchingTrends] = useState(false)
  const [trendingSuggestions, setTrendingSuggestions] = useState<{ topic: string; why: string; angle: string }[]>([])

  // Content pillars
  const [pillars, setPillars] = useState<ContentPillar[]>([])
  const [showPillarForm, setShowPillarForm] = useState(false)
  const [newPillarTitle, setNewPillarTitle] = useState('')
  const [newPillarDesc, setNewPillarDesc] = useState('')

  useEffect(() => {
    fetchSaved()
    fetchPillars()
  }, [])

  // Auto-select first text model
  useEffect(() => {
    if (textProviders.length > 0 && !selectedTextModel) {
      const first = textProviders[0].models[0]
      if (first) setSelectedTextModel(`${first.provider}/${first.id}`)
    }
  }, [textProviders, selectedTextModel])

  async function fetchSaved() {
    const res = await fetch('/api/social/ideas')
    if (res.ok) setSavedIdeas(await res.json())
  }

  async function fetchPillars() {
    const res = await fetch('/api/social/content-pillars')
    if (res.ok) setPillars(await res.json())
  }

  async function addPillar() {
    if (!newPillarTitle.trim()) return
    await fetch('/api/social/content-pillars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newPillarTitle, description: newPillarDesc }),
    })
    setNewPillarTitle('')
    setNewPillarDesc('')
    setShowPillarForm(false)
    fetchPillars()
  }

  async function deletePillar(id: string) {
    await fetch('/api/social/content-pillars', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchPillars()
  }

  async function researchTrends() {
    setResearchingTrends(true)
    setTrendingSuggestions([])
    try {
      const res = await fetch('/api/social/trending-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: topic || category || undefined,
          model: selectedTextModel || undefined,
        }),
      })
      const data = await res.json()
      if (data.topics) setTrendingSuggestions(data.topics)
      else setError(data.error || 'Failed to research trends')
    } catch {
      setError('Failed to research trends')
    } finally {
      setResearchingTrends(false)
    }
  }

  async function generate() {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setIdeas([])
    setSavedIds(new Set())
    try {
      const res = await fetch('/api/social/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          brandVoice,
          category: category || undefined,
          contentPillar: selectedPillar || undefined,
          bulkGenerate,
          model: selectedTextModel || undefined,
        }),
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

  async function saveToCalendar(idea: Idea, idx: number) {
    let scheduledAt: string | undefined
    if (idea.dayOfWeek) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const targetDay = days.indexOf(idea.dayOfWeek)
      if (targetDay >= 0) {
        const now = new Date()
        const currentDay = now.getDay()
        const daysUntil = (targetDay - currentDay + 7) % 7 || 7
        const target = new Date(now)
        target.setDate(now.getDate() + daysUntil)
        target.setHours(9, 0, 0, 0)
        scheduledAt = target.toISOString()
      }
    }

    const res = await fetch('/api/social/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_to_calendar',
        hook: idea.hook,
        caption: idea.caption,
        hashtags: idea.hashtags,
        scheduledAt,
      }),
    })
    if (res.ok) {
      setSavedIds((prev) => new Set(Array.from(prev).concat(idx)))
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
      {/* Content Pillars */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#14EAEA]" />
            <h3 className="text-white text-sm font-medium">Content Pillars</h3>
          </div>
          <button
            onClick={() => setShowPillarForm(!showPillarForm)}
            className="flex items-center gap-1 text-xs text-[#666] hover:text-[#14EAEA] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Pillar
          </button>
        </div>

        {showPillarForm && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPillarTitle}
              onChange={(e) => setNewPillarTitle(e.target.value)}
              placeholder="Pillar name (e.g. Web Design Tips)"
              className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#14EAEA]"
            />
            <input
              type="text"
              value={newPillarDesc}
              onChange={(e) => setNewPillarDesc(e.target.value)}
              placeholder="Description (optional)"
              className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#14EAEA]"
            />
            <button
              onClick={addPillar}
              className="bg-[#14EAEA]/20 hover:bg-[#14EAEA]/30 text-[#14EAEA] px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {pillars.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {pillars.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedPillar === p.title
                    ? 'border-[#14EAEA] bg-[#14EAEA]/10 text-[#14EAEA]'
                    : 'border-[#333] text-[#888] hover:border-[#444]'
                }`}
                onClick={() => setSelectedPillar(selectedPillar === p.title ? '' : p.title)}
              >
                {p.title}
                <button
                  onClick={(e) => { e.stopPropagation(); deletePillar(p.id) }}
                  className="text-[#555] hover:text-red-400 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#555] text-xs">Define 3-5 content pillars to guide idea generation. E.g. &quot;Web Design Tips&quot;, &quot;SEO Insights&quot;, &quot;Client Stories&quot;</p>
        )}
      </div>

      {/* Generator Card */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[#F813BE]" />
          <h2 className="text-white font-semibold">Generate Content Ideas</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-[#666]">Topic or Theme</label>
              <button
                onClick={researchTrends}
                disabled={researchingTrends}
                className="flex items-center gap-1 text-xs text-[#14EAEA] hover:text-white bg-[#14EAEA]/10 hover:bg-[#14EAEA]/20 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                {researchingTrends ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3 h-3" />}
                {researchingTrends ? 'Researching...' : 'Research Trends'}
              </button>
            </div>
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
            <label className="text-xs text-[#666] block mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F813BE]"
            >
              <option value="">All Categories</option>
              {TOPIC_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer py-2.5">
              <input
                type="checkbox"
                checked={bulkGenerate}
                onChange={(e) => setBulkGenerate(e.target.checked)}
                className="rounded border-[#333] bg-[#1A1A1A] text-[#F813BE] focus:ring-[#F813BE]"
              />
              <span className="text-white text-sm">Weekly Plan (7 days)</span>
            </label>
          </div>
        </div>

        {/* Trending Topics Suggestions */}
        {trendingSuggestions.length > 0 && (
          <div className="mb-4 p-3 bg-[#0A0A0A] border border-[#14EAEA]/20 rounded-lg">
            <p className="text-[#14EAEA] text-xs font-medium uppercase tracking-wider mb-2">Trending Topics</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {trendingSuggestions.map((t, i) => (
                <button
                  key={i}
                  onClick={() => { setTopic(t.topic); setTrendingSuggestions([]) }}
                  className="text-left p-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#14EAEA] transition-colors"
                >
                  <p className="text-white text-sm font-medium mb-1">{t.topic}</p>
                  <p className="text-[#666] text-xs mb-1">{t.why}</p>
                  <p className="text-[#14EAEA] text-xs">{t.angle}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Model Selector */}
        {textProviders.length > 0 && (
          <div className="mb-4">
            <label className="text-xs text-[#666] block mb-1.5 flex items-center gap-1">
              <Bot className="w-3 h-3" />
              AI Model
            </label>
            <div className="flex gap-2 flex-wrap">
              {textProviders.map((group) =>
                group.models.map((m) => {
                  const modelKey = `${m.provider}/${m.id}`
                  const isActive = selectedTextModel === modelKey
                  return (
                    <button
                      key={modelKey}
                      onClick={() => setSelectedTextModel(modelKey)}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        isActive
                          ? 'border-[#F813BE] bg-[#F813BE]/10 text-[#F813BE]'
                          : 'border-[#333] text-[#888] hover:border-[#444]'
                      }`}
                    >
                      {m.label} — {m.desc}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Generating...' : bulkGenerate ? 'Generate Weekly Plan' : 'Generate Ideas'}
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
                    {idea.dayOfWeek && (
                      <span className="text-[#F813BE] text-xs font-medium bg-[#F813BE]/10 px-2 py-0.5 rounded mb-2 inline-block">
                        {idea.dayOfWeek}
                      </span>
                    )}
                    <p className="text-[#14EAEA] font-medium text-sm mb-2">&quot;{idea.hook}&quot;</p>
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
                    <button
                      onClick={() => saveToCalendar(idea, i)}
                      disabled={savedIds.has(i)}
                      className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#14EAEA]/10 text-[#999] hover:text-[#14EAEA] px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      To Calendar
                    </button>
                    {onSendToImageStudio && (
                      <button
                        onClick={() => onSendToImageStudio(topic, `${idea.hook}. ${idea.caption}`)}
                        className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#F813BE]/10 text-[#999] hover:text-[#F813BE] px-3 py-1.5 rounded-lg text-xs transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Image Studio
                      </button>
                    )}
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
          {showSaved ? '\u25BC' : '\u25B6'} Saved Ideas ({savedIdeas.length})
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
                    <p className="text-[#14EAEA] text-sm mb-1.5">&quot;{idea.hook}&quot;</p>
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

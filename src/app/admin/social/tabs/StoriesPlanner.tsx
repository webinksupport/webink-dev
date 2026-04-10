'use client'

import { useState, useEffect } from 'react'
import {
  Film, Plus, Trash2, Edit3, Loader2, Save, Sparkles,
  ChevronUp, ChevronDown, X, Calendar, Image as ImageIcon,
  Type, BarChart2, Link2, Clock,
} from 'lucide-react'

interface Slide {
  type: 'Image' | 'Text Only' | 'Poll' | 'Link' | 'Countdown'
  image_description: string
  text_overlay: string
  cta: string
  mediaPath?: string
}

interface Story {
  id: string
  title: string
  slides: Slide[]
  scheduledAt: string | null
  publishedAt: string | null
  status: string
  createdAt: string
}

const slideTypeIcons: Record<string, typeof ImageIcon> = {
  'Image': ImageIcon,
  'Text Only': Type,
  'Poll': BarChart2,
  'Link': Link2,
  'Countdown': Clock,
}

export default function StoriesPlanner() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Editor fields
  const [title, setTitle] = useState('')
  const [slides, setSlides] = useState<Slide[]>([])
  const [scheduledAt, setScheduledAt] = useState('')

  // AI generation
  const [genTopic, setGenTopic] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchStories()
  }, [])

  async function fetchStories() {
    setLoading(true)
    try {
      const res = await fetch('/api/social/stories')
      if (res.ok) {
        const data = await res.json()
        setStories(data.map((s: Story) => ({
          ...s,
          slides: typeof s.slides === 'string' ? JSON.parse(s.slides) : s.slides,
        })))
      }
    } catch {}
    setLoading(false)
  }

  function resetEditor() {
    setTitle('')
    setSlides([])
    setScheduledAt('')
    setEditingId(null)
    setShowEditor(false)
  }

  function addSlide() {
    if (slides.length >= 5) return
    setSlides([...slides, {
      type: 'Image',
      image_description: '',
      text_overlay: '',
      cta: '',
    }])
  }

  function updateSlide(index: number, updates: Partial<Slide>) {
    setSlides(slides.map((s, i) => i === index ? { ...s, ...updates } : s))
  }

  function removeSlide(index: number) {
    setSlides(slides.filter((_, i) => i !== index))
  }

  function moveSlide(index: number, direction: 'up' | 'down') {
    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= slides.length) return
    ;[newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]
    setSlides(newSlides)
  }

  function editStory(story: Story) {
    setTitle(story.title)
    setSlides(story.slides)
    setScheduledAt(story.scheduledAt ? story.scheduledAt.slice(0, 16) : '')
    setEditingId(story.id)
    setShowEditor(true)
  }

  async function saveStory() {
    if (!title.trim() || slides.length === 0) return
    setSaving(true)
    try {
      const url = editingId ? `/api/social/stories/${editingId}` : '/api/social/stories'
      const method = editingId ? 'PATCH' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slides,
          scheduledAt: scheduledAt || null,
          status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        }),
      })
      resetEditor()
      fetchStories()
    } catch {}
    setSaving(false)
  }

  async function deleteStory(id: string) {
    await fetch(`/api/social/stories/${id}`, { method: 'DELETE' })
    fetchStories()
  }

  async function generateStorySequence() {
    if (!genTopic.trim()) return
    setGenerating(true)
    try {
      const res = await fetch('/api/social/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: genTopic }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.slides) {
          setSlides(data.slides.map((s: Slide) => ({
            type: s.type || 'Image',
            image_description: s.image_description || '',
            text_overlay: s.text_overlay || '',
            cta: s.cta || '',
          })))
          if (!title.trim()) setTitle(genTopic)
          setShowEditor(true)
        }
      }
    } catch {}
    setGenerating(false)
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500/10 text-green-400'
      case 'SCHEDULED': return 'bg-blue-500/10 text-blue-400'
      default: return 'bg-[#333]/50 text-[#666]'
    }
  }

  function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-[#1A1A1A] rounded ${className}`} />
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header + AI Generate */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Film className="w-5 h-5 text-[#F813BE]" />
            Stories Planner
          </h2>
          <button
            onClick={() => { resetEditor(); setShowEditor(true); addSlide() }}
            className="flex items-center gap-1.5 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Sequence
          </button>
        </div>

        {/* AI Generation */}
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            value={genTopic}
            onChange={(e) => setGenTopic(e.target.value)}
            placeholder="Enter a topic to generate a story sequence..."
            className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
          />
          <button
            onClick={generateStorySequence}
            disabled={generating || !genTopic.trim()}
            className="flex items-center gap-1.5 bg-[#14EAEA]/10 hover:bg-[#14EAEA]/20 text-[#14EAEA] px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate
          </button>
        </div>

        {/* Story Editor */}
        {showEditor && (
          <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-sm font-medium">
                {editingId ? 'Edit Story Sequence' : 'New Story Sequence'}
              </h3>
              <button onClick={resetEditor} className="text-[#666] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-[#666] block mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Story sequence title"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                />
              </div>
              <div>
                <label className="text-xs text-[#666] block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Schedule
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F813BE]"
                />
              </div>
            </div>

            {/* Slides */}
            <div className="space-y-3 mb-4">
              {slides.map((slide, i) => {
                const SlideIcon = slideTypeIcons[slide.type] || ImageIcon
                return (
                  <div key={i} className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#F813BE]/20 text-[#F813BE] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {i + 1}
                        </span>
                        <SlideIcon className="w-4 h-4 text-[#666]" />
                        <select
                          value={slide.type}
                          onChange={(e) => updateSlide(i, { type: e.target.value as Slide['type'] })}
                          className="text-xs bg-[#0A0A0A] border border-[#333] rounded px-2 py-1 text-white focus:outline-none"
                        >
                          <option value="Image">Image</option>
                          <option value="Text Only">Text Only</option>
                          <option value="Poll">Poll</option>
                          <option value="Link">Link</option>
                          <option value="Countdown">Countdown</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveSlide(i, 'up')}
                          disabled={i === 0}
                          className="text-[#555] hover:text-white disabled:opacity-30 transition-colors p-1"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSlide(i, 'down')}
                          disabled={i === slides.length - 1}
                          className="text-[#555] hover:text-white disabled:opacity-30 transition-colors p-1"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeSlide(i)}
                          className="text-[#555] hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <input
                        type="text"
                        value={slide.image_description}
                        onChange={(e) => updateSlide(i, { image_description: e.target.value })}
                        placeholder="Image/visual description..."
                        className="w-full bg-[#0A0A0A] border border-[#222] rounded-lg px-3 py-2 text-white text-xs placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                      />
                      <input
                        type="text"
                        value={slide.text_overlay}
                        onChange={(e) => updateSlide(i, { text_overlay: e.target.value })}
                        placeholder="Text overlay (max 100 chars)"
                        maxLength={100}
                        className="w-full bg-[#0A0A0A] border border-[#222] rounded-lg px-3 py-2 text-white text-xs placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                      />
                      <input
                        type="text"
                        value={slide.cta}
                        onChange={(e) => updateSlide(i, { cta: e.target.value })}
                        placeholder="CTA sticker text (e.g. Swipe Up, Learn More)"
                        className="w-full bg-[#0A0A0A] border border-[#222] rounded-lg px-3 py-2 text-[#14EAEA] text-xs placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {slides.length < 5 && (
              <button
                onClick={addSlide}
                className="w-full border-2 border-dashed border-[#333] hover:border-[#F813BE]/40 rounded-xl py-3 text-[#555] hover:text-[#999] text-sm transition-colors mb-4"
              >
                + Add Slide ({slides.length}/5)
              </button>
            )}

            <div className="flex gap-3">
              <button
                onClick={saveStory}
                disabled={saving || !title.trim() || slides.length === 0}
                className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Sequence
              </button>
              <button
                onClick={resetEditor}
                className="text-[#666] hover:text-white px-4 py-2 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Story List */}
        {stories.length === 0 && !showEditor ? (
          <div className="text-center py-12 text-[#444]">
            <Film className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No story sequences yet</p>
            <p className="text-xs text-[#333] mt-1">Create a new sequence or generate one with AI</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 hover:border-[#F813BE]/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white text-sm font-medium">{story.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(story.status)}`}>
                      {story.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editStory(story)}
                      className="text-[#666] hover:text-[#14EAEA] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteStory(story.id)}
                      className="text-[#555] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#555]">
                  <span>{story.slides.length} slide{story.slides.length !== 1 ? 's' : ''}</span>
                  {story.scheduledAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(story.scheduledAt).toLocaleDateString()} {new Date(story.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                {/* Slide type indicators */}
                <div className="flex gap-1.5 mt-2">
                  {story.slides.map((slide, si) => {
                    const Icon = slideTypeIcons[slide.type] || ImageIcon
                    return (
                      <div
                        key={si}
                        className="bg-[#0A0A0A] border border-[#222] rounded-lg px-2 py-1 flex items-center gap-1"
                        title={`Slide ${si + 1}: ${slide.type}`}
                      >
                        <Icon className="w-3 h-3 text-[#666]" />
                        <span className="text-[#555] text-[10px]">{slide.type}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import {
  PenSquare, Sparkles, Calendar,
  Save, Send, Hash, X, Plus, Upload, Loader2, CheckCircle, AlertCircle,
  Eye, EyeOff
} from 'lucide-react'

import Image from 'next/image'

// Social platform SVG icons (not in lucide-react v1)
function FacebookIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}
function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

interface HashtagSet {
  id: string
  name: string
  hashtags: string
}

interface Post {
  id: string
  caption: string | null
  hashtags: string | null
  mediaPath: string | null
  status: string
  platforms: string | null
  scheduledAt: string | null
}

interface Props {
  initialDraft?: {
    caption?: string
    hashtags?: string
    mediaPath?: string
  }
}

export default function PostComposer({ initialDraft }: Props) {
  const [caption, setCaption] = useState(initialDraft?.caption || '')
  const [hashtags, setHashtags] = useState(initialDraft?.hashtags || '')
  const [mediaPath, setMediaPath] = useState(initialDraft?.mediaPath || '')
  const [platforms, setPlatforms] = useState<string[]>(['instagram', 'facebook'])
  const [scheduledAt, setScheduledAt] = useState('')
  const [brandVoice, setBrandVoice] = useState('professional')
  const [showPreview, setShowPreview] = useState(false)
  const [hashtagSets, setHashtagSets] = useState<HashtagSet[]>([])
  const [newSetName, setNewSetName] = useState('')
  const [showSaveSet, setShowSaveSet] = useState(false)
  const [improvingCaption, setImprovingCaption] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [savedPost, setSavedPost] = useState<Post | null>(null)
  const [publishResults, setPublishResults] = useState<Record<string, { success: boolean; error?: string }> | null>(null)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update when draft changes from parent
  useEffect(() => {
    if (initialDraft?.caption) setCaption(initialDraft.caption)
    if (initialDraft?.hashtags) setHashtags(initialDraft.hashtags)
    if (initialDraft?.mediaPath) setMediaPath(initialDraft.mediaPath)
  }, [initialDraft])

  useEffect(() => {
    fetchHashtagSets()
  }, [])

  async function fetchHashtagSets() {
    const res = await fetch('/api/social/hashtag-sets')
    if (res.ok) setHashtagSets(await res.json())
  }

  function togglePlatform(p: string) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  async function improveCaption() {
    if (!caption.trim()) return
    setImprovingCaption(true)
    try {
      const platform = platforms[0] || 'instagram'
      const res = await fetch('/api/social/improve-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, platform, brandVoice }),
      })
      const data = await res.json()
      if (data.caption) setCaption(data.caption)
    } catch {}
    setImprovingCaption(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.path) setMediaPath(data.path)
  }

  async function savePost() {
    setSaving(true)
    setStatus('idle')
    try {
      const method = savedPost ? 'PATCH' : 'POST'
      const url = savedPost ? `/api/social/posts/${savedPost.id}` : '/api/social/posts'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption,
          hashtags,
          mediaPath: mediaPath || null,
          platforms,
          scheduledAt: scheduledAt || null,
          status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        }),
      })
      const post = await res.json()
      setSavedPost(post)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
    setSaving(false)
  }

  async function publishNow() {
    if (!savedPost) {
      await savePost()
      return
    }
    setPublishing(true)
    setPublishResults(null)
    try {
      const res = await fetch(`/api/social/posts/${savedPost.id}/publish`, {
        method: 'POST',
      })
      const data = await res.json()
      setPublishResults(data.results)
    } catch {
      setPublishResults({ error: { success: false, error: 'Request failed' } })
    }
    setPublishing(false)
  }

  async function saveHashtagSet() {
    if (!newSetName.trim() || !hashtags.trim()) return
    await fetch('/api/social/hashtag-sets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSetName, hashtags }),
    })
    setNewSetName('')
    setShowSaveSet(false)
    fetchHashtagSets()
  }

  const charCount = caption.length + (hashtags ? hashtags.length + 2 : 0)

  return (
    <div className="grid lg:grid-cols-[1fr,340px] gap-6">
      {/* Left: Composer */}
      <div className="space-y-5">
        <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <PenSquare className="w-5 h-5 text-[#F813BE]" />
            <h2 className="text-white font-semibold">Post Composer</h2>
          </div>

          {/* Media Section */}
          <div className="mb-5">
            <label className="text-xs text-[#666] block mb-2">Image / Media</label>
            {mediaPath ? (
              <div className="relative rounded-lg overflow-hidden bg-[#0A0A0A] border border-[#333]">
                <div className="relative w-full" style={{ paddingBottom: '80%' }}>
                  <Image
                    src={mediaPath}
                    alt="Post media"
                    fill
                    className="object-contain"
                    sizes="600px"
                  />
                </div>
                <button
                  onClick={() => setMediaPath('')}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#333] hover:border-[#F813BE]/50 rounded-xl py-10 flex flex-col items-center gap-2 text-[#555] hover:text-[#999] transition-colors"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm">Click to upload image</span>
                <span className="text-xs">or use a generated image from Image Studio</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-[#666]">Caption</label>
              <div className="flex items-center gap-3">
                <select
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="text-xs bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-[#666] focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="bold">Bold</option>
                  <option value="educational">Educational</option>
                </select>
                <button
                  onClick={improveCaption}
                  disabled={improvingCaption || !caption.trim()}
                  className="flex items-center gap-1 text-xs text-[#F813BE] hover:text-white transition-colors disabled:opacity-40"
                >
                  {improvingCaption ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  AI Improve
                </button>
              </div>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={5}
              placeholder="Write your caption here..."
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE] resize-none"
            />
          </div>

          {/* Hashtags */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-[#666] flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Hashtags
              </label>
              <div className="flex items-center gap-2">
                {/* Load saved set */}
                {hashtagSets.length > 0 && (
                  <select
                    onChange={(e) => {
                      const set = hashtagSets.find((s) => s.id === e.target.value)
                      if (set) setHashtags(set.hashtags)
                    }}
                    className="text-xs bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-[#666] focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Load set...</option>
                    {hashtagSets.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => setShowSaveSet(!showSaveSet)}
                  className="text-xs text-[#666] hover:text-[#14EAEA] transition-colors flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save Set
                </button>
              </div>
            </div>
            <textarea
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              rows={2}
              placeholder="#webdesign #digitalmarketing #sarasota..."
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-[#14EAEA] text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE] resize-none"
            />
            {showSaveSet && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  placeholder="Set name (e.g. Web Design)"
                  className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#14EAEA]"
                />
                <button
                  onClick={saveHashtagSet}
                  className="bg-[#14EAEA]/20 hover:bg-[#14EAEA]/30 text-[#14EAEA] px-3 py-1.5 rounded-lg text-xs transition-colors"
                >
                  Save
                </button>
              </div>
            )}
            <p className="text-[#444] text-xs mt-1">{charCount} characters</p>
          </div>

          {/* Platform Selector */}
          <div className="mb-5">
            <label className="text-xs text-[#666] block mb-2">Publish To</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'facebook', label: 'Facebook', icon: FacebookIcon, color: '#1877F2' },
                { id: 'instagram', label: 'Instagram', icon: InstagramIcon, color: '#E4405F' },
                { id: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon, color: '#0A66C2' },
              ].map(({ id, label, icon: Icon, color }) => {
                const active = platforms.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => togglePlatform(id)}
                    style={active ? { borderColor: color, backgroundColor: color + '20', color } : {}}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                      active ? '' : 'border-[#333] text-[#666] hover:border-[#444]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-5">
            <label className="text-xs text-[#666] block mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Schedule (optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F813BE]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={savePost}
              disabled={saving}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-white px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {scheduledAt ? 'Schedule' : 'Save Draft'}
            </button>
            <button
              onClick={publishNow}
              disabled={publishing || platforms.length === 0}
              className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish Now
            </button>
          </div>

          {/* Status */}
          {status === 'saved' && (
            <div className="flex items-center gap-2 text-green-400 text-sm mt-3">
              <CheckCircle className="w-4 h-4" />
              {scheduledAt ? 'Post scheduled!' : 'Draft saved!'}
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-3">
              <AlertCircle className="w-4 h-4" />
              Save failed. Try again.
            </div>
          )}

          {/* Publish Results */}
          {publishResults && (
            <div className="mt-4 space-y-2">
              {Object.entries(publishResults).map(([platform, result]) => (
                <div
                  key={platform}
                  className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                    result.success
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="capitalize font-medium">{platform}:</span>
                  <span>{result.success ? `Published! ID: ${(result as unknown as { id?: string }).id ?? ""}` : result.error}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Preview */}
      <div className="space-y-4">
        <div className="bg-[#141414] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-sm font-medium">Instagram Preview</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-[#666] hover:text-white transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Mock Instagram UI */}
          <div className="bg-white rounded-xl overflow-hidden text-black">
            {/* Header */}
            <div className="flex items-center gap-2 p-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              <div>
                <p className="text-xs font-semibold">webinksolutions</p>
                <p className="text-xs text-gray-500">Sarasota, FL</p>
              </div>
            </div>

            {/* Image */}
            <div className="w-full bg-gray-100" style={{ aspectRatio: '4/5' }}>
              {mediaPath ? (
                <Image
                  src={mediaPath}
                  alt="Post preview"
                  width={300}
                  height={375}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-3 px-3 py-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            {/* Caption */}
            <div className="px-3 pb-3">
              {caption ? (
                <p className="text-xs leading-relaxed">
                  <span className="font-semibold">webinksolutions</span>{' '}
                  {caption.slice(0, 150)}{caption.length > 150 ? '...' : ''}
                </p>
              ) : (
                <p className="text-xs text-gray-400">Caption will appear here...</p>
              )}
              {hashtags && (
                <p className="text-xs text-blue-500 mt-1">{hashtags.slice(0, 100)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Hashtag Sets */}
        {hashtagSets.length > 0 && (
          <div className="bg-[#141414] border border-[#222] rounded-xl p-4">
            <h3 className="text-white text-sm font-medium mb-3">Saved Hashtag Sets</h3>
            <div className="space-y-2">
              {hashtagSets.map((set) => (
                <button
                  key={set.id}
                  onClick={() => setHashtags(set.hashtags)}
                  className="w-full text-left p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] transition-colors"
                >
                  <p className="text-white text-xs font-medium">{set.name}</p>
                  <p className="text-[#555] text-xs truncate mt-0.5">{set.hashtags}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

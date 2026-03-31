'use client'

import { useState, useEffect } from 'react'
import {
  Search, Plus, Trash2, Eye, Loader2, Hash, TrendingUp,
  ChevronDown, ChevronUp, Radar, Users, Sparkles, X,
} from 'lucide-react'

interface Competitor {
  id: string
  handle: string
  displayName: string | null
  notes: string | null
  createdAt: string
}

interface InsightData {
  followers: string
  posts: string
}

interface Trend {
  trend_title: string
  content_angle: string
  hook_line: string
  why_now: string
}

interface HashtagGroup {
  category: string
  tags: string[]
}

export default function Intelligence() {
  // Competitor Tracker
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(true)
  const [handle, setHandle] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [notes, setNotes] = useState('')
  const [adding, setAdding] = useState(false)
  const [insightModal, setInsightModal] = useState<{ competitor: Competitor; data: InsightData } | null>(null)
  const [fetchingInsight, setFetchingInsight] = useState<string | null>(null)

  // Content Gap
  const [gapAnalysis, setGapAnalysis] = useState<string | null>(null)
  const [analyzingGap, setAnalyzingGap] = useState(false)

  // Trending Hashtags
  const [hashtagGroups, setHashtagGroups] = useState<HashtagGroup[]>([])
  const [generatingHashtags, setGeneratingHashtags] = useState(false)

  // Trend Radar
  const [trends, setTrends] = useState<Trend[]>([])
  const [generatingTrends, setGeneratingTrends] = useState(false)
  const [expandedTrend, setExpandedTrend] = useState<number | null>(null)

  useEffect(() => {
    fetchCompetitors()
  }, [])

  async function fetchCompetitors() {
    setLoading(true)
    try {
      const res = await fetch('/api/social/competitors')
      if (res.ok) setCompetitors(await res.json())
    } catch {}
    setLoading(false)
  }

  async function addCompetitor() {
    if (!handle.trim()) return
    setAdding(true)
    try {
      const res = await fetch('/api/social/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, displayName, notes }),
      })
      if (res.ok) {
        setHandle('')
        setDisplayName('')
        setNotes('')
        fetchCompetitors()
      }
    } catch {}
    setAdding(false)
  }

  async function removeCompetitor(id: string) {
    await fetch('/api/social/competitors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchCompetitors()
  }

  async function viewInsights(competitor: Competitor) {
    setFetchingInsight(competitor.id)
    try {
      // Server-side fetch of public Instagram profile
      const res = await fetch(`/api/social/competitors/insights?handle=${encodeURIComponent(competitor.handle)}`)
      if (res.ok) {
        const data = await res.json()
        setInsightModal({ competitor, data })
      } else {
        setInsightModal({
          competitor,
          data: { followers: 'Unable to fetch', posts: 'Unable to fetch' },
        })
      }
    } catch {
      setInsightModal({
        competitor,
        data: { followers: 'Error', posts: 'Error' },
      })
    }
    setFetchingInsight(null)
  }

  async function analyzeContentGap() {
    if (competitors.length === 0) return
    setAnalyzingGap(true)
    try {
      const res = await fetch('/api/social/brand-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'content_gap',
          competitors: competitors.map((c) => c.handle),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setGapAnalysis(data.analysis || data.text || JSON.stringify(data))
      }
    } catch {}
    setAnalyzingGap(false)
  }

  async function generateTrendingHashtags() {
    setGeneratingHashtags(true)
    try {
      const res = await fetch('/api/social/brand-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trending_hashtags' }),
      })
      if (res.ok) {
        const data = await res.json()
        setHashtagGroups(data.groups || [])
      }
    } catch {}
    setGeneratingHashtags(false)
  }

  async function generateTrendReport() {
    setGeneratingTrends(true)
    try {
      const res = await fetch('/api/social/trend-report', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setTrends(data.trends || [])
      }
    } catch {}
    setGeneratingTrends(false)
  }

  async function saveHashtag(tag: string) {
    // Add to first existing hashtag set or create one
    try {
      const res = await fetch('/api/social/hashtag-sets')
      const sets = await res.json()
      if (sets.length > 0) {
        const existing = sets[0]
        const updated = existing.hashtags ? `${existing.hashtags} ${tag}` : tag
        await fetch('/api/social/hashtag-sets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: existing.name, hashtags: updated }),
        })
      } else {
        await fetch('/api/social/hashtag-sets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Intelligence Tags', hashtags: tag }),
        })
      }
    } catch {}
  }

  // Skeleton loader
  function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-[#1A1A1A] rounded ${className}`} />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-60 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Competitor Tracker */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-[#F813BE]" />
          <h2 className="text-white font-semibold">Competitor Tracker</h2>
        </div>

        {/* Add Competitor Form */}
        <div className="grid sm:grid-cols-4 gap-3 mb-5">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@instagram_handle"
            className="bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
          />
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
            className="bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
          />
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#F813BE]"
          />
          <button
            onClick={addCompetitor}
            disabled={adding || !handle.trim()}
            className="flex items-center justify-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>

        {/* Competitor Cards */}
        {competitors.length === 0 ? (
          <div className="text-center py-8 text-[#444]">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No competitors tracked yet</p>
            <p className="text-xs text-[#333] mt-1">Add Instagram handles above to start tracking</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {competitors.map((c) => (
              <div
                key={c.id}
                className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 hover:border-[#F813BE]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white text-sm font-medium">@{c.handle}</p>
                    {c.displayName && (
                      <p className="text-[#666] text-xs mt-0.5">{c.displayName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeCompetitor(c.id)}
                    className="text-[#555] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {c.notes && <p className="text-[#555] text-xs mb-3">{c.notes}</p>}
                <button
                  onClick={() => viewInsights(c)}
                  disabled={fetchingInsight === c.id}
                  className="flex items-center gap-1.5 text-xs text-[#14EAEA] hover:text-white transition-colors disabled:opacity-50"
                >
                  {fetchingInsight === c.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  View Insights
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Content Gap Analysis */}
        {competitors.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[#222]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-medium flex items-center gap-2">
                <Search className="w-4 h-4 text-[#14EAEA]" />
                Content Gap Analysis
              </h3>
              <button
                onClick={analyzeContentGap}
                disabled={analyzingGap}
                className="flex items-center gap-1.5 text-xs bg-[#14EAEA]/10 hover:bg-[#14EAEA]/20 text-[#14EAEA] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {analyzingGap ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Analyze Gaps
              </button>
            </div>
            {gapAnalysis && (
              <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-4 text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">
                {gapAnalysis}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Insight Modal */}
      {insightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#141414] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">@{insightModal.competitor.handle}</h3>
              <button onClick={() => setInsightModal(null)} className="text-[#666] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1A1A1A] rounded-lg p-4 text-center">
                <p className="text-[#666] text-xs mb-1">Followers</p>
                <p className="text-[#14EAEA] text-2xl font-bold">{insightModal.data.followers}</p>
              </div>
              <div className="bg-[#1A1A1A] rounded-lg p-4 text-center">
                <p className="text-[#666] text-xs mb-1">Posts</p>
                <p className="text-[#F813BE] text-2xl font-bold">{insightModal.data.posts}</p>
              </div>
            </div>
            <button
              onClick={() => setInsightModal(null)}
              className="w-full mt-4 bg-[#1A1A1A] hover:bg-[#252525] text-white py-2 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Trending Hashtags */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#14EAEA]" />
            Trending Hashtags
          </h2>
          <button
            onClick={generateTrendingHashtags}
            disabled={generatingHashtags}
            className="flex items-center gap-1.5 text-xs bg-[#14EAEA]/10 hover:bg-[#14EAEA]/20 text-[#14EAEA] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {generatingHashtags ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Generate Suggestions
          </button>
        </div>

        {hashtagGroups.length === 0 ? (
          <div className="text-center py-8 text-[#444]">
            <Hash className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hashtag suggestions yet</p>
            <p className="text-xs text-[#333] mt-1">Click Generate to get AI-powered trending hashtag suggestions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hashtagGroups.map((group, gi) => (
              <div key={gi}>
                <p className="text-[#666] text-xs font-bold tracking-[2px] uppercase mb-2">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag, ti) => (
                    <button
                      key={ti}
                      onClick={() => saveHashtag(tag)}
                      className="bg-[#1A1A1A] hover:bg-[#14EAEA]/10 border border-[#333] hover:border-[#14EAEA]/40 text-[#14EAEA] px-3 py-1.5 rounded-full text-xs transition-all"
                      title="Click to save to hashtag set"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trend Radar */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Radar className="w-5 h-5 text-[#F813BE]" />
            Trend Radar
          </h2>
          <button
            onClick={generateTrendReport}
            disabled={generatingTrends}
            className="flex items-center gap-1.5 text-xs bg-[#F813BE]/10 hover:bg-[#F813BE]/20 text-[#F813BE] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {generatingTrends ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3 h-3" />}
            Generate Trend Report
          </button>
        </div>

        {trends.length === 0 ? (
          <div className="text-center py-8 text-[#444]">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No trend report yet</p>
            <p className="text-xs text-[#333] mt-1">Generate a report to see trending content angles for your industry</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trends.map((trend, i) => {
              const isExpanded = expandedTrend === i
              return (
                <div
                  key={i}
                  className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedTrend(isExpanded ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-[#F813BE]/20 text-[#F813BE] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-white text-sm font-medium">{trend.trend_title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#666]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#666]" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-[#222] pt-3">
                      <div>
                        <p className="text-[#666] text-xs font-medium mb-1">Content Angle</p>
                        <p className="text-[#ccc] text-sm">{trend.content_angle}</p>
                      </div>
                      <div>
                        <p className="text-[#666] text-xs font-medium mb-1">Suggested Hook</p>
                        <p className="text-[#14EAEA] text-sm italic">&ldquo;{trend.hook_line}&rdquo;</p>
                      </div>
                      <div>
                        <p className="text-[#666] text-xs font-medium mb-1">Why It Works Now</p>
                        <p className="text-[#999] text-sm">{trend.why_now}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

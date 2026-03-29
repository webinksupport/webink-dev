'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, Calendar, Plus, Pencil, Trash2,
  Clock, CheckCircle, AlertCircle, FileSpreadsheet
} from 'lucide-react'
import BulkImport from '../components/BulkImport'

const Facebook = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
)
const Instagram = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
)
const Linkedin = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

interface Post {
  id: string
  title: string | null
  caption: string | null
  hashtags: string | null
  mediaPath: string | null
  platforms: string | null
  status: string
  scheduledAt: string | null
  publishedAt: string | null
}

interface Props {
  onEditPost: (post: Post) => void
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#666',
  SCHEDULED: '#14EAEA',
  PUBLISHING: '#F813BE',
  PUBLISHED: '#22c55e',
  FAILED: '#ef4444',
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  PUBLISHING: 'Publishing...',
  PUBLISHED: 'Published',
  FAILED: 'Failed',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarView({ onEditPost }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    const res = await fetch(`/api/social/posts?month=${monthStr}`)
    if (res.ok) {
      const data = await res.json()
      setPosts(data)
    }
    setLoading(false)
  }, [month, year])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function getPostsForDay(day: number): Post[] {
    return posts.filter((p) => {
      if (!p.scheduledAt && !p.publishedAt) return false
      const d = new Date(p.scheduledAt || p.publishedAt || '')
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
    })
  }

  async function deletePost(id: string) {
    setDeleting(id)
    await fetch(`/api/social/posts/${id}`, { method: 'DELETE' })
    setPosts((prev) => prev.filter((p) => p.id !== id))
    if (selectedPost?.id === id) setSelectedPost(null)
    setDeleting(null)
  }

  function getPlatformIcons(platforms: string | null) {
    if (!platforms) return null
    const list: string[] = JSON.parse(platforms)
    return list.map((p) => {
      if (p === 'facebook') return <Facebook key={p} className="w-3 h-3" />
      if (p === 'instagram') return <Instagram key={p} className="w-3 h-3" />
      if (p === 'linkedin') return <Linkedin key={p} className="w-3 h-3" />
      return null
    })
  }

  const today = new Date()
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-[#999] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-white font-semibold text-lg">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-[#999] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#14EAEA]/10 hover:bg-[#14EAEA]/20 border border-[#14EAEA]/30 text-[#14EAEA] transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Import CSV
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${view === 'calendar' ? 'bg-[#F813BE] text-white' : 'bg-[#1A1A1A] text-[#666] hover:text-white'}`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${view === 'list' ? 'bg-[#F813BE] text-white' : 'bg-[#1A1A1A] text-[#666] hover:text-white'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED'] as const).map((s) => {
          const count = posts.filter((p) => p.status === s).length
          return (
            <div key={s} className="bg-[#141414] border border-[#222] rounded-xl p-3 text-center">
              <div className="text-xl font-bold" style={{ color: STATUS_COLORS[s] }}>{count}</div>
              <div className="text-[#666] text-xs mt-0.5">{STATUS_LABELS[s]}</div>
            </div>
          )
        })}
      </div>

      {view === 'calendar' ? (
        <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#222]">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs text-[#555] py-2 font-medium">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => {
              const dayPosts = day ? getPostsForDay(day) : []
              const isToday = day && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

              return (
                <div
                  key={i}
                  className={`min-h-[90px] border-b border-r border-[#1A1A1A] p-1.5 ${
                    !day ? 'bg-[#0D0D0D]' : 'hover:bg-[#1A1A1A]/30 transition-colors'
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-xs mb-1 w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-[#F813BE] text-white font-bold' : 'text-[#666]'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayPosts.slice(0, 3).map((post) => (
                          <button
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="w-full text-left px-1 py-0.5 rounded text-xs truncate hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: STATUS_COLORS[post.status] + '30', color: STATUS_COLORS[post.status] }}
                          >
                            {post.title || post.caption?.slice(0, 20) || 'Untitled'}
                          </button>
                        ))}
                        {dayPosts.length > 3 && (
                          <p className="text-[#555] text-xs">+{dayPosts.length - 3} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {loading && <p className="text-[#555] text-sm">Loading posts...</p>}
          {!loading && posts.length === 0 && (
            <div className="text-center py-12 text-[#444]">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No posts this month</p>
            </div>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-[#141414] border border-[#222] hover:border-[#333] rounded-xl p-4 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: STATUS_COLORS[post.status] + '20', color: STATUS_COLORS[post.status] }}
                    >
                      {STATUS_LABELS[post.status]}
                    </span>
                    <div className="flex gap-1 text-[#555]">
                      {getPlatformIcons(post.platforms)}
                    </div>
                  </div>
                  <p className="text-white text-sm truncate">{post.caption?.slice(0, 80) || 'No caption'}</p>
                  {(post.scheduledAt || post.publishedAt) && (
                    <p className="text-[#555] text-xs mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.scheduledAt || post.publishedAt || '').toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSV Import Modal */}
      {showImport && (
        <BulkImport
          onClose={() => setShowImport(false)}
          onImported={() => fetchPosts()}
        />
      )}

      {/* Post Detail Panel */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedPost(null)}>
          <div
            className="bg-[#141414] border border-[#333] rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[selectedPost.status] + '20', color: STATUS_COLORS[selectedPost.status] }}
                >
                  {STATUS_LABELS[selectedPost.status]}
                </span>
                <div className="flex gap-1 text-[#555]">
                  {getPlatformIcons(selectedPost.platforms)}
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="text-[#666] hover:text-white">×</button>
            </div>

            {selectedPost.mediaPath && (
              <div className="relative w-full mb-3 rounded-lg overflow-hidden bg-[#0A0A0A]" style={{ aspectRatio: '4/5' }}>
                <img src={selectedPost.mediaPath} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            <p className="text-white text-sm mb-2">{selectedPost.caption || 'No caption'}</p>
            {selectedPost.hashtags && (
              <p className="text-[#14EAEA] text-xs mb-3">{selectedPost.hashtags}</p>
            )}
            {selectedPost.scheduledAt && (
              <p className="text-[#555] text-xs mb-4 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Scheduled: {new Date(selectedPost.scheduledAt).toLocaleString()}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { onEditPost(selectedPost); setSelectedPost(null) }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#252525] text-white py-2 rounded-lg text-sm transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => deletePost(selectedPost.id)}
                disabled={deleting === selectedPost.id}
                className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  Recycle, Trophy, Clock, Loader2, RefreshCw, Copy,
  X, CheckCircle
} from 'lucide-react'
import Image from 'next/image'

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
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}
function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

interface PublishedPost {
  id: string
  caption: string | null
  hashtags: string | null
  mediaPath: string | null
  platforms: string | null
  publishedAt: string | null
  fbLikes: number | null
  fbComments: number | null
  igLikes: number | null
  igComments: number | null
}

interface Props {
  onRecyclePost: (data: { caption: string; hashtags: string; mediaPath: string; originalPostId: string }) => void
}

export default function Recycler({ onRecyclePost }: Props) {
  const [posts, setPosts] = useState<PublishedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshingId, setRefreshingId] = useState<string | null>(null)
  const [refreshedCaption, setRefreshedCaption] = useState('')
  const [showRefreshModal, setShowRefreshModal] = useState(false)
  const [activePostId, setActivePostId] = useState<string | null>(null)
  const [recycling, setRecycling] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/social/posts?recycler=true')
      if (res.ok) setPosts(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }

  function getEngagement(post: PublishedPost): number {
    return (post.igLikes || 0) + (post.fbLikes || 0) + (post.igComments || 0) + (post.fbComments || 0)
  }

  function getDaysAgo(dateStr: string | null): number {
    if (!dateStr) return 0
    const diff = Date.now() - new Date(dateStr).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  function getPlatformIcons(platforms: string | null) {
    if (!platforms) return null
    try {
      const list: string[] = JSON.parse(platforms)
      return list.map((p) => {
        if (p === 'facebook') return <FacebookIcon key={p} className="w-3.5 h-3.5" />
        if (p === 'instagram') return <InstagramIcon key={p} className="w-3.5 h-3.5" />
        if (p === 'linkedin') return <LinkedinIcon key={p} className="w-3.5 h-3.5" />
        return null
      })
    } catch { return null }
  }

  async function refreshCaption(post: PublishedPost) {
    if (!post.caption) return
    setRefreshingId(post.id)
    setActivePostId(post.id)
    try {
      const res = await fetch('/api/social/refresh-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: post.caption }),
      })
      const data = await res.json()
      if (data.caption) {
        setRefreshedCaption(data.caption)
        setShowRefreshModal(true)
      }
    } catch { /* ignore */ }
    setRefreshingId(null)
  }

  async function recyclePost(post: PublishedPost, customCaption?: string) {
    setRecycling(post.id)
    try {
      const res = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: customCaption || post.caption,
          hashtags: post.hashtags,
          mediaPath: post.mediaPath,
          platforms: post.platforms ? JSON.parse(post.platforms) : ['instagram'],
          status: 'DRAFT',
          originalPostId: post.id,
        }),
      })
      if (res.ok) {
        onRecyclePost({
          caption: customCaption || post.caption || '',
          hashtags: post.hashtags || '',
          mediaPath: post.mediaPath || '',
          originalPostId: post.id,
        })
      }
    } catch { /* ignore */ }
    setRecycling(null)
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#F813BE]" />
        <p className="text-[#555] text-sm mt-2">Loading published posts...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <Recycle className="w-12 h-12 mx-auto mb-3 text-[#333]" />
        <h3 className="text-white text-lg font-medium mb-1">No Published Posts Yet</h3>
        <p className="text-[#555] text-sm">Once you publish posts, your top performers will appear here for recycling.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-[#B9FF33]" />
        <h2 className="text-white font-semibold">Hall of Fame — Top Performing Posts</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => {
          const engagement = getEngagement(post)
          const daysAgo = getDaysAgo(post.publishedAt)
          const dueForRecycling = daysAgo >= 90

          return (
            <div
              key={post.id}
              className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden hover:border-[#333] transition-colors"
            >
              {/* Thumbnail */}
              {post.mediaPath ? (
                <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                  <Image
                    src={post.mediaPath}
                    alt="Post media"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  {dueForRecycling && (
                    <span className="absolute top-2 right-2 bg-[#B9FF33] text-[#0A0A0A] text-xs font-bold px-2 py-0.5 rounded-full">
                      Due for Recycling
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-full bg-[#0A0A0A] flex items-center justify-center relative" style={{ aspectRatio: '4/3' }}>
                  <Recycle className="w-8 h-8 text-[#333]" />
                  {dueForRecycling && (
                    <span className="absolute top-2 right-2 bg-[#B9FF33] text-[#0A0A0A] text-xs font-bold px-2 py-0.5 rounded-full">
                      Due for Recycling
                    </span>
                  )}
                </div>
              )}

              <div className="p-4">
                {/* Caption preview */}
                <p className="text-white text-sm line-clamp-2 mb-2">
                  {post.caption || 'No caption'}
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#666]">
                    {getPlatformIcons(post.platforms)}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#F813BE] font-medium">{engagement} engagements</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#555] text-xs mb-3">
                  <Clock className="w-3 h-3" />
                  {post.publishedAt
                    ? `Published ${daysAgo}d ago`
                    : 'Unknown date'}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => recyclePost(post)}
                    disabled={recycling === post.id}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#F813BE]/10 hover:bg-[#F813BE]/20 text-[#F813BE] py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {recycling === post.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Copy className="w-3 h-3" />}
                    Recycle
                  </button>
                  <button
                    onClick={() => refreshCaption(post)}
                    disabled={refreshingId === post.id}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#14EAEA]/10 hover:bg-[#14EAEA]/20 text-[#14EAEA] py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {refreshingId === post.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Refresh Caption Modal */}
      {showRefreshModal && activePostId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowRefreshModal(false)}>
          <div className="bg-[#141414] border border-[#333] rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Refreshed Caption</h3>
              <button onClick={() => setShowRefreshModal(false)} className="text-[#666] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white text-sm leading-relaxed bg-[#1A1A1A] rounded-lg p-4 mb-4">
              {refreshedCaption}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const post = posts.find((p) => p.id === activePostId)
                  if (post) recyclePost(post, refreshedCaption)
                  setShowRefreshModal(false)
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white py-2.5 rounded-lg text-sm transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Use & Create Draft
              </button>
              <button
                onClick={() => setShowRefreshModal(false)}
                className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] text-[#999] rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

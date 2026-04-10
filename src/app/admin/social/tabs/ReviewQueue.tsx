'use client'

import { useState, useEffect } from 'react'
import {
  ClipboardCheck, CheckCircle, XCircle, MessageSquare, Calendar, Loader2, Eye,
} from 'lucide-react'
import Image from 'next/image'

interface Post {
  id: string
  title: string | null
  caption: string | null
  hashtags: string | null
  mediaPath: string | null
  platforms: string | null
  status: string
  scheduledAt: string | null
  notes: string | null
  createdAt: string
}

interface Props {
  onEditPost: (post: Post) => void
}

export default function ReviewQueue({ onEditPost }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [feedbackPostId, setFeedbackPostId] = useState<string | null>(null)
  const [feedbackNote, setFeedbackNote] = useState('')
  const [schedulePostId, setSchedulePostId] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const res = await fetch('/api/social/posts?status=PENDING_REVIEW')
    if (res.ok) setPosts(await res.json())
    setLoading(false)
  }

  async function approvePost(post: Post) {
    if (!post.scheduledAt) {
      setSchedulePostId(post.id)
      return
    }
    setActionLoading(post.id)
    await fetch(`/api/social/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SCHEDULED' }),
    })
    setActionLoading(null)
    fetchPosts()
  }

  async function approveWithDate(postId: string) {
    if (!scheduleDate) return
    setActionLoading(postId)
    await fetch(`/api/social/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SCHEDULED', scheduledAt: new Date(scheduleDate).toISOString() }),
    })
    setSchedulePostId(null)
    setScheduleDate('')
    setActionLoading(null)
    fetchPosts()
  }

  async function requestChanges(postId: string) {
    setActionLoading(postId)
    await fetch(`/api/social/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DRAFT', notes: feedbackNote || 'Changes requested' }),
    })
    setFeedbackPostId(null)
    setFeedbackNote('')
    setActionLoading(null)
    fetchPosts()
  }

  async function rejectPost(postId: string) {
    setActionLoading(postId)
    await fetch(`/api/social/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DRAFT', notes: 'Rejected' }),
    })
    setActionLoading(null)
    fetchPosts()
  }

  function parsePlatforms(platforms: string | null): string[] {
    if (!platforms) return []
    try { return JSON.parse(platforms) } catch { return [] }
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Not scheduled'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#666]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading review queue...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardCheck className="w-5 h-5 text-[#F813BE]" />
        <h2 className="text-white font-semibold">Review Queue</h2>
        <span className="text-xs text-[#555] ml-2">{posts.length} post{posts.length !== 1 ? 's' : ''} pending review</span>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-[#444]">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No posts pending review</p>
          <p className="text-xs mt-1">Posts submitted for review will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const platforms = parsePlatforms(post.platforms)
            const isLoading = actionLoading === post.id

            return (
              <div key={post.id} className="bg-[#141414] border border-[#222] rounded-xl p-5">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {post.mediaPath && (
                    <div className="relative w-20 h-25 rounded-lg overflow-hidden bg-[#0A0A0A] shrink-0" style={{ aspectRatio: '4/5' }}>
                      <Image
                        src={post.mediaPath}
                        alt="Post media"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {post.title && (
                      <p className="text-white text-sm font-medium mb-1">{post.title}</p>
                    )}
                    <p className="text-[#aaa] text-sm leading-relaxed line-clamp-3 mb-2">
                      {post.caption || 'No caption'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#666]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.scheduledAt)}
                      </span>
                      {platforms.length > 0 && (
                        <span className="flex items-center gap-1">
                          {platforms.map((p) => (
                            <span key={p} className="capitalize bg-[#1A1A1A] px-1.5 py-0.5 rounded text-[10px]">{p}</span>
                          ))}
                        </span>
                      )}
                    </div>

                    {post.notes && (
                      <p className="text-yellow-500 text-xs mt-2 bg-yellow-500/10 px-2 py-1 rounded">
                        Note: {post.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => approvePost(post)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Approve
                    </button>
                    <button
                      onClick={() => setFeedbackPostId(feedbackPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Changes
                    </button>
                    <button
                      onClick={() => rejectPost(post.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      onClick={() => onEditPost(post)}
                      className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-[#999] px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Feedback form */}
                {feedbackPostId === post.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                      placeholder="Describe what changes are needed..."
                      className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                    />
                    <button
                      onClick={() => requestChanges(post.id)}
                      disabled={isLoading}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                )}

                {/* Schedule date picker for approval without date */}
                {schedulePostId === post.id && (
                  <div className="mt-3 flex gap-2 items-center">
                    <span className="text-[#666] text-sm">Set schedule date:</span>
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                    <button
                      onClick={() => approveWithDate(post.id)}
                      disabled={!scheduleDate || isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      Approve & Schedule
                    </button>
                    <button
                      onClick={() => setSchedulePostId(null)}
                      className="text-[#666] hover:text-white text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

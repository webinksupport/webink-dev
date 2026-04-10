'use client'

import { useState, useEffect } from 'react'
import {
  MessageSquare, ArrowRightLeft, CheckCircle, XCircle, Pencil,
  Loader2, Send, Clock, User, Bot,
} from 'lucide-react'

interface Activity {
  id: string
  postId: string
  type: string
  message: string | null
  author: string | null
  oldStatus: string | null
  newStatus: string | null
  createdAt: string
}

interface PostActivityPanelProps {
  postId: string
  onClose?: () => void
}

function typeIcon(type: string) {
  switch (type) {
    case 'comment': return <MessageSquare className="w-3.5 h-3.5 text-[#14EAEA]" />
    case 'status_change': return <ArrowRightLeft className="w-3.5 h-3.5 text-[#F813BE]" />
    case 'approval': return <CheckCircle className="w-3.5 h-3.5 text-green-400" />
    case 'rejection': return <XCircle className="w-3.5 h-3.5 text-red-400" />
    case 'edit': return <Pencil className="w-3.5 h-3.5 text-yellow-400" />
    default: return <Clock className="w-3.5 h-3.5 text-[#555]" />
  }
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDays = Math.floor(diffHr / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function PostActivityPanel({ postId, onClose }: PostActivityPanelProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchActivities()
  }, [postId])

  async function fetchActivities() {
    setLoading(true)
    try {
      const res = await fetch(`/api/social/posts/${postId}/activity`)
      if (res.ok) setActivities(await res.json())
    } catch {}
    setLoading(false)
  }

  async function sendComment() {
    if (!newComment.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/social/posts/${postId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newComment.trim() }),
      })
      if (res.ok) {
        setNewComment('')
        await fetchActivities()
      }
    } catch {}
    setSending(false)
  }

  return (
    <div className="bg-[#141414] border border-[#282828] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222]">
        <h4 className="text-white text-sm font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#14EAEA]" />
          Activity & Comments
        </h4>
        {onClose && (
          <button onClick={onClose} className="text-[#555] hover:text-white text-xs">Close</button>
        )}
      </div>

      {/* Activity list */}
      <div className="max-h-64 overflow-y-auto px-4 py-2">
        {loading ? (
          <div className="flex items-center gap-2 text-[#555] text-sm py-4 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <p className="text-[#555] text-xs text-center py-4">No activity yet</p>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-2.5 py-1.5">
                <div className="mt-0.5 shrink-0">{typeIcon(activity.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-xs font-medium flex items-center gap-1">
                      {activity.author === 'system' ? (
                        <><Bot className="w-3 h-3 text-[#555]" /> System</>
                      ) : (
                        <><User className="w-3 h-3 text-[#555]" /> {activity.author || 'Unknown'}</>
                      )}
                    </span>
                    <span className="text-[#444] text-[10px]">{formatTime(activity.createdAt)}</span>
                  </div>
                  {activity.message && (
                    <p className="text-[#999] text-xs mt-0.5 leading-relaxed">{activity.message}</p>
                  )}
                  {activity.oldStatus && activity.newStatus && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[#555] text-[10px] uppercase">{activity.oldStatus}</span>
                      <span className="text-[#333]">→</span>
                      <span className="text-[#14EAEA] text-[10px] uppercase">{activity.newStatus}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment input */}
      <div className="border-t border-[#222] px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendComment()}
            placeholder="Add a comment..."
            className="flex-1 bg-[#0F0F0F] border border-[#333] rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#14EAEA] focus:outline-none"
          />
          <button
            onClick={sendComment}
            disabled={sending || !newComment.trim()}
            className="p-1.5 bg-[#14EAEA] text-[#0A0A0A] rounded-lg hover:bg-[#14EAEA]/80 disabled:opacity-30 transition-colors"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

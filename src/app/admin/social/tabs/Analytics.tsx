'use client'

import { useState, useEffect } from 'react'
import { BarChart2, RefreshCw, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

// Social brand icons (not in lucide-react v1)
function FacebookIcon({ className = '', color }: { className?: string; color?: string }) {
  return (
    <svg className={className} style={color ? { color } : undefined} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
function InstagramIcon({ className = '', color }: { className?: string; color?: string }) {
  return (
    <svg className={className} style={color ? { color } : undefined} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}
function LinkedinIcon({ className = '', color }: { className?: string; color?: string }) {
  return (
    <svg className={className} style={color ? { color } : undefined} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

interface Post {
  id: string
  caption: string | null
  mediaPath: string | null
  platforms: string | null
  publishedAt: string | null
  fbLikes: number | null
  fbComments: number | null
  fbReach: number | null
  igLikes: number | null
  igComments: number | null
  igReach: number | null
}

interface AnalyticsData {
  posts: Post[]
  connected: {
    facebook: boolean
    instagram: boolean
    linkedin: boolean
  }
}

const platformDefs = [
  { id: 'facebook', label: 'Facebook', Icon: FacebookIcon, color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', Icon: InstagramIcon, color: '#E4405F' },
  { id: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon, color: '#0A66C2' },
]

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData(forceRefresh = false) {
    if (forceRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await fetch('/api/social/analytics')
      if (res.ok) setData(await res.json())
    } catch {}
    setLoading(false)
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#555]">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading analytics...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#F813BE]" />
            Platform Connections
          </h2>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-[#666] hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {platformDefs.map(({ id, label, Icon, color }) => {
            const isConnected = data?.connected[id as keyof typeof data.connected] || false
            return (
              <div
                key={id}
                className={`p-4 rounded-xl border ${
                  isConnected ? 'border-green-500/30 bg-green-500/5' : 'border-[#333] bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5" color={color} />
                  <span className="text-white text-sm font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isConnected ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400 text-xs">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-[#555]" />
                      <span className="text-[#555] text-xs">
                        {id === 'linkedin' ? 'Configure OAuth in Integrations' : 'Add token in Integrations'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Published Posts Analytics */}
      <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#222]">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#14EAEA]" />
            Recent Published Posts
          </h3>
          {!data?.connected.instagram && !data?.connected.facebook && (
            <p className="text-[#555] text-xs mt-1">Connect platforms above to see live engagement metrics</p>
          )}
        </div>

        {!data?.posts.length ? (
          <div className="py-12 text-center text-[#444]">
            <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No published posts yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="text-left text-xs text-[#555] font-medium px-4 py-3">Post</th>
                  <th className="text-center text-xs text-[#555] font-medium px-3 py-3">Platform</th>
                  <th className="text-right text-xs text-[#555] font-medium px-3 py-3">Date</th>
                  <th className="text-right text-xs text-[#555] font-medium px-3 py-3" style={{ color: '#E4405F' }}>IG Likes</th>
                  <th className="text-right text-xs text-[#555] font-medium px-3 py-3" style={{ color: '#E4405F' }}>IG Comments</th>
                  <th className="text-right text-xs text-[#555] font-medium px-3 py-3" style={{ color: '#E4405F' }}>IG Reach</th>
                  <th className="text-right text-xs text-[#555] font-medium px-3 py-3" style={{ color: '#1877F2' }}>FB Likes</th>
                  <th className="text-right text-xs text-[#555] font-medium px-3 py-3" style={{ color: '#1877F2' }}>FB Reach</th>
                </tr>
              </thead>
              <tbody>
                {data.posts.map((post) => {
                  const postPlatforms: string[] = post.platforms ? JSON.parse(post.platforms) : []
                  return (
                    <tr key={post.id} className="border-b border-[#0D0D0D] hover:bg-[#1A1A1A]/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-xs truncate max-w-[200px]">
                          {post.caption?.slice(0, 60) || 'No caption'}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-center gap-1">
                          {postPlatforms.map((p) => (
                            <span key={p} className="text-xs text-[#555]">
                              {p === 'instagram' ? '📸' : p === 'facebook' ? '📘' : '💼'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-[#666] text-xs">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-3 py-3 text-right text-xs">
                        <span className={post.igLikes !== null ? 'text-[#E4405F]' : 'text-[#444]'}>
                          {post.igLikes ?? '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right text-xs">
                        <span className={post.igComments !== null ? 'text-[#E4405F]' : 'text-[#444]'}>
                          {post.igComments ?? '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right text-xs">
                        <span className={post.igReach !== null ? 'text-[#E4405F]' : 'text-[#444]'}>
                          {post.igReach !== null ? post.igReach.toLocaleString() : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right text-xs">
                        <span className={post.fbLikes !== null ? 'text-[#1877F2]' : 'text-[#444]'}>
                          {post.fbLikes ?? '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right text-xs">
                        <span className={post.fbReach !== null ? 'text-[#1877F2]' : 'text-[#444]'}>
                          {post.fbReach !== null ? post.fbReach.toLocaleString() : '—'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

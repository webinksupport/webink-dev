import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const handle = req.nextUrl.searchParams.get('handle')
  if (!handle) {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 })
  }

  try {
    // Fetch public Instagram profile page server-side
    const res = await fetch(`https://www.instagram.com/${handle}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    if (!res.ok) {
      return NextResponse.json({ followers: 'N/A', posts: 'N/A' })
    }

    const html = await res.text()

    // Parse follower count and post count from meta tags / JSON-LD
    let followers = 'N/A'
    let posts = 'N/A'

    // Try og:description which often contains "X Followers, X Following, X Posts"
    const ogMatch = html.match(/content="([\d,.KMkm]+)\s*Followers/i)
    if (ogMatch) {
      followers = ogMatch[1]
    }

    const postsMatch = html.match(/([\d,.KMkm]+)\s*Posts/i)
    if (postsMatch) {
      posts = postsMatch[1]
    }

    // Fallback: try JSON embedded data
    if (followers === 'N/A') {
      const followerJson = html.match(/"edge_followed_by":\{"count":(\d+)\}/)
      if (followerJson) {
        const count = parseInt(followerJson[1])
        followers = count >= 1000000
          ? `${(count / 1000000).toFixed(1)}M`
          : count >= 1000
          ? `${(count / 1000).toFixed(1)}K`
          : count.toString()
      }
    }

    if (posts === 'N/A') {
      const postsJson = html.match(/"edge_owner_to_timeline_media":\{"count":(\d+)/)
      if (postsJson) {
        posts = postsJson[1]
      }
    }

    return NextResponse.json({ followers, posts })
  } catch (error) {
    console.error('Instagram insight fetch error:', error)
    return NextResponse.json({ followers: 'Error', posts: 'Error' })
  }
}

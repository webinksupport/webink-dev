import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

const FB_PAGE_ID = '422891448079229'
const IG_USER_ID = '17841450255505752'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = await getSetting('META_SYSTEM_USER_TOKEN') || process.env.FACEBOOK_ACCESS_TOKEN

  // Get published posts from DB
  const dbPosts = await prisma.socialPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })

  // If no token, return DB data only
  if (!token) {
    return NextResponse.json({
      posts: dbPosts,
      connected: { facebook: false, instagram: false, linkedin: false },
    })
  }

  // Check connection status
  let fbConnected = false
  let igConnected = false

  try {
    const fbCheck = await fetch(
      `https://graph.facebook.com/v19.0/${FB_PAGE_ID}?fields=name&access_token=${token}`
    )
    const fbData = await fbCheck.json()
    fbConnected = !!fbData.name
  } catch {}

  try {
    const igCheck = await fetch(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}?fields=username&access_token=${token}`
    )
    const igData = await igCheck.json()
    igConnected = !!igData.username
  } catch {}

  // Fetch recent Instagram insights if connected
  const enrichedPosts = [...dbPosts]

  if (igConnected) {
    for (const post of enrichedPosts) {
      if (post.igPostId) {
        try {
          const insightsRes = await fetch(
            `https://graph.facebook.com/v19.0/${post.igPostId}/insights?metric=impressions,reach,likes_count,comments_count&access_token=${token}`
          )
          const insights = await insightsRes.json()

          if (insights.data) {
            const metrics: Record<string, number> = {}
            for (const item of insights.data) {
              metrics[item.name] = item.values?.[0]?.value || 0
            }
            await prisma.socialPost.update({
              where: { id: post.id },
              data: {
                igLikes: metrics.likes_count ?? null,
                igComments: metrics.comments_count ?? null,
                igReach: metrics.reach ?? null,
              },
            })
          }
        } catch {}
      }
    }
  }

  // Re-fetch with updated metrics
  const updatedPosts = await prisma.socialPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({
    posts: updatedPosts,
    connected: {
      facebook: fbConnected,
      instagram: igConnected,
      linkedin: false,
    },
  })
}

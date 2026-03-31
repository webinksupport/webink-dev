import { NextRequest, NextResponse } from 'next/server'
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
const SITE_URL = process.env.NEXTAUTH_URL || 'https://dev.webink.solutions'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const post = await prisma.socialPost.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const token = await getSetting('META_SYSTEM_USER_TOKEN') || process.env.FACEBOOK_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Meta access token not configured. Add it in Admin → Integrations or set FACEBOOK_ACCESS_TOKEN env var.' }, { status: 500 })
  }

  const platforms: string[] = post.platforms ? JSON.parse(post.platforms) : []
  const results: Record<string, { success: boolean; id?: string; error?: string }> = {}

  const caption = [post.caption, post.hashtags].filter(Boolean).join('\n\n')
  const imageUrl = post.mediaPath ? `${SITE_URL}${post.mediaPath}` : null

  // Publish to Facebook
  if (platforms.includes('facebook')) {
    try {
      const fbBody: Record<string, string> = {
        message: caption,
        access_token: token,
      }
      if (imageUrl) {
        fbBody.url = imageUrl
      }

      const endpoint = imageUrl
        ? `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/photos`
        : `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/feed`

      const fbRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbBody),
      })
      const fbData = await fbRes.json()

      if (fbData.id) {
        results.facebook = { success: true, id: fbData.id }
      } else {
        results.facebook = { success: false, error: fbData.error?.message || 'Unknown error' }
      }
    } catch (err) {
      results.facebook = { success: false, error: String(err) }
    }
  }

  // Publish to Instagram (requires image)
  if (platforms.includes('instagram') && imageUrl) {
    try {
      // Step 1: Create media container
      const containerRes = await fetch(`https://graph.facebook.com/v19.0/${IG_USER_ID}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: token,
        }),
      })
      const containerData = await containerRes.json()

      if (!containerData.id) {
        results.instagram = { success: false, error: containerData.error?.message || 'Container creation failed' }
      } else {
        // Step 2: Publish container
        const publishRes = await fetch(`https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: token,
          }),
        })
        const publishData = await publishRes.json()

        if (publishData.id) {
          results.instagram = { success: true, id: publishData.id }
        } else {
          results.instagram = { success: false, error: publishData.error?.message || 'Publish failed' }
        }
      }
    } catch (err) {
      results.instagram = { success: false, error: String(err) }
    }
  } else if (platforms.includes('instagram') && !imageUrl) {
    results.instagram = { success: false, error: 'Instagram requires an image' }
  }

  // LinkedIn placeholder
  if (platforms.includes('linkedin')) {
    results.linkedin = { success: false, error: 'LinkedIn publishing not yet configured. Add OAuth credentials in Integrations.' }
  }

  // Update post status
  const anySuccess = Object.values(results).some((r) => r.success)
  const allFailed = Object.values(results).length > 0 && !anySuccess

  await prisma.socialPost.update({
    where: { id },
    data: {
      status: allFailed ? 'FAILED' : anySuccess ? 'PUBLISHED' : 'FAILED',
      publishedAt: anySuccess ? new Date() : null,
      fbPostId: results.facebook?.id || undefined,
      igPostId: results.instagram?.id || undefined,
    },
  })

  return NextResponse.json({ results, post: { id } })
}

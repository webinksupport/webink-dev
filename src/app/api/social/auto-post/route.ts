import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

const SITE_URL = process.env.NEXTAUTH_URL || 'https://dev.webink.solutions'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

// GET — return today's scheduled posts that are due
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const posts = await prisma.socialPost.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: { lte: now },
    },
    orderBy: { scheduledAt: 'asc' },
  })

  return NextResponse.json(posts)
}

// POST — publish a specific post to Instagram
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId } = await req.json()
  if (!postId) return NextResponse.json({ error: 'postId is required' }, { status: 400 })

  return publishPostToInstagram(postId)
}

async function publishPostToInstagram(postId: string) {
  const post = await prisma.socialPost.findUnique({ where: { id: postId } })
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  if (post.status !== 'SCHEDULED') return NextResponse.json({ error: 'Post is not in SCHEDULED status' }, { status: 400 })

  const token = await getSetting('META_SYSTEM_USER_TOKEN') || await getSetting('FACEBOOK_ACCESS_TOKEN') || process.env.FACEBOOK_ACCESS_TOKEN
  const igUserId = await getSetting('INSTAGRAM_ACCOUNT_ID') || '17841450255505752'

  if (!token) {
    return NextResponse.json({ error: 'Meta access token not configured' }, { status: 500 })
  }

  const caption = [post.caption, post.hashtags].filter(Boolean).join('\n\n')
  const imageUrl = post.mediaPath ? `${SITE_URL}${post.mediaPath}` : null

  if (!imageUrl) {
    return NextResponse.json({ error: 'Instagram requires an image' }, { status: 400 })
  }

  // Mark as publishing
  await prisma.socialPost.update({
    where: { id: postId },
    data: { status: 'PUBLISHING' },
  })

  try {
    // Step 1: Create media container
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
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
      await prisma.socialPost.update({ where: { id: postId }, data: { status: 'FAILED', notes: containerData.error?.message || 'Container creation failed' } })
      return NextResponse.json({ error: containerData.error?.message || 'Container creation failed' }, { status: 500 })
    }

    // Step 2: Publish container
    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: token,
      }),
    })
    const publishData = await publishRes.json()

    if (publishData.id) {
      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          igPostId: publishData.id,
        },
      })
      return NextResponse.json({ success: true, igPostId: publishData.id })
    } else {
      await prisma.socialPost.update({ where: { id: postId }, data: { status: 'FAILED', notes: publishData.error?.message || 'Publish failed' } })
      return NextResponse.json({ error: publishData.error?.message || 'Publish failed' }, { status: 500 })
    }
  } catch (error) {
    await prisma.socialPost.update({ where: { id: postId }, data: { status: 'FAILED', notes: String(error) } })
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

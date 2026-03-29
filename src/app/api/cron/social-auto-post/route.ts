import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

const SITE_URL = process.env.NEXTAUTH_URL || 'https://dev.webink.solutions'

// Secured with CRON_SECRET — called by external cron job
// Usage: curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://dev.webink.solutions/api/cron/social-auto-post

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  const cronSecret = await getSetting('CRON_SECRET') || process.env.CRON_SECRET

  if (cronSecret) {
    const token = authHeader?.replace('Bearer ', '')
    if (token !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Check if auto-publish is enabled
  const autoPublish = await getSetting('SOCIAL_AUTO_PUBLISH')
  if (autoPublish === 'false') {
    return NextResponse.json({ message: 'Auto-publish is disabled', published: 0 })
  }

  const now = new Date()

  // Find all scheduled posts that are due
  const duePosts = await prisma.socialPost.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: { lte: now },
    },
    orderBy: { scheduledAt: 'asc' },
  })

  if (duePosts.length === 0) {
    return NextResponse.json({ message: 'No posts due', published: 0 })
  }

  const token = await getSetting('META_SYSTEM_USER_TOKEN') || await getSetting('FACEBOOK_ACCESS_TOKEN') || process.env.FACEBOOK_ACCESS_TOKEN
  const igUserId = await getSetting('INSTAGRAM_ACCOUNT_ID') || '17841450255505752'

  if (!token) {
    return NextResponse.json({ error: 'Meta access token not configured', published: 0 }, { status: 500 })
  }

  const results: { postId: string; success: boolean; error?: string }[] = []

  for (const post of duePosts) {
    const caption = [post.caption, post.hashtags].filter(Boolean).join('\n\n')
    const imageUrl = post.mediaPath ? `${SITE_URL}${post.mediaPath}` : null

    if (!imageUrl) {
      results.push({ postId: post.id, success: false, error: 'No image attached' })
      continue
    }

    // Mark as publishing
    await prisma.socialPost.update({ where: { id: post.id }, data: { status: 'PUBLISHING' } })

    try {
      // Create IG container
      const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
      })
      const containerData = await containerRes.json()

      if (!containerData.id) {
        await prisma.socialPost.update({ where: { id: post.id }, data: { status: 'FAILED', notes: containerData.error?.message } })
        results.push({ postId: post.id, success: false, error: containerData.error?.message || 'Container failed' })
        continue
      }

      // Publish
      const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: containerData.id, access_token: token }),
      })
      const publishData = await publishRes.json()

      if (publishData.id) {
        await prisma.socialPost.update({
          where: { id: post.id },
          data: { status: 'PUBLISHED', publishedAt: new Date(), igPostId: publishData.id },
        })
        results.push({ postId: post.id, success: true })
      } else {
        await prisma.socialPost.update({ where: { id: post.id }, data: { status: 'FAILED', notes: publishData.error?.message } })
        results.push({ postId: post.id, success: false, error: publishData.error?.message || 'Publish failed' })
      }
    } catch (error) {
      await prisma.socialPost.update({ where: { id: post.id }, data: { status: 'FAILED', notes: String(error) } })
      results.push({ postId: post.id, success: false, error: String(error) })
    }
  }

  const published = results.filter((r) => r.success).length
  return NextResponse.json({ message: `Processed ${duePosts.length} posts`, published, results })
}

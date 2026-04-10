import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'
import { resolveCredentials, publishToPlatform, logPublishAttempt, recordActivity } from '@/lib/social/publish-utils'

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

  // Also find FAILED posts eligible for retry (retryCount < maxRetries, failed within last 2 hours)
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const retryPosts = await prisma.socialPost.findMany({
    where: {
      status: 'FAILED',
      retryCount: { lt: 3 },
      updatedAt: { gte: twoHoursAgo },
    },
    orderBy: { updatedAt: 'asc' },
    take: 5, // Limit retries per cron run
  })

  const allPosts = [...duePosts, ...retryPosts]

  if (allPosts.length === 0) {
    return NextResponse.json({ message: 'No posts due', published: 0, retried: 0 })
  }

  const results: { postId: string; success: boolean; error?: string; isRetry: boolean }[] = []

  for (const post of allPosts) {
    const isRetry = post.status === 'FAILED'
    const platforms: string[] = post.platforms ? JSON.parse(post.platforms) : ['instagram']
    const caption = [post.caption, post.hashtags].filter(Boolean).join('\n\n')
    const imageUrl = post.mediaPath ? `${SITE_URL}${post.mediaPath}` : null

    if (!imageUrl) {
      await logPublishAttempt({
        postId: post.id,
        platform: 'instagram',
        action: isRetry ? 'retry' : 'publish',
        status: 'skipped',
        errorMessage: 'No image attached',
        attemptNumber: post.retryCount + 1,
      })
      results.push({ postId: post.id, success: false, error: 'No image attached', isRetry })
      continue
    }

    // Mark as publishing
    await prisma.socialPost.update({ where: { id: post.id }, data: { status: 'PUBLISHING' } })

    let anySuccess = false
    let lastError = ''

    for (const platform of platforms) {
      if (!['facebook', 'instagram', 'linkedin'].includes(platform)) continue

      const creds = await resolveCredentials(post.clientId, platform as 'facebook' | 'instagram' | 'linkedin')
      if (!creds) {
        const error = `${platform} credentials not configured`
        await logPublishAttempt({
          postId: post.id,
          platform,
          action: isRetry ? 'retry' : 'publish',
          status: 'failed',
          errorMessage: error,
          attemptNumber: post.retryCount + 1,
        })
        lastError = error
        continue
      }

      const result = await publishToPlatform({
        platform: platform as 'facebook' | 'instagram' | 'linkedin',
        caption,
        imageUrl,
        accessToken: creds.accessToken,
        accountId: creds.accountId,
      })

      await logPublishAttempt({
        postId: post.id,
        platform,
        action: isRetry ? 'retry' : 'publish',
        status: result.success ? 'success' : 'failed',
        platformPostId: result.id || null,
        errorMessage: result.error || null,
        attemptNumber: post.retryCount + 1,
      })

      if (result.success) {
        anySuccess = true
        // Update platform-specific post ID
        const updateField = platform === 'facebook' ? 'fbPostId'
          : platform === 'instagram' ? 'igPostId'
          : 'liPostId'
        await prisma.socialPost.update({
          where: { id: post.id },
          data: { [updateField]: result.id },
        })
      } else {
        lastError = result.error || 'Unknown error'
      }
    }

    if (anySuccess) {
      await prisma.socialPost.update({
        where: { id: post.id },
        data: { status: 'PUBLISHED', publishedAt: new Date() },
      })
      await recordActivity({
        postId: post.id,
        type: 'status_change',
        message: isRetry ? 'Published successfully on retry' : 'Auto-published by scheduler',
        author: 'system',
        oldStatus: isRetry ? 'FAILED' : 'SCHEDULED',
        newStatus: 'PUBLISHED',
      })
    } else {
      await prisma.socialPost.update({
        where: { id: post.id },
        data: {
          status: 'FAILED',
          retryCount: post.retryCount + 1,
          notes: lastError,
        },
      })
      await recordActivity({
        postId: post.id,
        type: 'status_change',
        message: `Publish failed (attempt ${post.retryCount + 1}): ${lastError}`,
        author: 'system',
        oldStatus: 'PUBLISHING',
        newStatus: 'FAILED',
      })
    }

    results.push({ postId: post.id, success: anySuccess, error: anySuccess ? undefined : lastError, isRetry })
  }

  const published = results.filter((r) => r.success && !r.isRetry).length
  const retried = results.filter((r) => r.isRetry).length
  const retriedSuccess = results.filter((r) => r.success && r.isRetry).length

  return NextResponse.json({
    message: `Processed ${allPosts.length} posts`,
    published,
    retried,
    retriedSuccess,
    results,
  })
}

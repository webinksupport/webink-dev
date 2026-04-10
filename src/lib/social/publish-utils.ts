import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

/**
 * Resolves publishing credentials for a given client and platform.
 * Falls back to system-level credentials if no client-specific ones exist.
 */
export async function resolveCredentials(clientId: string | null, platform: 'facebook' | 'instagram' | 'linkedin') {
  // 1. Try client-specific connection
  if (clientId) {
    const connection = await prisma.socialConnection.findUnique({
      where: { clientId_platform: { clientId, platform } },
    })
    if (connection && connection.status === 'active' && connection.accessToken) {
      return {
        accessToken: connection.accessToken,
        accountId: connection.platformAccountId || null,
        source: 'client_connection' as const,
        connectionId: connection.id,
      }
    }

    // Also check legacy fields on SocialClient
    const client = await prisma.socialClient.findUnique({ where: { id: clientId } })
    if (client?.accessToken) {
      const accountId = platform === 'facebook'
        ? client.facebookPageId
        : platform === 'instagram'
          ? client.instagramHandle // Note: handle != user ID, but check anyway
          : null
      return {
        accessToken: client.accessToken,
        accountId,
        source: 'client_legacy' as const,
        connectionId: null,
      }
    }
  }

  // 2. Fall back to system-level credentials
  const token = await getSetting('META_SYSTEM_USER_TOKEN')
    || await getSetting('FACEBOOK_ACCESS_TOKEN')
    || process.env.FACEBOOK_ACCESS_TOKEN

  if (!token) return null

  // System-level account IDs from settings or env
  let accountId: string | null = null
  if (platform === 'facebook') {
    accountId = await getSetting('FACEBOOK_PAGE_ID') || process.env.FACEBOOK_PAGE_ID || '422891448079229'
  } else if (platform === 'instagram') {
    accountId = await getSetting('INSTAGRAM_ACCOUNT_ID') || process.env.INSTAGRAM_ACCOUNT_ID || '17841450255505752'
  }

  return {
    accessToken: token,
    accountId,
    source: 'system' as const,
    connectionId: null,
  }
}

/**
 * Log a publish attempt to the PublishLog table.
 */
export async function logPublishAttempt(params: {
  postId: string
  platform: string
  action: string
  status: string
  platformPostId?: string | null
  errorMessage?: string | null
  attemptNumber?: number
  dryRun?: boolean
}) {
  return prisma.publishLog.create({
    data: {
      postId: params.postId,
      platform: params.platform,
      action: params.action,
      status: params.status,
      platformPostId: params.platformPostId || null,
      errorMessage: params.errorMessage || null,
      attemptNumber: params.attemptNumber || 1,
      dryRun: params.dryRun || false,
    },
  })
}

/**
 * Record a post activity entry (comment, status change, etc.)
 */
export async function recordActivity(params: {
  postId: string
  type: 'comment' | 'status_change' | 'approval' | 'rejection' | 'edit'
  message?: string | null
  author?: string | null
  oldStatus?: string | null
  newStatus?: string | null
}) {
  return prisma.postActivity.create({
    data: {
      postId: params.postId,
      type: params.type,
      message: params.message || null,
      author: params.author || null,
      oldStatus: params.oldStatus || null,
      newStatus: params.newStatus || null,
    },
  })
}

/**
 * Publish a single post to a single platform.
 * Returns result with success/failure and platform post ID.
 */
export async function publishToPlatform(params: {
  platform: 'facebook' | 'instagram' | 'linkedin'
  caption: string
  imageUrl: string | null
  accessToken: string
  accountId: string | null
  dryRun?: boolean
}): Promise<{ success: boolean; id?: string; error?: string; dryRun?: boolean }> {
  const { platform, caption, imageUrl, accessToken, accountId, dryRun } = params

  // Dry-run mode — log what would happen without calling external APIs
  if (dryRun) {
    return {
      success: true,
      id: `dry_run_${platform}_${Date.now()}`,
      dryRun: true,
    }
  }

  if (platform === 'facebook') {
    if (!accountId) return { success: false, error: 'Facebook Page ID not configured' }
    try {
      const fbBody: Record<string, string> = { message: caption, access_token: accessToken }
      if (imageUrl) fbBody.url = imageUrl
      const endpoint = imageUrl
        ? `https://graph.facebook.com/v19.0/${accountId}/photos`
        : `https://graph.facebook.com/v19.0/${accountId}/feed`

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbBody),
      })
      const data = await res.json()
      if (data.id) return { success: true, id: data.id }
      return { success: false, error: data.error?.message || 'Unknown error' }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  }

  if (platform === 'instagram') {
    if (!accountId) return { success: false, error: 'Instagram Account ID not configured' }
    if (!imageUrl) return { success: false, error: 'Instagram requires an image' }
    try {
      // Step 1: Create media container
      const containerRes = await fetch(`https://graph.facebook.com/v19.0/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, caption, access_token: accessToken }),
      })
      const containerData = await containerRes.json()
      if (!containerData.id) {
        return { success: false, error: containerData.error?.message || 'Container creation failed' }
      }

      // Step 2: Publish container
      const publishRes = await fetch(`https://graph.facebook.com/v19.0/${accountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: containerData.id, access_token: accessToken }),
      })
      const publishData = await publishRes.json()
      if (publishData.id) return { success: true, id: publishData.id }
      return { success: false, error: publishData.error?.message || 'Publish failed' }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  }

  if (platform === 'linkedin') {
    return { success: false, error: 'LinkedIn publishing not yet configured. Add OAuth credentials in Settings.' }
  }

  return { success: false, error: `Unsupported platform: ${platform}` }
}

/**
 * Check for scheduling conflicts — posts within 30 minutes of each other
 * for the same client.
 */
export async function checkScheduleConflicts(scheduledAt: Date, clientId: string | null, excludePostId?: string) {
  const windowMs = 30 * 60 * 1000 // 30 minutes
  const windowStart = new Date(scheduledAt.getTime() - windowMs)
  const windowEnd = new Date(scheduledAt.getTime() + windowMs)

  const conflicts = await prisma.socialPost.findMany({
    where: {
      scheduledAt: { gte: windowStart, lte: windowEnd },
      status: { in: ['SCHEDULED', 'PUBLISHING'] },
      clientId: clientId || null,
      ...(excludePostId ? { id: { not: excludePostId } } : {}),
    },
    select: { id: true, title: true, scheduledAt: true, platforms: true },
  })

  return conflicts
}

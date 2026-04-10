import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { resolveCredentials, publishToPlatform, logPublishAttempt, recordActivity } from '@/lib/social/publish-utils'

const SITE_URL = process.env.NEXTAUTH_URL || 'https://dev.webink.solutions'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const post = await prisma.socialPost.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Check for dry-run mode from request body or system setting
  let dryRun = false
  try {
    const body = await req.json().catch(() => ({}))
    dryRun = body.dryRun === true
  } catch {}

  const platforms: string[] = post.platforms ? JSON.parse(post.platforms) : []
  const results: Record<string, { success: boolean; id?: string; error?: string; dryRun?: boolean }> = {}

  const caption = [post.caption, post.hashtags].filter(Boolean).join('\n\n')
  const imageUrl = post.mediaPath ? `${SITE_URL}${post.mediaPath}` : null

  const oldStatus = post.status

  for (const platform of platforms) {
    if (!['facebook', 'instagram', 'linkedin'].includes(platform)) continue

    const creds = await resolveCredentials(post.clientId, platform as 'facebook' | 'instagram' | 'linkedin')
    if (!creds) {
      const error = `${platform} access token not configured. Add it in Settings or connect the account.`
      results[platform] = { success: false, error }
      await logPublishAttempt({
        postId: id,
        platform,
        action: dryRun ? 'dry_run' : 'publish',
        status: 'failed',
        errorMessage: error,
        attemptNumber: post.retryCount + 1,
        dryRun,
      })
      continue
    }

    const result = await publishToPlatform({
      platform: platform as 'facebook' | 'instagram' | 'linkedin',
      caption,
      imageUrl,
      accessToken: creds.accessToken,
      accountId: creds.accountId,
      dryRun,
    })

    results[platform] = result

    await logPublishAttempt({
      postId: id,
      platform,
      action: dryRun ? 'dry_run' : 'publish',
      status: result.success ? 'success' : 'failed',
      platformPostId: result.id || null,
      errorMessage: result.error || null,
      attemptNumber: post.retryCount + 1,
      dryRun,
    })
  }

  // Update post status
  const anySuccess = Object.values(results).some((r) => r.success)
  const allFailed = Object.values(results).length > 0 && !anySuccess

  const newStatus = dryRun
    ? post.status // Dry-run doesn't change status
    : allFailed ? 'FAILED' : anySuccess ? 'PUBLISHED' : 'FAILED'

  const updateData: Record<string, unknown> = {
    status: newStatus,
    fbPostId: results.facebook?.id || undefined,
    igPostId: results.instagram?.id || undefined,
  }

  if (!dryRun && anySuccess) {
    updateData.publishedAt = new Date()
  }

  if (!dryRun && allFailed) {
    updateData.retryCount = post.retryCount + 1
  }

  await prisma.socialPost.update({ where: { id }, data: updateData })

  // Record activity
  if (!dryRun && newStatus !== oldStatus) {
    await recordActivity({
      postId: id,
      type: 'status_change',
      message: anySuccess
        ? `Published to ${Object.entries(results).filter(([, r]) => r.success).map(([p]) => p).join(', ')}`
        : `Publish failed: ${Object.entries(results).filter(([, r]) => !r.success).map(([p, r]) => `${p}: ${r.error}`).join('; ')}`,
      author: session.user.email || 'admin',
      oldStatus,
      newStatus,
    })
  }

  if (dryRun) {
    await recordActivity({
      postId: id,
      type: 'comment',
      message: `Dry-run publish completed. Results: ${JSON.stringify(results)}`,
      author: session.user.email || 'admin',
    })
  }

  return NextResponse.json({ results, post: { id }, dryRun })
}

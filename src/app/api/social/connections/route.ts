import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

// GET — list connections, optionally filtered by clientId
export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clientId = req.nextUrl.searchParams.get('clientId')
  const connections = await prisma.socialConnection.findMany({
    where: clientId ? { clientId } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(connections)
}

// POST — create or update a connection for a client+platform
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { clientId, platform, platformAccountId, accessToken } = body

  if (!clientId || !platform) {
    return NextResponse.json({ error: 'clientId and platform are required' }, { status: 400 })
  }

  if (!['facebook', 'instagram', 'linkedin', 'tiktok'].includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  // Validate token if provided (test API call for Meta platforms)
  let tokenValid = false
  let verificationError: string | null = null

  if (accessToken && ['facebook', 'instagram'].includes(platform)) {
    try {
      const debugRes = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`
      )
      const debugData = await debugRes.json()
      tokenValid = debugData.data?.is_valid === true
      if (!tokenValid) {
        verificationError = debugData.data?.error?.message || 'Token validation failed'
      }
    } catch (err) {
      verificationError = `Token verification request failed: ${String(err)}`
    }
  } else if (accessToken) {
    // For non-Meta platforms, just mark as provided
    tokenValid = true
  }

  // Upsert connection
  const connection = await prisma.socialConnection.upsert({
    where: { clientId_platform: { clientId, platform } },
    create: {
      clientId,
      platform,
      platformAccountId: platformAccountId || null,
      accessToken: accessToken || null,
      status: accessToken ? (tokenValid ? 'active' : 'expired') : 'pending_setup',
      connectionMethod: accessToken ? 'manual_token' : 'pending',
      lastVerifiedAt: tokenValid ? new Date() : null,
      lastError: verificationError,
    },
    update: {
      platformAccountId: platformAccountId || undefined,
      accessToken: accessToken || undefined,
      status: accessToken ? (tokenValid ? 'active' : 'expired') : 'pending_setup',
      connectionMethod: accessToken ? 'manual_token' : 'pending',
      lastVerifiedAt: tokenValid ? new Date() : undefined,
      lastError: verificationError,
    },
  })

  return NextResponse.json({
    connection,
    tokenValid,
    verificationError,
  })
}

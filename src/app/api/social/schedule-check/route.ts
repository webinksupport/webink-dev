import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkScheduleConflicts } from '@/lib/social/publish-utils'

// POST — check for scheduling conflicts
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { scheduledAt, clientId, excludePostId } = body

  if (!scheduledAt) {
    return NextResponse.json({ error: 'scheduledAt is required' }, { status: 400 })
  }

  const conflicts = await checkScheduleConflicts(
    new Date(scheduledAt),
    clientId || null,
    excludePostId
  )

  return NextResponse.json({
    hasConflicts: conflicts.length > 0,
    conflicts,
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { SocialPostStatus } from '@/generated/prisma/client'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

interface ImportRow {
  date: string
  time: string
  platform: string
  caption: string
  hashtags?: string
  mediaPath?: string
  status?: string
}

function validateRow(row: ImportRow, index: number): string | null {
  if (!row.caption || !row.caption.trim()) {
    return `Row ${index + 1}: caption is required`
  }

  const validPlatforms = ['instagram', 'facebook', 'linkedin']
  if (!row.platform || !validPlatforms.includes(row.platform.toLowerCase())) {
    return `Row ${index + 1}: platform must be instagram, facebook, or linkedin`
  }

  const status = (row.status || 'DRAFT').toUpperCase()
  if (!['DRAFT', 'SCHEDULED'].includes(status)) {
    return `Row ${index + 1}: status must be DRAFT or SCHEDULED`
  }

  if (row.date) {
    const dateStr = `${row.date}T${row.time || '09:00'}:00`
    const parsed = new Date(dateStr)
    if (isNaN(parsed.getTime())) {
      return `Row ${index + 1}: invalid date/time format`
    }
    if (parsed < new Date()) {
      return `Row ${index + 1}: date must be in the future`
    }
  } else if (status === 'SCHEDULED') {
    return `Row ${index + 1}: date is required for SCHEDULED posts`
  }

  return null
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { rows } = await req.json() as { rows: ImportRow[] }

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
  }

  const results: { imported: number; skipped: number; errors: string[] } = {
    imported: 0,
    skipped: 0,
    errors: [],
  }

  const validRows: Array<{
    caption: string
    hashtags: string | null
    mediaPath: string | null
    platforms: string
    status: SocialPostStatus
    scheduledAt: Date | null
    postType: string
  }> = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const error = validateRow(row, i)
    if (error) {
      results.errors.push(error)
      results.skipped++
      continue
    }

    const status = (row.status || 'DRAFT').toUpperCase() as SocialPostStatus
    const scheduledAt = row.date
      ? new Date(`${row.date}T${row.time || '09:00'}:00`)
      : null

    validRows.push({
      caption: row.caption.trim(),
      hashtags: row.hashtags?.trim() || null,
      mediaPath: row.mediaPath?.trim() || null,
      platforms: JSON.stringify([row.platform.toLowerCase()]),
      status,
      scheduledAt,
      postType: 'FEED',
    })
  }

  if (validRows.length > 0) {
    await prisma.socialPost.createMany({ data: validRows })
    results.imported = validRows.length
  }

  return NextResponse.json(results)
}

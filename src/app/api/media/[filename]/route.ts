import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { filename } = await params

    // Only allow deleting from uploads directory for safety
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const filepath = path.resolve(uploadsDir, filename)

    // Prevent path traversal
    if (!filepath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    await unlink(filepath)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'])
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(
  request: Request,
  { params }: { params: Promise<{ pageSlug: string; blockKey: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pageSlug, blockKey } = await params

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds 10 MB limit' },
        { status: 400 }
      )
    }

    const ext = path.extname(file.name).toLowerCase() || '.jpg'
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `File type ${ext} is not allowed` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to /app/uploads/ (persistent volume) instead of /app/public/ (baked at build)
    const uploadDir = path.join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const sanitizedSlug = pageSlug.replace(/[^a-zA-Z0-9-]/g, '-')
    const sanitizedKey = blockKey.replace(/[^a-zA-Z0-9-_]/g, '-')
    const filename = `${sanitizedSlug}-${sanitizedKey}-${Date.now()}${ext}`
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const url = `/api/uploads/${filename}`

    await prisma.pageContent.upsert({
      where: {
        pageSlug_blockKey: { pageSlug, blockKey },
      },
      update: { value: url, blockType: 'IMAGE' },
      create: { pageSlug, blockKey, value: url, blockType: 'IMAGE' },
    })

    return NextResponse.json({ url })
  } catch {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

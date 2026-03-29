import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('file') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/x-icon',
    ]
    const maxSize = 10 * 1024 * 1024

    // WordPress-style date-based folders: /uploads/YYYY/MM/
    const now = new Date()
    const year = now.getFullYear().toString()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')

    // Save to /app/uploads/ (persistent volume) instead of /app/public/ (baked at build)
    const uploadDir = path.join(
      process.cwd(),
      'uploads',
      year,
      month
    )
    await mkdir(uploadDir, { recursive: true })

    const results: {
      name: string
      path: string
      size: number
      width?: number
      height?: number
      mimeType: string
      success: boolean
      error?: string
    }[] = []

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        results.push({
          name: file.name,
          path: '',
          size: 0,
          mimeType: file.type,
          success: false,
          error: 'Invalid file type',
        })
        continue
      }

      if (file.size > maxSize) {
        results.push({
          name: file.name,
          path: '',
          size: file.size,
          mimeType: file.type,
          success: false,
          error: 'File too large (max 10MB)',
        })
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Sanitize filename
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .toLowerCase()
      const filename = `${Date.now()}-${safeName}`
      const filepath = path.join(uploadDir, filename)
      const urlPath = `/api/uploads/${year}/${month}/${filename}`

      await writeFile(filepath, buffer)

      // Get dimensions for raster images
      let width: number | undefined
      let height: number | undefined
      if (file.type !== 'image/svg+xml') {
        try {
          const sharp = (await import('sharp')).default
          const meta = await sharp(buffer).metadata()
          width = meta.width ?? undefined
          height = meta.height ?? undefined
        } catch {
          // non-critical
        }
      }

      // Store in DB
      await prisma.mediaItem.create({
        data: {
          filename,
          filepath: urlPath,
          altText: null,
          mimeType: file.type,
          size: buffer.length,
          width: width ?? null,
          height: height ?? null,
        },
      })

      results.push({
        name: filename,
        path: urlPath,
        size: buffer.length,
        width,
        height,
        mimeType: file.type,
        success: true,
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

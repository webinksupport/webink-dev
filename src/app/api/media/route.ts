import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readdir, stat, unlink, rename } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

interface MediaFile {
  id?: string
  name: string
  path: string
  size: number
  width?: number | null
  height?: number | null
  mimeType: string
  altText?: string | null
  modified: string
  source: 'uploads' | 'images'
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
  }
  return mimeMap[ext || ''] || 'application/octet-stream'
}

async function scanDirectory(
  dir: string,
  urlPrefix: string,
  source: 'uploads' | 'images'
): Promise<MediaFile[]> {
  const files: MediaFile[] = []
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const subFiles = await scanDirectory(
          fullPath,
          `${urlPrefix}/${entry.name}`,
          source
        )
        files.push(...subFiles)
      } else if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(entry.name)) {
        const stats = await stat(fullPath)
        files.push({
          name: entry.name,
          path: `${urlPrefix}/${entry.name}`,
          size: stats.size,
          mimeType: getMimeType(entry.name),
          modified: stats.mtime.toISOString(),
          source,
        })
      }
    }
  } catch {
    // directory doesn't exist, skip
  }
  return files
}

export async function GET(request: NextRequest) {
  const publicDir = path.join(process.cwd(), 'public')
  const searchParams = request.nextUrl.searchParams
  const typeFilter = searchParams.get('type') // 'images' | 'documents' | null
  const sort = searchParams.get('sort') || 'date' // 'date' | 'name' | 'size'
  const search = searchParams.get('search') || ''

  const [imagesFiles, uploadsFiles] = await Promise.all([
    scanDirectory(path.join(publicDir, 'images'), '/images', 'images'),
    scanDirectory(path.join(publicDir, 'uploads'), '/uploads', 'uploads'),
  ])

  let all = [...imagesFiles, ...uploadsFiles]

  // Enrich with DB metadata (alt text, dimensions)
  const dbItems = await prisma.mediaItem.findMany()
  const dbMap = new Map(dbItems.map((item) => [item.filepath, item]))

  all = all.map((file) => {
    const dbItem = dbMap.get(file.path)
    if (dbItem) {
      return {
        ...file,
        id: dbItem.id,
        altText: dbItem.altText,
        width: dbItem.width,
        height: dbItem.height,
      }
    }
    return file
  })

  // Filter by search
  if (search) {
    const q = search.toLowerCase()
    all = all.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q)
    )
  }

  // Filter by type
  if (typeFilter === 'images') {
    all = all.filter((f) => f.mimeType.startsWith('image/'))
  }

  // Sort
  if (sort === 'name') {
    all.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort === 'size') {
    all.sort((a, b) => b.size - a.size)
  } else {
    all.sort(
      (a, b) =>
        new Date(b.modified).getTime() - new Date(a.modified).getTime()
    )
  }

  return NextResponse.json(all)
}

// DELETE — delete file(s) by path
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { paths } = (await request.json()) as { paths: string[] }
    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: 'paths array is required' },
        { status: 400 }
      )
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const results: { path: string; success: boolean; error?: string }[] = []

    for (const filePath of paths) {
      // Only allow deleting from uploads directory
      if (!filePath.startsWith('/uploads/')) {
        results.push({
          path: filePath,
          success: false,
          error: 'Can only delete uploaded files',
        })
        continue
      }

      const relativePath = filePath.replace('/uploads/', '')
      const fullPath = path.resolve(uploadsDir, relativePath)

      // Prevent path traversal
      if (!fullPath.startsWith(uploadsDir)) {
        results.push({ path: filePath, success: false, error: 'Invalid path' })
        continue
      }

      try {
        await unlink(fullPath)
        // Remove from DB if exists
        await prisma.mediaItem
          .delete({ where: { filepath: filePath } })
          .catch(() => {})
        results.push({ path: filePath, success: true })
      } catch {
        results.push({ path: filePath, success: false, error: 'File not found' })
      }
    }

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

// PATCH — rename file or update alt text
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { filepath, altText, newFilename } = (await request.json()) as {
      filepath: string
      altText?: string
      newFilename?: string
    }

    if (!filepath) {
      return NextResponse.json(
        { error: 'filepath is required' },
        { status: 400 }
      )
    }

    let currentPath = filepath
    const publicDir = path.join(process.cwd(), 'public')

    // Handle rename
    if (newFilename && filepath.startsWith('/uploads/')) {
      const safeName = newFilename.replace(/[^a-zA-Z0-9._-]/g, '-')
      const dir = filepath.substring(0, filepath.lastIndexOf('/'))
      const newPath = `${dir}/${safeName}`
      const oldFull = path.join(publicDir, filepath)
      const newFull = path.join(publicDir, newPath)

      // Prevent traversal
      const uploadsDir = path.join(publicDir, 'uploads')
      if (
        !path.resolve(oldFull).startsWith(uploadsDir) ||
        !path.resolve(newFull).startsWith(uploadsDir)
      ) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
      }

      await rename(oldFull, newFull)

      // Update DB path
      await prisma.mediaItem
        .update({
          where: { filepath },
          data: { filepath: newPath, filename: safeName },
        })
        .catch(() => {})

      currentPath = newPath
    }

    // Upsert alt text and metadata in DB
    if (altText !== undefined) {
      const file = path.join(publicDir, currentPath)
      let width: number | undefined
      let height: number | undefined
      let size = 0
      let mimeType = getMimeType(currentPath)

      try {
        const stats = await stat(file)
        size = stats.size
        if (!currentPath.endsWith('.svg')) {
          const sharp = (await import('sharp')).default
          const meta = await sharp(file).metadata()
          width = meta.width ?? undefined
          height = meta.height ?? undefined
        }
      } catch {
        // file may not exist locally in some scenarios
      }

      await prisma.mediaItem.upsert({
        where: { filepath: currentPath },
        update: { altText },
        create: {
          filepath: currentPath,
          filename: currentPath.split('/').pop() || '',
          altText,
          mimeType,
          size,
          width: width ?? null,
          height: height ?? null,
        },
      })
    }

    return NextResponse.json({ success: true, filepath: currentPath })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Update failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'

interface MediaFile {
  name: string
  path: string
  size: number
  modified: string
}

async function scanDirectory(
  dir: string,
  urlPrefix: string
): Promise<MediaFile[]> {
  const files: MediaFile[] = []
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const subFiles = await scanDirectory(
          fullPath,
          `${urlPrefix}/${entry.name}`
        )
        files.push(...subFiles)
      } else if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(entry.name)) {
        const stats = await stat(fullPath)
        files.push({
          name: entry.name,
          path: `${urlPrefix}/${entry.name}`,
          size: stats.size,
          modified: stats.mtime.toISOString(),
        })
      }
    }
  } catch {
    // directory doesn't exist, skip
  }
  return files
}

export async function GET() {
  const publicDir = path.join(process.cwd(), 'public')

  const [imagesFiles, uploadsFiles] = await Promise.all([
    scanDirectory(path.join(publicDir, 'images'), '/images'),
    scanDirectory(path.join(publicDir, 'uploads'), '/uploads'),
  ])

  const all = [...imagesFiles, ...uploadsFiles].sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  )

  return NextResponse.json(all)
}

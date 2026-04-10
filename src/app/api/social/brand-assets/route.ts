import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

const ASSET_TYPE_FOLDERS: Record<string, string> = {
  Scout: 'scout',
  Logo: 'logo',
  Product: 'product',
  Background: 'background',
  Other: 'other',
}

// GET — list all brand assets
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const assets = await prisma.socialBrandAsset.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(assets)
}

// POST — upload brand asset (multipart)
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const files = formData.getAll('file') as File[]
    const assetType = (formData.get('assetType') as string) || 'Other'
    const clientName = (formData.get('clientName') as string) || null
    const altText = (formData.get('altText') as string) || null

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const maxSize = 10 * 1024 * 1024

    const subfolder = ASSET_TYPE_FOLDERS[assetType] || 'other'
    // Save to /app/uploads/ (persistent volume) — must use absolute path because
    // Next.js standalone mode sets process.cwd() to /app/.next/standalone/
    const uploadDir = path.join('/app', 'uploads', 'brand-assets', subfolder)
    await mkdir(uploadDir, { recursive: true })

    const results = []

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        results.push({ name: file.name, success: false, error: 'Invalid file type' })
        continue
      }
      if (file.size > maxSize) {
        results.push({ name: file.name, success: false, error: 'File too large (max 10MB)' })
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
      const filename = `${Date.now()}-${safeName}`
      const filepath = path.join(uploadDir, filename)
      const urlPath = `/api/uploads/brand-assets/${subfolder}/${filename}`

      await writeFile(filepath, buffer)

      const asset = await prisma.socialBrandAsset.create({
        data: {
          filename,
          filepath: urlPath,
          altText,
          assetType,
          clientName,
        },
      })

      results.push({ ...asset, success: true })
    }

    return NextResponse.json({ results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE — delete a brand asset by id
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const asset = await prisma.socialBrandAsset.findUnique({ where: { id } })
  if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Delete file from disk — filepath stored as /api/uploads/..., map to /app/uploads/...
  try {
    const diskPath = asset.filepath.replace(/^\/api\/uploads\//, '')
    const filePath = path.join('/app', 'uploads', diskPath)
    await unlink(filePath)
  } catch {
    // File may already be gone
  }

  await prisma.socialBrandAsset.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

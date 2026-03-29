import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      backgroundImagePath,
      backgroundColor,
      text,
      textPosition = 'center',
      fontSize = 'lg',
      textColor = '#FFFFFF',
      overlayOpacity = 0.5,
      brandColor = '#14EAEA',
      logoPath,
    } = body

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const sharp = (await import('sharp')).default

    // Canvas size (Instagram 4:5)
    const width = 1080
    const height = 1350

    let baseImage: Buffer

    if (backgroundImagePath) {
      // Load background image from disk
      // Images served via /api/uploads/ live in /app/uploads/ (persistent Docker volume)
      // Images in /uploads/ are in the public dir
      let bgFullPath: string
      if (backgroundImagePath.startsWith('/api/uploads/')) {
        bgFullPath = path.join('/app', 'uploads', backgroundImagePath.replace('/api/uploads/', ''))
      } else if (backgroundImagePath.startsWith('/uploads/')) {
        bgFullPath = path.join('/app', 'uploads', backgroundImagePath.replace('/uploads/', ''))
      } else {
        bgFullPath = path.join(process.cwd(), 'public', backgroundImagePath)
      }
      const bgBuffer = await readFile(bgFullPath)
      baseImage = await sharp(bgBuffer)
        .resize(width, height, { fit: 'cover' })
        .toBuffer()
    } else {
      // Solid color background
      const color = backgroundColor || '#0F0F0F'
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      baseImage = await sharp({
        create: { width, height, channels: 4, background: { r, g, b, alpha: 1 } },
      })
        .png()
        .toBuffer()
    }

    // Font size mapping
    const fontSizeMap: Record<string, number> = { sm: 48, md: 64, lg: 80 }
    const fSize = fontSizeMap[fontSize] || 64

    // Text position Y mapping
    const positionYMap: Record<string, number> = {
      top: Math.round(height * 0.2),
      center: Math.round(height * 0.5),
      bottom: Math.round(height * 0.78),
    }
    const textY = positionYMap[textPosition] || positionYMap.center

    // Word-wrap the text for SVG
    const maxCharsPerLine = Math.floor((width - 120) / (fSize * 0.55))
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length > maxCharsPerLine && currentLine) {
        lines.push(currentLine.trim())
        currentLine = word
      } else {
        currentLine = currentLine ? currentLine + ' ' + word : word
      }
    }
    if (currentLine.trim()) lines.push(currentLine.trim())

    const lineHeight = fSize * 1.3
    const totalTextHeight = lines.length * lineHeight
    const startY = textY - totalTextHeight / 2

    // Escape XML special characters
    const escapeXml = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

    // Build SVG text overlay with drop shadow
    const textLines = lines
      .map(
        (line, i) =>
          `<text x="50%" y="${startY + i * lineHeight}" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-weight="700" font-size="${fSize}" fill="${textColor}" filter="url(#shadow)">${escapeXml(line)}</text>`
      )
      .join('\n    ')

    // Semi-transparent overlay behind text
    const overlayAlpha = Math.max(0, Math.min(1, overlayOpacity))
    const overlayRectY = startY - lineHeight
    const overlayRectHeight = totalTextHeight + lineHeight * 2

    // Brand accent bar at bottom
    const accentBar = `<rect x="0" y="${height - 8}" width="${width}" height="8" fill="${brandColor}" />`

    const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.7"/>
        </filter>
      </defs>
      <rect x="0" y="${overlayRectY}" width="${width}" height="${overlayRectHeight}" fill="rgba(0,0,0,${overlayAlpha})" rx="16" />
      ${textLines}
      ${accentBar}
    </svg>`

    // Composite layers
    const composites: { input: Buffer; top: number; left: number }[] = [
      { input: Buffer.from(svgOverlay), top: 0, left: 0 },
    ]

    // Optionally add logo in bottom-right corner
    if (logoPath) {
      try {
        let logoFullPath: string
        if (logoPath.startsWith('/api/uploads/')) {
          logoFullPath = path.join('/app', 'uploads', logoPath.replace('/api/uploads/', ''))
        } else if (logoPath.startsWith('/uploads/')) {
          logoFullPath = path.join('/app', 'uploads', logoPath.replace('/uploads/', ''))
        } else {
          logoFullPath = path.join(process.cwd(), 'public', logoPath)
        }
        const logoBuffer = await readFile(logoFullPath)
        const resizedLogo = await sharp(logoBuffer)
          .resize(120, 120, { fit: 'inside' })
          .toBuffer()
        composites.push({ input: resizedLogo, top: height - 150, left: width - 150 })
      } catch {
        // Logo not found, skip
      }
    }

    const finalImage = await sharp(baseImage)
      .composite(composites)
      .png()
      .toBuffer()

    // Save to persistent Docker volume (not public/ which is ephemeral in standalone builds)
    const outputDir = path.join('/app', 'uploads', 'social')
    await mkdir(outputDir, { recursive: true })
    const filename = `overlay-${Date.now()}.png`
    const outputPath = path.join(outputDir, filename)
    await writeFile(outputPath, finalImage)

    const publicPath = `/api/uploads/social/${filename}`

    return NextResponse.json({ url: publicPath, filename })
  } catch (error) {
    console.error('Render overlay error:', error)
    const message = error instanceof Error ? error.message : 'Overlay rendering failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

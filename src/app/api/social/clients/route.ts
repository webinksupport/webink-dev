import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clients = await prisma.socialClient.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  // Create a brand profile for this client
  const brandProfile = await prisma.socialBrandProfile.create({
    data: {
      businessName: body.name,
      brandKeywords: body.instagramHandle || null,
    },
  })

  const client = await prisma.socialClient.create({
    data: {
      name: body.name,
      instagramHandle: body.instagramHandle || null,
      facebookPageId: body.facebookPageId || null,
      accessToken: body.accessToken || null,
      brandProfileId: brandProfile.id,
      status: 'ACTIVE',
    },
  })

  // Send invite email if provided
  if (body.inviteEmail) {
    try {
      const { createTransport } = await import('nodemailer')
      const { getSettings } = await import('@/lib/settings')
      const s = await getSettings(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'EMAIL_FROM_NAME', 'EMAIL_FROM_ADDRESS'])
      const transporter = createTransport({
        host: s.SMTP_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(s.SMTP_PORT || process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: s.SMTP_USERNAME || process.env.SMTP_USER,
          pass: s.SMTP_PASSWORD || process.env.SMTP_PASS,
        },
      })

      const fromName = s.EMAIL_FROM_NAME || 'Webink Solutions'
      const fromAddr = s.EMAIL_FROM_ADDRESS || process.env.SMTP_FROM || 'hello@webink.solutions'

      await transporter.sendMail({
        from: `"${fromName}" <${fromAddr}>`,
        to: body.inviteEmail,
        subject: `You've been invited to Social Media Studio — ${body.name}`,
        text: `Hi! You've been invited to manage social media for ${body.name} via Webink Solutions Social Media Studio. Visit https://dev.webink.solutions/admin/social to get started.`,
        html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0F0F0F;font-family:system-ui,sans-serif;"><div style="max-width:600px;margin:0 auto;padding:40px 24px;"><div style="text-align:center;margin-bottom:32px;"><h1 style="color:#14EAEA;font-size:28px;margin:0;">Webink Solutions</h1></div><div style="background:#1A1A1A;border-radius:16px;padding:32px;border:1px solid #333;"><h2 style="color:#fff;font-size:22px;margin:0 0 8px;">You're Invited!</h2><p style="color:#999;font-size:14px;">You've been invited to manage social media for <strong style="color:#fff;">${body.name}</strong> via Webink Solutions Social Media Studio.</p><a href="https://dev.webink.solutions/admin/social" style="display:inline-block;background:#14EAEA;color:#0A0A0A;font-weight:bold;padding:14px 28px;border-radius:100px;text-decoration:none;font-size:14px;margin-top:16px;">Get Started</a></div></div></body></html>`,
      })
    } catch (err) {
      console.error('[email] Failed to send client invite:', err)
    }
  }

  return NextResponse.json(client)
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { createTransport } from 'nodemailer'

// Simple in-memory rate limiter (resets on restart, good enough for prod)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 }) // 1 hour window
    return false
  }
  entry.count++
  return entry.count > 5 // 5 per hour per IP
}

async function getSmtpTransporter() {
  return createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Always return success to prevent email enumeration
    const successMessage = 'If an account with that email exists, a password reset link has been sent.'

    // Look up user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      // Don't reveal that the email doesn't exist
      return NextResponse.json({ message: successMessage })
    }

    // Invalidate any existing unused tokens for this email
    await prisma.passwordResetToken.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    })

    // Generate secure token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token
    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
      },
    })

    // Build reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'https://dev.webink.solutions'
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

    // Send email
    const transporter = await getSmtpTransporter()
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'hello@webink.solutions'

    await transporter.sendMail({
      from: `"Webink Solutions" <${fromAddress}>`,
      to: normalizedEmail,
      subject: 'Reset Your Password — Webink Solutions',
      text: `You requested a password reset for your Webink Solutions account.\n\nClick this link to reset your password (expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0F0F0F;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#14EAEA;font-size:28px;margin:0;">Webink Solutions</h1>
    </div>
    <div style="background:#1A1A1A;border-radius:16px;padding:32px;border:1px solid #333;">
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Reset Your Password</h2>
      <p style="color:#999;font-size:14px;margin:0 0 24px;">
        You requested a password reset for your Webink Solutions account. Click the button below to set a new password.
      </p>
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${resetUrl}" 
           style="display:inline-block;background:#F813BE;color:#fff;font-weight:bold;padding:14px 32px;border-radius:100px;text-decoration:none;font-size:14px;">
          Reset Password
        </a>
      </div>
      <p style="color:#666;font-size:12px;margin:0 0 8px;">This link expires in 1 hour and can only be used once.</p>
      <p style="color:#666;font-size:12px;margin:0;">If you didn't request this, you can safely ignore this email.</p>
      <p style="color:#444;font-size:11px;margin:16px 0 0;word-break:break-all;">${resetUrl}</p>
    </div>
    <p style="color:#666;font-size:12px;text-align:center;margin-top:24px;">
      Webink Solutions &middot; Sarasota, FL &middot; <a href="https://dev.webink.solutions" style="color:#14EAEA;text-decoration:none;">dev.webink.solutions</a>
    </p>
  </div>
</body>
</html>`,
    })

    console.log(`[forgot-password] Reset email sent to ${normalizedEmail}`)

    return NextResponse.json({ message: successMessage })
  } catch (error) {
    console.error('[forgot-password] Error:', error)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

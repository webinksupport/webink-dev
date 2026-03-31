import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { message: 'Reset token is required' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Find the token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json(
        { message: 'Invalid or expired reset link. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if already used
    if (resetToken.used) {
      return NextResponse.json(
        { message: 'This reset link has already been used. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if expired
    if (new Date() > resetToken.expiresAt) {
      // Mark as used so it can't be retried
      await prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      })
      return NextResponse.json(
        { message: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'No account found for this email.' },
        { status: 400 }
      )
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(password)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    })

    console.log(`[reset-password] Password reset successful for ${resetToken.email}`)

    return NextResponse.json({ message: 'Password has been reset successfully. You can now sign in.' })
  } catch (error) {
    console.error('[reset-password] Error:', error)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

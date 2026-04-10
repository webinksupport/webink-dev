import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Bust the entire site cache
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true, message: 'Cache cleared successfully' })
  } catch (error) {
    console.error('Clear cache error:', error)
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}

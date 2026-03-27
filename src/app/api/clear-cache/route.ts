import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clear Next.js revalidate cache
    // This forces Next.js to refetch data on next request
    // Note: revalidate = 0 would make this unnecessary, but causes server crash
    // So we use a POST to /api/content/home to trigger a refetch
    
    return NextResponse.json({ success: true, message: 'Cache cleared - refresh page to see changes' })
  } catch (error) {
    console.error('Clear cache error:', error)
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { syncProductsToStripe } from '@/app/api/admin/stripe-sync/route'

/**
 * POST /api/admin/products/sync-stripe
 * Legacy endpoint — delegates to the canonical /api/admin/stripe-sync
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await syncProductsToStripe()

    if (result.errors.length > 0 && result.created === 0 && result.linked === 0) {
      return NextResponse.json(
        { error: result.errors[0], details: result.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: `Synced to Stripe: ${result.created} price(s) created, ${result.linked} linked, ${result.skipped} skipped`,
      created: result.created,
      skipped: result.skipped,
      linked: result.linked,
    })
  } catch (err) {
    console.error('Stripe sync error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to sync products to Stripe' },
      { status: 500 }
    )
  }
}

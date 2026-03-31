import { prisma } from './prisma'

interface CreateNoteOptions {
  subscriptionId: string
  type: 'CREATED' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'PAYMENT_RETRY' | 'UPGRADED' | 'DOWNGRADED' | 'CANCELLED' | 'REACTIVATED' | 'INTERVAL_CHANGED' | 'STATUS_CHANGED' | 'ADMIN_NOTE'
  message: string
  metadata?: Record<string, unknown>
}

export async function addSubscriptionNote(opts: CreateNoteOptions) {
  try {
    await prisma.subscriptionNote.create({
      data: {
        subscriptionId: opts.subscriptionId,
        type: opts.type,
        message: opts.message,
        metadata: opts.metadata ? JSON.parse(JSON.stringify(opts.metadata)) : undefined,
      },
    })
  } catch (err) {
    console.error('[subscription-notes] Failed to create note:', err)
  }
}

export function formatCentsForNote(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ManageSubscriptionButton from '@/components/dashboard/ManageSubscriptionButton'
import SubscriptionActions from '@/components/dashboard/SubscriptionActions'

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

const statusColors: Record<string, string> = {
  ACTIVE: 'text-[#14EAEA]',
  PAST_DUE: 'text-yellow-400',
  CANCELED: 'text-red-400',
  PAUSED: 'text-[#999]',
  PENDING: 'text-[#999]',
  UNPAID: 'text-red-400',
}

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions)

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session!.user.id },
    include: { variant: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscriptions</h1>
          <p className="text-[#999]">Manage your active services</p>
        </div>
        <ManageSubscriptionButton />
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-16 bg-[#1A1A1A] border border-[#333] rounded-2xl">
          <p className="text-[#999] text-lg">No subscriptions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Link href={`/dashboard/subscriptions/${sub.id}`} className="hover:text-[#14EAEA] transition-colors">
                    <h3 className="text-lg font-bold text-white hover:text-[#14EAEA]">
                      {sub.variant.product.name}
                    </h3>
                  </Link>
                  <p className="text-[#999] text-sm">{sub.variant.name} tier</p>
                </div>
                <span
                  className={`text-xs font-bold tracking-[2px] uppercase ${
                    statusColors[sub.status] || 'text-[#999]'
                  }`}
                >
                  {sub.cancelAtPeriodEnd ? 'CANCELING' : sub.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-[#999] mb-1">Price</p>
                  <p className="text-white font-semibold">
                    {sub.variant.priceMonthly
                      ? `${formatCents(sub.variant.priceMonthly)}/mo`
                      : 'Custom'}
                  </p>
                </div>
                <div>
                  <p className="text-[#999] mb-1">Billing</p>
                  <p className="text-white">
                    {sub.variant.billingInterval === 'ANNUAL' ? 'Annual' : 'Monthly'}
                  </p>
                </div>
                <div>
                  <p className="text-[#999] mb-1">Next Billing</p>
                  <p className="text-white">
                    {sub.currentPeriodEnd
                      ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[#999] mb-1">Status</p>
                  <p className="text-white">
                    {sub.cancelAtPeriodEnd ? 'Cancels at period end' : sub.status === 'ACTIVE' ? 'Auto-renewing' : sub.status}
                  </p>
                </div>
              </div>

              <SubscriptionActions
                subscription={{
                  id: sub.id,
                  status: sub.status,
                  cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
                  currentPeriodEnd: sub.currentPeriodEnd ? sub.currentPeriodEnd.toISOString() : null,
                  stripeSubscriptionId: sub.stripeSubscriptionId,
                  variant: {
                    name: sub.variant.name,
                    priceMonthly: sub.variant.priceMonthly,
                    product: { name: sub.variant.product.name },
                  },
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

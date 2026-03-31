import { requireAdmin } from '@/lib/admin'
import SubscriptionDetail from './SubscriptionDetail'

export default async function AdminSubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  return <SubscriptionDetail subscriptionId={id} />
}

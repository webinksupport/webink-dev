import { requireAdmin } from '@/lib/admin'
import PageManager from './PageManager'

export default async function AdminPagesPage() {
  await requireAdmin()
  return <PageManager />
}

import { requireAdmin } from '@/lib/admin'
import MenuManager from './MenuManager'

export default async function AdminMenuPage() {
  await requireAdmin()
  return <MenuManager />
}

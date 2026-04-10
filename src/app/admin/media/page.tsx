import { requireAdmin } from '@/lib/admin'
import MediaLibrary from './MediaLibrary'

export default async function AdminMediaPage() {
  await requireAdmin()
  return <MediaLibrary />
}

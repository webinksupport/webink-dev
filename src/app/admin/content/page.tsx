import { requireAdmin } from '@/lib/admin'
import ContentEditor from './ContentEditor'

export default async function AdminContentPage() {
  await requireAdmin()
  return <ContentEditor />
}

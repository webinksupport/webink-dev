import { requireAdmin } from '@/lib/admin'
import SocialStudio from './SocialStudio'

export default async function AdminSocialPage() {
  await requireAdmin()
  return <SocialStudio />
}

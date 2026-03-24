import { requireAdmin } from '@/lib/admin'
import DashboardNav from '@/components/dashboard/DashboardNav'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <DashboardNav user={session.user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-8">
        <div className="lg:flex lg:gap-8">
          <AdminSidebar />
          <main className="flex-1 min-w-0 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

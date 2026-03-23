import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <DashboardNav user={session.user} />
      <main className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-8">
        {children}
      </main>
    </div>
  )
}

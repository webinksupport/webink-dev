'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'My Portal', icon: LayoutDashboard },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/dashboard/billing', label: 'Billing', icon: Receipt },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardNav({
  user,
}: {
  user: { name?: string | null; email: string; role: string }
}) {
  const pathname = usePathname()

  return (
    <nav className="border-b border-[#333] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white font-bold text-lg">
              Webink
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#1A1A1A] text-[#14EAEA]'
                        : 'text-[#999] hover:text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}

              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname.startsWith('/admin')
                      ? 'bg-[#1A1A1A] text-[#F813BE]'
                      : 'text-[#999] hover:text-white hover:bg-[#1A1A1A]'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#999] text-sm hidden sm:block">
              {user.name || user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-[#999] hover:text-white text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

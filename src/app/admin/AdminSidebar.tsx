'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  CreditCard,

  Image,
  Plug,
  Menu,
  X,
  MenuSquare,
  Files,
  Target,
  Share2,
} from 'lucide-react'

const navSections = [
  {
    title: 'Admin Dashboard',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutDashboard },
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/customers', label: 'Customers', icon: Users },
      { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/admin/leads', label: 'Leads', icon: Target },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/content', label: 'Pages', icon: Files },
      { href: '/admin/menu', label: 'Menu', icon: MenuSquare },
      { href: '/admin/media', label: 'Media Library', icon: Image },
    ],
  },
  {
    title: 'Social Media',
    items: [
      { href: '/admin/social', label: 'Social Studio', icon: Share2 },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/integrations', label: 'Integrations', icon: Plug },
    ],
  },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-6">
      {navSections.map((section, si) => (
        <div key={si}>
          {section.title && (
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#666] mb-2 px-3">
              {section.title}
            </p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#F813BE]'
                      : 'text-[#999] hover:text-white hover:bg-[#1A1A1A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between mb-6">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-white bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-sm"
        >
          <Menu className="w-4 h-4" />
          Menu
        </button>
        <span className="text-[#F813BE] text-xs font-bold tracking-[2px] uppercase">
          Webink Admin
        </span>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-[#0A0A0A] border-r border-[#333] z-50 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <span className="text-white font-bold text-sm">Admin Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-[#999] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-24">
          <SidebarNav />
        </div>
      </aside>
    </>
  )
}

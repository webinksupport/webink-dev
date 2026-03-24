'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Image,
  Plug,
} from 'lucide-react'

const navSections = [
  {
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/customers', label: 'Customers', icon: Users },
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/content', label: 'Page Editor', icon: FileText },
      { href: '/admin/media', label: 'Media Library', icon: Image },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/integrations', label: 'Integrations', icon: Plug },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:block w-52 shrink-0">
      <nav className="sticky top-24 space-y-6">
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
    </aside>
  )
}

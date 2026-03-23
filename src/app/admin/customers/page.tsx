import { prisma } from '@/lib/prisma'

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        include: { variant: { include: { product: true } } },
      },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
      <p className="text-[#999] mb-8">{customers.length} registered users</p>

      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Customer
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Role
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Active Subs
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Orders
              </th>
              <th className="text-left text-xs font-bold tracking-[2px] uppercase text-[#14EAEA] px-6 py-4">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-[#333]/50 last:border-0"
              >
                <td className="px-6 py-4">
                  <p className="text-white text-sm font-semibold">
                    {customer.name || '—'}
                  </p>
                  <p className="text-[#999] text-xs">{customer.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold tracking-[2px] uppercase ${
                      customer.role === 'ADMIN'
                        ? 'text-[#F813BE]'
                        : 'text-[#999]'
                    }`}
                  >
                    {customer.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {customer.subscriptions.length > 0 ? (
                    <div className="space-y-1">
                      {customer.subscriptions.map((sub) => (
                        <p key={sub.id} className="text-white text-xs">
                          {sub.variant.product.name} — {sub.variant.name}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#999] text-sm">None</span>
                  )}
                </td>
                <td className="px-6 py-4 text-white text-sm">
                  {customer._count.orders}
                </td>
                <td className="px-6 py-4 text-[#999] text-sm">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

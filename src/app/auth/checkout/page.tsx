import CheckoutAuthClient from './CheckoutAuthClient'

// Force dynamic rendering — standalone mode has issues serving static pages under nested paths
export const dynamic = 'force-dynamic'

export default function CheckoutAuthPage() {
  return <CheckoutAuthClient />
}

import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'

export const metadata: Metadata = {
  title: 'Refund Policy | Webink Solutions',
  description: 'Refund and cancellation policy for Webink Solutions services and subscriptions.',
}

export default function RefundPolicyPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4">Legal</p>
          <h1 className="font-urbanist font-black text-4xl lg:text-5xl text-[#1A1A1A] mb-10 leading-tight">
            Refund Policy
          </h1>

          <div className="prose prose-lg max-w-none text-[#333] space-y-6 text-[17px] leading-relaxed">
            <p><strong>Effective Date:</strong> March 1, 2026</p>
            <p>We want you to be completely satisfied with our services. This Refund Policy outlines when and how refunds are handled at Webink Solutions.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Monthly Subscriptions</h2>
            <p>All monthly subscriptions (web hosting, SEO, social media marketing, etc.) are billed on a recurring basis. You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period — no partial-month refunds are issued.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">One-Time Services</h2>
            <p>For one-time services (Google Business Profile Optimization, SEO Primer, etc.), refund eligibility depends on the stage of work:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Before work begins:</strong> Full refund available</li>
              <li><strong>Work in progress:</strong> Partial refund may be issued based on work completed</li>
              <li><strong>Work delivered:</strong> No refund after deliverables are provided</li>
            </ul>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Web Design Projects</h2>
            <p>Custom web design projects follow the payment schedule outlined in your service agreement. Deposits are non-refundable once design work has begun. Milestone payments are non-refundable once the associated deliverables are approved.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Web Hosting</h2>
            <p>Managed web hosting subscriptions can be cancelled at any time. We do not offer refunds for the current billing period, but your site will remain active through the end of the paid period.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">How to Request a Refund</h2>
            <p>To request a refund, please contact us:</p>
            <p>
              Email: hello@webink.solutions<br />
              Phone: (941) 840-1381<br />
              Webink Solutions, 1609 Georgetowne Blvd, Sarasota, FL 34232
            </p>
            <p>Refund requests are reviewed within 5 business days. Approved refunds are processed to the original payment method within 7–10 business days.</p>
          </div>
        </div>
      </section>
      <FooterI />
    </main>
  )
}

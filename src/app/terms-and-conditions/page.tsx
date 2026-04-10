import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Webink Solutions',
  description: 'Terms and Conditions for using Webink Solutions services and website.',
}

export default function TermsPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4">Legal</p>
          <h1 className="font-urbanist font-black text-4xl lg:text-5xl text-[#1A1A1A] mb-10 leading-tight">
            Terms &amp; Conditions
          </h1>

          <div className="prose prose-lg max-w-none text-[#333] space-y-6 text-[17px] leading-relaxed">
            <p><strong>Effective Date:</strong> March 1, 2026</p>
            <p>These Terms and Conditions (&quot;Terms&quot;) govern your use of the Webink Solutions website and services. By accessing or using our services, you agree to be bound by these Terms.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Services</h2>
            <p>Webink Solutions provides web design, SEO, digital marketing, web hosting, and related services. The specific scope, deliverables, and pricing for each engagement will be outlined in a separate service agreement or proposal.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Accounts</h2>
            <p>When you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are listed in USD and are billed as shown (monthly, annual, or one-time)</li>
              <li>Recurring subscriptions will auto-renew unless cancelled before the billing date</li>
              <li>Payments are processed securely through Stripe</li>
              <li>Late or failed payments may result in service suspension</li>
            </ul>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Intellectual Property</h2>
            <p>All content, designs, and code created by Webink Solutions remain our intellectual property until full payment is received. Upon full payment, ownership of deliverables transfers to the client as specified in the service agreement.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Limitation of Liability</h2>
            <p>Webink Solutions shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Governing Law</h2>
            <p>These Terms are governed by the laws of the State of Florida. Any disputes shall be resolved in the courts of Sarasota County, Florida.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Contact</h2>
            <p>
              Webink Solutions<br />
              1609 Georgetowne Blvd, Sarasota, FL 34232<br />
              Email: hello@webink.solutions<br />
              Phone: (941) 840-1381
            </p>
          </div>
        </div>
      </section>
      <FooterI />
    </main>
  )
}

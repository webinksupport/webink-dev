import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'

export const metadata: Metadata = {
  title: 'Privacy Policy | Webink Solutions',
  description: 'Privacy Policy for Webink Solutions — how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4">Legal</p>
          <h1 className="font-urbanist font-black text-4xl lg:text-5xl text-[#1A1A1A] mb-10 leading-tight">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-[#333] space-y-6 text-[17px] leading-relaxed">
            <p><strong>Effective Date:</strong> March 1, 2026</p>
            <p>Webink Solutions (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website webink.solutions. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Information We Collect</h2>
            <p>We may collect personal information that you voluntarily provide to us when you register on the website, make a purchase, fill out a form, or contact us. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, phone number, and mailing address</li>
              <li>Billing and payment information (processed securely via Stripe)</li>
              <li>Account credentials</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, operate, and maintain our services</li>
              <li>To process transactions and send related information</li>
              <li>To communicate with you, including customer service and updates</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Third-Party Services</h2>
            <p>We use third-party services including Stripe for payment processing, Google Analytics for website analytics, and email service providers for communications. These services have their own privacy policies governing the use of your information.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal information by contacting us at hello@webink.solutions.</p>

            <h2 className="font-urbanist font-bold text-2xl text-[#1A1A1A] mt-10 mb-4">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
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

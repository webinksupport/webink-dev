import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Custom CRM & SaaS Development Sarasota & Tampa | Webink Solutions',
  description:
    'Custom CRM and SaaS application development for businesses in Sarasota & Tampa. Streamline operations with tailored software solutions.',
}

export default function CustomCrmPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        eyebrow="Custom CRM & SaaS"
        headline="Software Built for"
        headlineAccent="Your Business."
        subtext="Purpose-built CRM and SaaS applications tailored to your workflows. Own your tools instead of renting them."
        heroImage="/images/ai/crm-network-abstract.png"
        features={[
          {
            icon: 'Code',
            title: 'Custom Development',
            description: 'Built from scratch to fit your exact workflows and processes. No bloated features you will never use.',
          },
          {
            icon: 'Cpu',
            title: 'AI Integration',
            description: 'Smart automation, predictive analytics, and AI-powered features that give your team a competitive edge.',
          },
          {
            icon: 'Shield',
            title: 'Enterprise Security',
            description: 'Role-based access, encryption, audit trails, and compliance-ready infrastructure from day one.',
          },
          {
            icon: 'Zap',
            title: 'Seamless Integration',
            description: 'Connect with your existing tools — Stripe, QuickBooks, email, calendars, and more via APIs.',
          },
        ]}
        processSteps={[
          {
            title: 'Discovery & Architecture',
            description: 'We map your current workflows, identify pain points, and design a system architecture that solves real problems.',
          },
          {
            title: 'Build & Iterate',
            description: 'Agile development with regular demos and feedback cycles. You see progress every week, not just at the end.',
          },
          {
            title: 'Deploy & Scale',
            description: 'We handle deployment, training, and ongoing support. Your software grows with your business.',
          },
        ]}
        pricing={[
          {
            name: 'Custom Project',
            price: '',
            contactOnly: true,
            features: [
              'Custom requirements analysis',
              'Tailored system architecture',
              'Full-stack development',
              'API integrations',
              'User training & documentation',
              'Ongoing maintenance & support',
            ],
          },
        ]}
        pricingNote="Every project is scoped individually. Contact us for a detailed proposal based on your requirements."
        faqs={[
          {
            question: 'How long does a custom CRM project take?',
            answer: 'Timelines vary based on complexity. A focused MVP can be ready in 6-10 weeks, while more comprehensive platforms may take 3-6 months. We provide a clear roadmap during discovery.',
          },
          {
            question: 'Can you integrate with our existing tools?',
            answer: 'Yes. We build integrations with Stripe, QuickBooks, Google Workspace, Slack, email platforms, and virtually any service with an API.',
          },
          {
            question: 'Do we own the code?',
            answer: 'Absolutely. You own 100% of the code and intellectual property we build for you. No vendor lock-in.',
          },
        ]}
      />
      <FooterI />
    </main>
  )
}

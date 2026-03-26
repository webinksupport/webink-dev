import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageJsonContent } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Custom CRM & SaaS Development Sarasota & Tampa | Webink Solutions',
  description:
    'Custom CRM and SaaS application development for businesses in Sarasota & Tampa. Streamline operations with tailored software solutions.',
  keywords: ['custom CRM Sarasota', 'AI CRM development', 'SaaS development Florida', 'custom software Tampa'],
}

const defaultPhotos = [
  { src: '/images/photos/workspace-dark.jpg', alt: 'Custom CRM development workspace — Webink Solutions software engineering', objectPosition: 'center' },
  { src: '/images/photoshoot/DSC04510-2.jpg', alt: 'Webink team building custom SaaS applications', objectPosition: 'top center' },
  { src: '/images/photos/team-duo.jpg', alt: 'Webink Solutions development team collaborating on CRM project', objectPosition: 'top center' },
]

const defaultFeatures = [
  { icon: 'Code', title: 'Custom Development', description: 'Built from scratch to fit your exact workflows and processes. No bloated features you will never use.' },
  { icon: 'Cpu', title: 'AI Integration', description: 'Smart automation, predictive analytics, and AI-powered features that give your team a competitive edge.' },
  { icon: 'Shield', title: 'Enterprise Security', description: 'Role-based access, encryption, audit trails, and compliance-ready infrastructure from day one.' },
  { icon: 'Zap', title: 'Seamless Integration', description: 'Connect with your existing tools — Stripe, QuickBooks, email, calendars, and more via APIs.' },
]

const defaultProcessSteps = [
  { title: 'Discovery & Architecture', description: 'We map your current workflows, identify pain points, and design a system architecture that solves real problems.' },
  { title: 'Build & Iterate', description: 'Agile development with regular demos and feedback cycles. You see progress every week, not just at the end.' },
  { title: 'Deploy & Scale', description: 'We handle deployment, training, and ongoing support. Your software grows with your business.' },
]

const defaultPricing = [
  {
    name: 'AI-Powered CRM',
    price: '',
    contactOnly: true,
    recommended: true,
    features: ['AI-powered workflow automation', 'Customer management & pipeline', 'Intelligent scheduling & reminders', 'Automated invoicing', 'Marketing automation', 'Custom reporting dashboards'],
  },
  {
    name: 'Custom SaaS Project',
    price: '',
    contactOnly: true,
    features: ['Custom requirements analysis', 'Tailored system architecture', 'Full-stack development', 'API integrations', 'User training & documentation', 'Ongoing maintenance & support'],
  },
]

const defaultFaqs = [
  { question: 'How long does a custom CRM project take?', answer: 'Timelines vary based on complexity. A focused MVP can be ready in 6-10 weeks, while more comprehensive platforms may take 3-6 months. We provide a clear roadmap during discovery.' },
  { question: 'Can you integrate with our existing tools?', answer: 'Yes. We build integrations with Stripe, QuickBooks, Google Workspace, Slack, email platforms, and virtually any service with an API.' },
  { question: 'Do we own the code?', answer: 'Absolutely. You own 100% of the code and intellectual property we build for you. No vendor lock-in.' },
]

export default async function CustomCrmPage() {
  const content = await getPageJsonContent('services/custom-crm')

  return (
    <PageEditorWrapper pageSlug="services/custom-crm">
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        pageSlug="services/custom-crm"
        eyebrow="Custom CRM & SaaS"
        headline={(content.hero_headline as string) || 'Software Built for'}
        headlineAccent="Your Business."
        subtext={(content.hero_subtext as string) || 'Purpose-built CRM and SaaS applications tailored to your workflows. Own your tools instead of renting them.'}
        heroImage={(content.hero_image as string) || '/images/services/crm-hero.png'}
        photos={(content.photos as typeof defaultPhotos) || defaultPhotos}
        features={(content.features as typeof defaultFeatures) || defaultFeatures}
        processSteps={(content.process_steps as typeof defaultProcessSteps) || defaultProcessSteps}
        pricing={(content.pricing as typeof defaultPricing) || defaultPricing}
        ctaText={(content.hero_cta_text as string) || 'Get a Free Quote'}
        ctaHref={(content.hero_cta_link as string) || '/contact'}
        pricingNote="Every project is scoped individually. Contact us for a detailed proposal based on your requirements."
        faqs={(content.faqs as typeof defaultFaqs) || defaultFaqs}
      />
      <FooterI />
    </main>
    </PageEditorWrapper>
  )
}

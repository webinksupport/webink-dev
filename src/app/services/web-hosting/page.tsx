import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageJsonContent } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Managed Web Hosting Sarasota | 3 Tiers from $31/mo | Webink Solutions',
  description:
    'Managed web hosting from $31/mo — Basic ($31/mo), Pro ($39/mo with dev hours), or Ultimate ($59/mo with dev hours). Free SSL, daily backups, and 24/7 monitoring. Annual billing saves ~10%.',
  keywords: ['managed WordPress hosting', 'website hosting Sarasota', 'managed web hosting Florida', 'WordPress hosting Tampa'],
  openGraph: {
    title: 'Managed Web Hosting | From $31/mo | Webink Solutions',
    description: 'Fully managed web hosting with free SSL, daily backups, and optional dev hours. 3 tiers starting at $31/mo. Annual billing available.',
    url: 'https://webink.solutions/services/web-hosting',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

const defaultPhotos = [
  { src: '/images/photos/workspace-dark.jpg', alt: 'Managed hosting infrastructure — Webink Solutions', objectPosition: 'center' },
  { src: '/images/photos/tech-laptop.jpg', alt: 'Webink Solutions hosting dashboard and monitoring', objectPosition: 'center' },
  { src: '/images/photoshoot/DSC04507-2.jpg', alt: 'Webink Solutions team managing hosting infrastructure', objectPosition: 'top center' },
]

const defaultFeatures = [
  { icon: 'Server', title: 'Fully Managed', description: 'We handle everything — server updates, security patches, performance tuning, and monitoring. You focus on your business.' },
  { icon: 'Shield', title: 'Free SSL & Security', description: 'Every plan includes a free SSL certificate, firewall protection, malware scanning, and DDoS mitigation.' },
  { icon: 'Zap', title: 'Blazing Fast', description: 'SSD-powered servers with global CDN, caching, and optimization for sub-2-second load times.' },
  { icon: 'Clock', title: 'Daily Backups', description: 'Automatic daily backups with one-click restore. Your data is always safe and recoverable.' },
]

const defaultProcessSteps = [
  { title: 'Migrate or Launch', description: 'We handle your site migration from any host — or set up your brand new site on our infrastructure. Zero downtime guaranteed.' },
  { title: 'Optimize & Secure', description: 'We configure caching, CDN, SSL, and security hardening. Your site launches fast and secure from day one.' },
  { title: 'Monitor & Maintain', description: 'Ongoing 24/7 monitoring, automatic updates, and proactive maintenance. If something breaks, we fix it before you notice.' },
]

const defaultPricing = [
  { name: 'Basic', price: '$31', period: 'mo', features: ['Hosting, SSL, daily backups', 'Uptime monitoring', 'WordPress managed updates', 'Dev time NOT included', 'Annual: $335/yr (save ~10%)'] },
  { name: 'Pro', price: '$39', period: 'mo', recommended: true, features: ['Everything in Basic', 'Development hours included', 'Priority support', 'Annual: $421/yr (save ~10%)'] },
  { name: 'Ultimate', price: '$59', period: 'mo', features: ['Everything in Pro', 'Additional development hours', 'Priority support', 'Performance optimization', 'Annual: $637/yr (save ~10%)'] },
]

const defaultFaqs = [
  { question: 'Can you migrate my existing website?', answer: 'Absolutely. We handle full site migrations from any hosting provider — WordPress, Squarespace, GoDaddy, or custom servers. We ensure zero downtime during the transition and verify everything works perfectly before switching DNS.' },
  { question: 'What is included in managed hosting?', answer: 'All plans include server management, security updates, SSL certificates, daily backups, uptime monitoring, and email support. Higher tiers add staging environments, performance optimization, and priority support.' },
  { question: 'Do you host WordPress sites?', answer: 'Yes. We host WordPress, Next.js, and custom-built sites. Our infrastructure is optimized for WordPress with auto-updates, caching, and security hardening built in.' },
  { question: 'What happens if my site goes down?', answer: 'Our 24/7 monitoring detects issues within minutes. We are alerted immediately and work to restore service as fast as possible. Most issues are resolved before clients even notice.' },
  { question: 'Can I add additional hosted sites?', answer: 'Yes. Additional hosted sites can be added to any plan for $15/mo each. Each additional site gets its own SSL, backups, and monitoring. Development hours from your main plan are shared across all sites.' },
  { question: 'Is there an SEO Check-Up add-on?', answer: 'Yes. Each hosting tier has an optional SEO Check-Up add-on that adds $30/mo to your plan. Annual pricing with the add-on is also available at a discount.' },
]

export default async function WebHostingPage() {
  const content = await getPageJsonContent('services/web-hosting')

  return (
    <PageEditorWrapper pageSlug="services/web-hosting">
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        pageSlug="services/web-hosting"
        eyebrow="Web Hosting"
        headline={(content.hero_headline as string) || 'Hosting That Just'}
        headlineAccent="Works."
        subtext={(content.hero_subtext as string) || 'Fully managed web hosting built for speed, security, and peace of mind. We handle the servers so you can focus on your business.'}
        heroImage={((content.hero_bg as any)?.src || content.hero_bg as string) || '/images/services/web-design-hero.png'}
        photos={(content.photos as typeof defaultPhotos) || defaultPhotos}
        features={(content.features as typeof defaultFeatures) || defaultFeatures}
        processSteps={(content.process_steps as typeof defaultProcessSteps) || defaultProcessSteps}
        pricing={(content.pricing as typeof defaultPricing) || defaultPricing}
        ctaText={(content.hero_cta_text as string) || 'Get Started'}
        ctaHref={(content.hero_cta_link as string) || '/products/managed-web-hosting'}
        productSlug="managed-web-hosting"
        pricingNote="All plans include free SSL, daily backups, and 24/7 monitoring. Annual billing saves ~10%. Optional SEO Check-Up add-on available. Add-on sites: $15/mo."
        faqs={(content.faqs as typeof defaultFaqs) || defaultFaqs}
      />
      <FooterI />
    </main>
    </PageEditorWrapper>
  )
}

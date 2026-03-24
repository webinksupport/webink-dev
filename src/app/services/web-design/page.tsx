import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Web Design Services Sarasota & Tampa | Webink Solutions',
  description:
    'Custom web design and development in Sarasota & Tampa, FL. Responsive, fast, SEO-ready websites built to convert. Get a free quote from Webink Solutions.',
  openGraph: {
    title: 'Web Design Services Sarasota & Tampa | Webink Solutions',
    description:
      'Custom responsive websites engineered for performance and conversion. Serving Sarasota, Tampa & Bradenton.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default function WebDesignPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        eyebrow="Web Design"
        headline="Websites That"
        headlineAccent="Convert."
        subtext="Custom responsive websites engineered for speed, performance, and real business growth. No templates. No shortcuts. Built from scratch for Sarasota and Tampa businesses."
        heroImage="/images/ai/sarasota-coast-aerial.png"
        features={[
          {
            icon: 'Globe',
            title: 'Responsive Design',
            description: 'Every site we build looks flawless on desktop, tablet, and mobile. No pinching, no zooming, no broken layouts.',
          },
          {
            icon: 'Zap',
            title: 'Fast Load Times',
            description: 'Performance-optimized builds with modern frameworks. Sub-2-second load times that keep visitors engaged and Google happy.',
          },
          {
            icon: 'Target',
            title: 'Conversion-Focused',
            description: 'Every design decision is tied to a business goal. Strategic CTAs, clear user flows, and layouts that turn visitors into customers.',
          },
          {
            icon: 'Search',
            title: 'SEO-Ready',
            description: 'Clean code, semantic HTML, structured data, and optimized images baked in from day one — not bolted on after launch.',
          },
        ]}
        processSteps={[
          {
            title: 'Discovery & Strategy',
            description: 'We learn your business, your audience, and your goals. We audit your current site, research competitors, and map out a strategy that drives results.',
          },
          {
            title: 'Design & Development',
            description: 'From wireframes to pixel-perfect builds — we design in the browser, iterate fast, and keep you in the loop at every stage.',
          },
          {
            title: 'Launch & Support',
            description: 'We handle deployment, DNS, SSL, and speed optimization. After launch, we provide ongoing support, hosting, and maintenance.',
          },
        ]}
        pricing={[
          {
            name: 'Custom Web Design',
            price: '',
            contactOnly: true,
            features: [
              'Custom responsive design',
              'Mobile-first development',
              'SEO-optimized structure',
              'Content management system',
              'Performance optimization',
              'SSL certificate included',
              '30-day post-launch support',
            ],
          },
        ]}
        pricingNote="Every project is unique. Contact us for a custom quote based on your specific needs and goals."
        faqs={[
          {
            question: 'How long does a typical web design project take?',
            answer: 'Most projects take 4-8 weeks from kickoff to launch, depending on complexity. A simple 5-page business site might be ready in 3-4 weeks, while a larger site with custom features or ecommerce can take 8-12 weeks. We provide a clear timeline during discovery.',
          },
          {
            question: 'Will my website be mobile-friendly?',
            answer: 'Absolutely. Every site we build is mobile-first, meaning we design for phones and tablets first, then scale up to desktop. Over 60% of web traffic in Sarasota comes from mobile devices — responsiveness is non-negotiable.',
          },
          {
            question: 'Can I update the site myself after launch?',
            answer: 'Yes. We build on modern platforms with user-friendly content management systems. We also provide training so you can make basic updates — text changes, new blog posts, image swaps — without needing a developer.',
          },
          {
            question: 'Do you redesign existing websites?',
            answer: 'We do. Whether your current site is outdated, slow, or just not converting, we can rebuild it from the ground up. We will also handle content migration and SEO preservation so you do not lose your existing search rankings.',
          },
        ]}
      />
      <FooterI />
    </main>
  )
}

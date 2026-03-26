import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageJsonContent } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'AI-Powered Marketing & AI Website Build | Webink Solutions Sarasota',
  description:
    'AI-powered websites built in 72 hours for $499. Custom AI CRM development. Leverage cutting-edge AI to automate, optimize, and scale your digital marketing in Sarasota & Tampa.',
  keywords: ['AI marketing Sarasota', 'AI website build', 'AI-powered CRM', 'marketing automation Florida', 'AI web design'],
  openGraph: {
    title: 'AI-Powered Marketing & AI Website Build | Webink Solutions',
    description: 'AI websites in 72 hours for $499. Custom AI CRM. Marketing automation for Sarasota & Tampa businesses.',
    url: 'https://webink.solutions/services/ai-marketing',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

const defaultPhotos = [
  { src: '/images/photos/tech-laptop.jpg', alt: 'AI marketing tools on laptop screen — Webink Solutions AI-powered marketing', objectPosition: 'center' },
  { src: '/images/photoshoot/DSC04603-2.jpg', alt: 'Webink Solutions AI marketing strategy session', objectPosition: 'top center' },
  { src: '/images/photoshoot/DSC05043.jpg', alt: 'Sean Rowe leveraging AI tools for digital marketing automation', objectPosition: 'top center' },
]

const defaultFeatures = [
  { icon: 'Brain', title: 'AI Content Generation', description: 'AI-assisted content creation that maintains your brand voice while scaling output across blogs, social media, and email campaigns.' },
  { icon: 'Cpu', title: 'Predictive Analytics', description: 'Machine learning models that forecast trends, identify opportunities, and help you stay ahead of your competition.' },
  { icon: 'Zap', title: 'Marketing Automation', description: 'Intelligent workflows that nurture leads, personalize customer journeys, and trigger the right message at the right time.' },
  { icon: 'BarChart3', title: 'AI-Powered Insights', description: 'Deep analysis of campaign performance, customer behavior, and market trends that surface actionable recommendations.' },
]

const defaultProcessSteps = [
  { title: 'Audit & Opportunity Mapping', description: 'We analyze your current marketing stack and identify where AI can create the most impact — whether it is content, automation, or analytics.' },
  { title: 'Implementation & Training', description: 'We integrate AI tools into your existing workflows, build custom automation, and train your team on new capabilities.' },
  { title: 'Optimize & Scale', description: 'Continuous refinement of AI models and automation. As the technology evolves, your marketing strategy evolves with it.' },
]

const defaultPricing = [
  {
    name: 'AI Website Build',
    price: '$499',
    features: ['Custom design in 72 hours', '5 professionally designed pages', 'Mobile responsive', 'SEO optimized', 'Contact form + Google Analytics', 'SSL + 30-day support'],
  },
  {
    name: 'AI-Powered CRM',
    price: '',
    contactOnly: true,
    recommended: true,
    features: ['Custom-built for your workflow', 'Customer management & pipeline', 'Scheduling & invoicing', 'Marketing automation', 'Custom reporting dashboards', 'Integration with existing tools'],
  },
  {
    name: 'AI Marketing Strategy',
    price: '',
    contactOnly: true,
    features: ['AI marketing audit & strategy', 'Content generation workflows', 'Marketing automation setup', 'Predictive analytics integration', 'Team training & documentation', 'Ongoing optimization & support'],
  },
]

const defaultFaqs = [
  { question: 'What is the AI Website Build?', answer: 'Our AI Website Build is a professional, SEO-optimized website built and launched in just 72 hours for $499. It includes custom design, 5 pages, mobile responsiveness, contact form, Google Analytics, SSL, and 30 days of post-launch support. Perfect for small businesses that need to get online fast.' },
  { question: 'What does the AI-Powered CRM include?', answer: 'Our AI-Powered CRM is custom-built around your specific business workflow. It can include customer management, scheduling, invoicing, marketing automation, custom dashboards, and integrations with tools you already use. Pricing depends on scope — contact us for a custom quote.' },
  { question: 'Will AI replace my marketing team?', answer: 'No. AI enhances your team by handling repetitive tasks and surfacing insights. Your team focuses on strategy, creativity, and relationship building while AI handles the heavy lifting.' },
  { question: 'What AI tools do you use?', answer: 'We work with a range of tools including custom-built solutions, OpenAI, and specialized marketing AI platforms. We recommend the right tools based on your specific needs and budget.' },
  { question: 'Is AI-generated content quality good enough?', answer: 'With the right prompting, editing, and quality control processes, AI-assisted content is indistinguishable from human-written content. We always have human editors review and refine AI output before it goes live.' },
  { question: 'How fast can you build an AI website?', answer: '72 hours from project kickoff to live website. We use AI-powered design tools combined with our expertise to deliver a professional site incredibly fast. You will be involved in the design approval process before we go live.' },
]

export default async function AiMarketingPage() {
  const content = await getPageJsonContent('services/ai-marketing')

  return (
    <PageEditorWrapper pageSlug="services/ai-marketing">
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        pageSlug="services/ai-marketing"
        eyebrow="AI-Powered Marketing"
        headline={(content.hero_headline as string) || 'Marketing at the'}
        headlineAccent="Speed of AI."
        subtext={(content.hero_subtext as string) || 'We leverage AI to automate repetitive tasks, uncover insights humans miss, and scale your marketing beyond what traditional agencies can deliver.'}
        heroImage={(content.hero_image as string) || '/images/services/ai-marketing-hero.png'}
        photos={(content.photos as typeof defaultPhotos) || defaultPhotos}
        features={(content.features as typeof defaultFeatures) || defaultFeatures}
        processSteps={(content.process_steps as typeof defaultProcessSteps) || defaultProcessSteps}
        pricing={(content.pricing as typeof defaultPricing) || defaultPricing}
        ctaText={(content.hero_cta_text as string) || 'Get a Free Quote'}
        ctaHref={(content.hero_cta_link as string) || '/contact'}
        pricingNote="AI Website Build: $499 one-time. AI-Powered CRM: Custom pricing based on scope — contact us for a quote. AI Marketing Strategy: Tailored to your business needs."
        faqs={(content.faqs as typeof defaultFaqs) || defaultFaqs}
      />
      <FooterI />
    </main>
    </PageEditorWrapper>
  )
}

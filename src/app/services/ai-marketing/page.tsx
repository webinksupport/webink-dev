import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'AI-Powered Marketing Sarasota & Tampa | Webink Solutions',
  description:
    'Leverage cutting-edge AI tools to automate, optimize, and scale your digital marketing in Sarasota & Tampa.',
}

export default function AiMarketingPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        eyebrow="AI-Powered Marketing"
        headline="Marketing at the"
        headlineAccent="Speed of AI."
        subtext="We leverage AI to automate repetitive tasks, uncover insights humans miss, and scale your marketing beyond what traditional agencies can deliver."
        heroImage="/images/services/ai-marketing-hero.png"
        features={[
          {
            icon: 'Brain',
            title: 'AI Content Generation',
            description: 'AI-assisted content creation that maintains your brand voice while scaling output across blogs, social media, and email campaigns.',
          },
          {
            icon: 'Cpu',
            title: 'Predictive Analytics',
            description: 'Machine learning models that forecast trends, identify opportunities, and help you stay ahead of your competition.',
          },
          {
            icon: 'Zap',
            title: 'Marketing Automation',
            description: 'Intelligent workflows that nurture leads, personalize customer journeys, and trigger the right message at the right time.',
          },
          {
            icon: 'BarChart3',
            title: 'AI-Powered Insights',
            description: 'Deep analysis of campaign performance, customer behavior, and market trends that surface actionable recommendations.',
          },
        ]}
        processSteps={[
          {
            title: 'Audit & Opportunity Mapping',
            description: 'We analyze your current marketing stack and identify where AI can create the most impact — whether it is content, automation, or analytics.',
          },
          {
            title: 'Implementation & Training',
            description: 'We integrate AI tools into your existing workflows, build custom automation, and train your team on new capabilities.',
          },
          {
            title: 'Optimize & Scale',
            description: 'Continuous refinement of AI models and automation. As the technology evolves, your marketing strategy evolves with it.',
          },
        ]}
        pricing={[
          {
            name: 'AI Marketing',
            price: '',
            contactOnly: true,
            features: [
              'AI marketing audit & strategy',
              'Content generation workflows',
              'Marketing automation setup',
              'Predictive analytics integration',
              'Team training & documentation',
              'Ongoing optimization & support',
            ],
          },
        ]}
        pricingNote="AI marketing services are tailored to your business needs. Contact us for a custom strategy and quote."
        faqs={[
          {
            question: 'Will AI replace my marketing team?',
            answer: 'No. AI enhances your team by handling repetitive tasks and surfacing insights. Your team focuses on strategy, creativity, and relationship building while AI handles the heavy lifting.',
          },
          {
            question: 'What AI tools do you use?',
            answer: 'We work with a range of tools including custom-built solutions, OpenAI, and specialized marketing AI platforms. We recommend the right tools based on your specific needs and budget.',
          },
          {
            question: 'Is AI-generated content quality good enough?',
            answer: 'With the right prompting, editing, and quality control processes, AI-assisted content is indistinguishable from human-written content. We always have human editors review and refine AI output before it goes live.',
          },
        ]}
      />
      <FooterI />
    </main>
  )
}

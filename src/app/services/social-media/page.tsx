import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Social Media Marketing Sarasota & Tampa | Webink Solutions',
  description:
    'Social media marketing services in Sarasota & Tampa starting at $493/mo. Content creation, community management, analytics, and multi-platform strategy.',
  openGraph: {
    title: 'Social Media Marketing Sarasota & Tampa | Webink Solutions',
    description:
      'Social media management starting at $493/mo — content creation, scheduling, community management, and analytics.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default function SocialMediaPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        eyebrow="Social Media Marketing"
        headline="Grow Your"
        headlineAccent="Audience."
        subtext="Strategic social media management that builds your brand, engages your community, and drives real business results across every major platform."
        heroImage="/images/services/social-media-hero.png"
        photos={[
          { src: '/images/photos/team-rooftop.jpg', alt: 'Webink Solutions team on rooftop — Sarasota social media marketing agency' },
          { src: '/images/photoshoot/DSC04520.jpg', alt: 'Creative content planning session at Webink Solutions' },
          { src: '/images/photoshoot/SquareSean.jpg', alt: 'Sean Rowe — founder of Webink Solutions social media team' },
        ]}
        features={[
          {
            icon: 'Palette',
            title: 'Content Creation',
            description: 'Scroll-stopping graphics, compelling copy, and branded templates tailored to each platform. We create content that represents your business.',
          },
          {
            icon: 'Users',
            title: 'Community Management',
            description: 'We monitor, respond, and engage with your audience in real time. Building relationships that convert followers into loyal customers.',
          },
          {
            icon: 'BarChart3',
            title: 'Analytics & Reporting',
            description: 'Clear monthly reports on reach, engagement, follower growth, and conversions. Data-driven insights that guide strategy.',
          },
          {
            icon: 'Share2',
            title: 'Multi-Platform Strategy',
            description: 'Cohesive strategies across Facebook, Instagram, LinkedIn, TikTok, and more — tailored to where your audience actually spends time.',
          },
        ]}
        processSteps={[
          {
            title: 'Strategy Development',
            description: 'We research your audience, competitors, and industry. Then we build a custom social media strategy with a content calendar, posting schedule, and KPIs.',
          },
          {
            title: 'Content Creation & Scheduling',
            description: 'Our team creates branded content, writes copy, and schedules posts at optimal times. You approve everything before it goes live.',
          },
          {
            title: 'Engagement & Growth',
            description: 'We actively manage your accounts — responding to comments, engaging with your community, and continuously refining strategy based on performance data.',
          },
        ]}
        pricing={[
          {
            name: 'Entry',
            price: '$493',
            period: 'mo',
            features: [
              'Basic posting schedule',
              '1 platform managed',
              'Content calendar',
              'Monthly analytics report',
            ],
          },
          {
            name: 'Basic',
            price: '$613',
            period: 'mo',
            features: [
              '2 platforms managed',
              'Content calendar & scheduling',
              'Basic engagement management',
              'Monthly analytics report',
            ],
          },
          {
            name: 'Standard',
            price: '$733',
            period: 'mo',
            recommended: true,
            features: [
              '3 platforms managed',
              'Full content creation',
              'Engagement management',
              'Bi-weekly reporting',
            ],
          },
          {
            name: 'Pro',
            price: '$793',
            period: 'mo',
            features: [
              '3+ platforms managed',
              'Advanced analytics',
              'Ad integration support',
              'Weekly strategy calls',
            ],
          },
        ]}
        pricingNote="9 tiers available to fit any budget — contact us for full pricing details."
        faqs={[
          {
            question: 'Which social media platforms do you manage?',
            answer: 'We manage Facebook, Instagram, LinkedIn, TikTok, X (Twitter), Pinterest, and YouTube. We will recommend the platforms that make the most sense for your business and audience — most Sarasota businesses see the best ROI from Facebook, Instagram, and LinkedIn.',
          },
          {
            question: 'What types of content do you create?',
            answer: 'We create a mix of static graphics, short-form video, carousel posts, stories, reels, and written content. Everything is branded to your business and designed to engage your specific audience.',
          },
          {
            question: 'How often will you post on my accounts?',
            answer: 'Posting frequency depends on your plan and platform. Entry plans include 3-4 posts per week on one platform, while higher tiers include daily posts across multiple platforms plus stories and engagement content.',
          },
          {
            question: 'Do I need to provide content ideas?',
            answer: 'No — we handle the full content strategy. That said, we love when clients share behind-the-scenes photos, team events, or business news. It makes your social presence more authentic and gives us great material to work with.',
          },
        ]}
      />
      <FooterI />
    </main>
  )
}

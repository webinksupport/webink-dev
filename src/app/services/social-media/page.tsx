import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageJsonContent } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Social Media Marketing Sarasota & Tampa | Webink Solutions',
  description:
    'Social media marketing services in Sarasota & Tampa starting at $493/mo. Content creation, community management, analytics, and multi-platform strategy.',
  keywords: ['social media marketing Sarasota', 'Instagram marketing Florida', 'Facebook marketing Sarasota', 'social media management Tampa'],
  openGraph: {
    title: 'Social Media Marketing Sarasota & Tampa | Webink Solutions',
    description: 'Social media management starting at $493/mo — content creation, scheduling, community management, and analytics.',
    url: 'https://webink.solutions/services/social-media',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

const defaultPhotos = [
  { src: '/images/photos/team-rooftop.jpg', alt: 'Webink Solutions team on rooftop — Sarasota social media marketing agency', objectPosition: 'center' },
  { src: '/images/photoshoot/DSC04520.jpg', alt: 'Creative content planning session at Webink Solutions', objectPosition: 'top center' },
  { src: '/images/photoshoot/SquareSean.jpg', alt: 'Sean Rowe — founder of Webink Solutions social media team', objectPosition: 'top center' },
]

const defaultFeatures = [
  { icon: 'Palette', title: 'Content Creation', description: 'Scroll-stopping graphics, compelling copy, and branded templates tailored to each platform. We create content that represents your business.' },
  { icon: 'Users', title: 'Community Management', description: 'We monitor, respond, and engage with your audience in real time. Building relationships that convert followers into loyal customers.' },
  { icon: 'BarChart3', title: 'Analytics & Reporting', description: 'Clear monthly reports on reach, engagement, follower growth, and conversions. Data-driven insights that guide strategy.' },
  { icon: 'Share2', title: 'Multi-Platform Strategy', description: 'Cohesive strategies across Facebook, Instagram, LinkedIn, TikTok, and more — tailored to where your audience actually spends time.' },
]

const defaultProcessSteps = [
  { title: 'Strategy Development', description: 'We research your audience, competitors, and industry. Then we build a custom social media strategy with a content calendar, posting schedule, and KPIs.' },
  { title: 'Content Creation & Scheduling', description: 'Our team creates branded content, writes copy, and schedules posts at optimal times. You approve everything before it goes live.' },
  { title: 'Engagement & Growth', description: 'We actively manage your accounts — responding to comments, engaging with your community, and continuously refining strategy based on performance data.' },
]

const defaultPricing = [
  { name: 'Basic', price: '$493', period: 'mo', features: ['Content calendar & scheduling', 'Community management', 'Monthly analytics report', 'Add 2 videos: $613/mo', 'Add 4 videos: $733/mo'] },
  { name: 'Pro', price: '$793', period: 'mo', recommended: true, features: ['Multi-platform management', 'Full content creation', 'Engagement management', 'Bi-weekly reporting', 'Add 2 videos: $913/mo', 'Add 4 videos: $1,033/mo'] },
  { name: 'Ultimate', price: '$993', period: 'mo', features: ['All platforms managed', 'Advanced analytics & strategy', 'Ad integration support', 'Weekly strategy calls', 'Add 2 videos: $1,113/mo', 'Add 4 videos: $1,233/mo'] },
]

const defaultFaqs = [
  { question: 'Which social media platforms do you manage?', answer: 'We manage Facebook, Instagram, LinkedIn, TikTok, X (Twitter), Pinterest, and YouTube. We will recommend the platforms that make the most sense for your business and audience — most Sarasota businesses see the best ROI from Facebook, Instagram, and LinkedIn.' },
  { question: 'What types of content do you create?', answer: 'We create a mix of static graphics, short-form video, carousel posts, stories, reels, and written content. Everything is branded to your business and designed to engage your specific audience.' },
  { question: 'How often will you post on my accounts?', answer: 'Posting frequency depends on your plan and platform. Entry plans include 3-4 posts per week on one platform, while higher tiers include daily posts across multiple platforms plus stories and engagement content.' },
  { question: 'Do I need to provide content ideas?', answer: 'No — we handle the full content strategy. That said, we love when clients share behind-the-scenes photos, team events, or business news. It makes your social presence more authentic and gives us great material to work with.' },
]

export default async function SocialMediaPage() {
  const content = await getPageJsonContent('services/social-media')

  return (
    <PageEditorWrapper pageSlug="services/social-media">
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        pageSlug="services/social-media"
        eyebrow="Social Media Marketing"
        headline={(content.hero_headline as string) || 'Grow Your'}
        headlineAccent="Audience."
        subtext={(content.hero_subtext as string) || 'Strategic social media management that builds your brand, engages your community, and drives real business results across every major platform.'}
        heroImage={((content.hero_bg as any)?.src || content.hero_bg as string) || '/images/services/social-media-hero.png'}
        photos={(content.photos as typeof defaultPhotos) || defaultPhotos}
        features={(content.features as typeof defaultFeatures) || defaultFeatures}
        processSteps={(content.process_steps as typeof defaultProcessSteps) || defaultProcessSteps}
        pricing={(content.pricing as typeof defaultPricing) || defaultPricing}
        ctaText={(content.hero_cta_text as string) || 'Get Started'}
        ctaHref={(content.hero_cta_link as string) || '/products/social-media-marketing'}
        productSlug="social-media-marketing"
        pricingNote="$99 signup fee. Optional short-form video add-on available. Standalone Short Form Video Marketing also available: Basic $160/mo, Pro $320/mo, Ultimate $480/mo ($49 signup fee)."
        faqs={(content.faqs as typeof defaultFaqs) || defaultFaqs}
      />
      <FooterI />
    </main>
    </PageEditorWrapper>
  )
}

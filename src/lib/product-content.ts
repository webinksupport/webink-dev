// Product content configuration — tier descriptions, FAQs, feature matrices, testimonials
// This is the CONTENT layer; pricing data comes from the DB via ProductVariant

export type TierKey = 'basic' | 'pro' | 'ultimate'

export interface TierContent {
  tagline: string
  description: string
  perfectFor: string
  highlightedFeatures: string[]
  notIncluded: string[]
}

export interface FeatureCategory {
  name: string
  features: {
    name: string
    basic: boolean | string
    pro: boolean | string
    ultimate: boolean | string
  }[]
}

export interface FAQ {
  question: string
  answer: string
}

export interface Testimonial {
  quote: string
  name: string
  business: string
  location: string
  service: string
  rating: number
}

export interface ProductContent {
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  tiers: Record<TierKey, TierContent>
  featureMatrix: FeatureCategory[]
  faqs: FAQ[]
  testimonials: Testimonial[]
}

// ─── Managed Web Hosting ────────────────────────────────────────────────
const managedWebHosting: ProductContent = {
  slug: 'managed-web-hosting',
  name: 'Managed Web Hosting',
  tagline: 'Your site, handled.',
  description: 'Enterprise-grade WordPress hosting with 24/7 monitoring, automatic updates, and security protection.',
  category: 'Hosting',
  tiers: {
    basic: {
      tagline: 'Reliable, hands-off hosting',
      description: 'For established small businesses with an existing WordPress site who want to stop worrying about security and updates. You get enterprise hosting, 24/7 uptime monitoring, and automated backups — but development work is billed separately as needed.',
      perfectFor: 'Perfect if you\'re a small business owner who wants reliable hosting without the headaches.',
      highlightedFeatures: [
        '99.9% uptime SLA',
        'SSL certificate included',
        'CDN & performance optimization',
        'Malware monitoring & protection',
        'Daily automated backups',
        'Email support',
      ],
      notIncluded: [
        'Staging environment',
        'Dedicated resources',
        'Priority response',
        'Development hours included',
      ],
    },
    pro: {
      tagline: 'Active website management',
      description: 'For growing businesses that need their website actively maintained. Includes everything in Basic plus 2 hours/month of dev time for content updates, minor design tweaks, and plugin management.',
      perfectFor: 'Perfect if you\'re a growing business that needs ongoing website updates without hiring a developer.',
      highlightedFeatures: [
        'Everything in Basic',
        'Staging environment',
        '2 hrs/mo development time',
        'Content updates & plugin management',
        'Security audit reports',
        'Priority email support',
      ],
      notIncluded: [
        'Dedicated resources',
        'Phone/chat support',
        'Performance reports',
      ],
    },
    ultimate: {
      tagline: 'Full managed web presence',
      description: 'For businesses treating their website as a sales channel. Full managed service with priority support, performance optimization, analytics reporting, and 4 hours/month of dedicated development time.',
      perfectFor: 'Perfect if your website is a primary revenue driver and you need it performing at its best.',
      highlightedFeatures: [
        'Everything in Pro',
        'Dedicated server resources',
        '4 hrs/mo development time',
        'Phone & chat support',
        'Performance & analytics reports',
        'Priority response guarantee',
      ],
      notIncluded: [],
    },
  },
  featureMatrix: [
    {
      name: 'Hosting Infrastructure',
      features: [
        { name: 'Server Uptime SLA', basic: '99.9%', pro: '99.9%', ultimate: '99.9%' },
        { name: 'SSL Certificate', basic: true, pro: true, ultimate: true },
        { name: 'CDN & Performance', basic: true, pro: true, ultimate: true },
        { name: 'Staging Environment', basic: false, pro: true, ultimate: true },
        { name: 'Dedicated Resources', basic: false, pro: false, ultimate: true },
      ],
    },
    {
      name: 'Security',
      features: [
        { name: 'Malware Monitoring', basic: true, pro: true, ultimate: true },
        { name: 'Threat Protection', basic: true, pro: true, ultimate: true },
        { name: 'Daily Backups', basic: true, pro: true, ultimate: true },
        { name: 'Security Audit Reports', basic: false, pro: true, ultimate: true },
      ],
    },
    {
      name: 'Support',
      features: [
        { name: 'Email Support', basic: true, pro: true, ultimate: true },
        { name: 'Priority Response', basic: false, pro: true, ultimate: true },
        { name: 'Phone/Chat Support', basic: false, pro: false, ultimate: true },
      ],
    },
    {
      name: 'Development',
      features: [
        { name: 'Dev Time Included', basic: 'None', pro: '2 hrs/mo', ultimate: '4 hrs/mo' },
        { name: 'Content Updates', basic: false, pro: true, ultimate: true },
        { name: 'Plugin Management', basic: true, pro: true, ultimate: true },
        { name: 'Performance Reports', basic: false, pro: false, ultimate: true },
      ],
    },
  ],
  faqs: [
    { question: 'What happens if my site gets hacked?', answer: 'We monitor for malware 24/7 and take immediate action if a threat is detected. Our security stack includes firewalls, brute-force protection, and daily backups so we can restore your site quickly if needed. You\'re never left hanging.' },
    { question: 'Can I still make changes to my own site?', answer: 'Absolutely. You retain full admin access to your WordPress dashboard. For Pro and Ultimate plans, we also handle updates for you — just send us what you need and we\'ll take care of it within your included dev hours.' },
    { question: 'What\'s the setup fee for?', answer: 'The one-time setup fee covers migration of your existing site to our infrastructure, SSL configuration, CDN setup, security hardening, and performance optimization. It\'s the foundation work that ensures everything runs smoothly from day one.' },
    { question: 'Do I need to have a WordPress site already?', answer: 'No. If you need a new site built, we offer custom web design services separately. Once your site is ready, we\'ll host and manage it under one of these plans.' },
    { question: 'What\'s included in the monthly development hours?', answer: 'Content updates, minor design tweaks, plugin updates and troubleshooting, performance optimization, and small feature additions. Major redesigns or new feature builds are quoted separately.' },
    { question: 'What\'s the difference between Basic, Pro, and Ultimate?', answer: 'Basic is hands-off hosting with monitoring and backups. Pro adds 2 hours/month of dev time for ongoing content and maintenance. Ultimate is the full package — 4 dev hours, priority support, dedicated resources, and performance reporting.' },
  ],
  testimonials: [
    {
      quote: 'We haven\'t had a single hack or downtime issue since switching to Webink\'s managed hosting. Their team handles everything so we can focus on running our business.',
      name: 'Sarah M.',
      business: 'Gulf Sands Realty',
      location: 'Sarasota, FL',
      service: 'Managed Hosting client since 2023',
      rating: 5,
    },
    {
      quote: 'The peace of mind alone is worth it. Backups, updates, security — it\'s all handled. And when we need changes, they\'re done within hours.',
      name: 'Mike T.',
      business: 'Bradenton Auto Group',
      location: 'Bradenton, FL',
      service: 'Managed Hosting Pro',
      rating: 5,
    },
  ],
}

// ─── Fully Managed SEO ──────────────────────────────────────────────────
const fullyManagedSeo: ProductContent = {
  slug: 'fully-managed-seo',
  name: 'Fully Managed SEO',
  tagline: 'Rankings that drive revenue.',
  description: 'Data-driven SEO strategies that put your business in front of the right customers. Technical audits, content strategy, and transparent monthly reporting.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'Foundation SEO package',
      description: 'Get your SEO fundamentals locked in. Technical audit, keyword research, on-page optimization, and monthly reporting to track your progress.',
      perfectFor: 'Perfect if you\'re just getting started with SEO and want a solid foundation to build on.',
      highlightedFeatures: [
        'Technical SEO audit & fixes',
        'Keyword research & tracking',
        'On-page optimization',
        'Google Business Profile setup',
        'Monthly performance reports',
        'Email support',
      ],
      notIncluded: ['Content creation', 'Link building', 'Bi-weekly calls'],
    },
    pro: {
      tagline: 'Growth-focused SEO',
      description: 'Everything in Basic plus content strategy, link building, and competitor analysis. For businesses ready to actively grow their organic traffic.',
      perfectFor: 'Perfect if you\'re ready to invest in growth and want content + links driving real traffic.',
      highlightedFeatures: [
        'Everything in Basic',
        'Content strategy & creation',
        'Link building campaigns',
        'Competitor analysis',
        'Bi-weekly performance calls',
        'Priority support',
      ],
      notIncluded: ['Dedicated account manager', 'Weekly reports'],
    },
    ultimate: {
      tagline: 'Full-service SEO partnership',
      description: 'The complete package. Dedicated account manager, weekly reporting, priority support, and advanced conversion tracking. For businesses where organic search is a primary revenue channel.',
      perfectFor: 'Perfect if organic search is a major revenue driver and you need the best possible results.',
      highlightedFeatures: [
        'Everything in Pro',
        'Dedicated account manager',
        'Weekly performance reports',
        'Advanced conversion tracking',
        'Priority support guarantee',
        'Custom strategy sessions',
      ],
      notIncluded: [],
    },
  },
  featureMatrix: [
    {
      name: 'Technical SEO',
      features: [
        { name: 'Site Audit & Fixes', basic: true, pro: true, ultimate: true },
        { name: 'Core Web Vitals', basic: true, pro: true, ultimate: true },
        { name: 'Schema Markup', basic: true, pro: true, ultimate: true },
        { name: 'Crawl Optimization', basic: true, pro: true, ultimate: true },
      ],
    },
    {
      name: 'Content & Links',
      features: [
        { name: 'Keyword Research', basic: true, pro: true, ultimate: true },
        { name: 'On-Page Optimization', basic: true, pro: true, ultimate: true },
        { name: 'Content Creation', basic: false, pro: true, ultimate: true },
        { name: 'Link Building', basic: false, pro: true, ultimate: true },
      ],
    },
    {
      name: 'Reporting & Support',
      features: [
        { name: 'Monthly Reports', basic: true, pro: true, ultimate: true },
        { name: 'Bi-Weekly Calls', basic: false, pro: true, ultimate: true },
        { name: 'Weekly Reports', basic: false, pro: false, ultimate: true },
        { name: 'Dedicated Manager', basic: false, pro: false, ultimate: true },
      ],
    },
  ],
  faqs: [
    { question: 'How long until I see results?', answer: 'SEO is a long-term strategy. Most businesses see measurable improvements in 3-6 months, with significant results by month 6-12. Local SEO can show faster results, especially if your Google Business Profile hasn\'t been optimized yet.' },
    { question: 'Do you guarantee rankings?', answer: 'No reputable SEO agency can guarantee specific rankings — Google controls the algorithm. What we guarantee is a transparent, data-driven process and clear reporting so you always know what you\'re getting.' },
    { question: 'Can I cancel anytime?', answer: 'Yes. All plans are month-to-month with no long-term contracts. We earn your business every month through results, not lock-in agreements.' },
    { question: 'What does the monthly report include?', answer: 'Keyword rankings, organic traffic trends, conversion metrics, work completed, and strategic recommendations for the next month. Pro and Ultimate plans include live walkthrough calls.' },
    { question: 'Do you do local SEO for Sarasota businesses?', answer: 'Absolutely — local SEO is one of our specialties. We optimize your Google Business Profile, build local citations, manage reviews, and implement map pack strategies specifically for Sarasota, Tampa, and Bradenton.' },
  ],
  testimonials: [
    {
      quote: 'Our organic traffic doubled in 8 months. The monthly reports are clear and actionable — no fluff, just data we can use to make decisions.',
      name: 'David R.',
      business: 'Nathan Benderson Park',
      location: 'Sarasota, FL',
      service: 'SEO Pro client since 2024',
      rating: 5,
    },
  ],
}

// ─── Social Media Marketing ─────────────────────────────────────────────
const socialMediaMarketing: ProductContent = {
  slug: 'social-media-marketing',
  name: 'Social Media Marketing',
  tagline: 'Engagement that converts.',
  description: 'Strategic social media management for businesses that want real engagement, not just vanity metrics. Content creation, scheduling, and community management.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'Essential social presence',
      description: 'Maintain a consistent social media presence with scheduled posts, basic graphics, and community monitoring.',
      perfectFor: 'Perfect if you need a consistent social media presence without the overhead of an in-house team.',
      highlightedFeatures: [
        '3 posts per week',
        'Content calendar planning',
        'Basic graphic design',
        'Community monitoring',
        'Monthly analytics report',
        '1 platform managed',
      ],
      notIncluded: ['Video content', 'Paid ad management', 'Influencer outreach'],
    },
    pro: {
      tagline: 'Active growth strategy',
      description: 'Step up your game with more content, engagement-focused strategy, and multi-platform management.',
      perfectFor: 'Perfect if you\'re ready to actively grow your social following and drive traffic from social channels.',
      highlightedFeatures: [
        '5 posts per week',
        'Multi-platform management',
        'Custom graphic design',
        'Engagement & community management',
        'Bi-weekly analytics & strategy',
        'Content photography guidance',
      ],
      notIncluded: ['Video production', 'Influencer campaigns'],
    },
    ultimate: {
      tagline: 'Full social media partnership',
      description: 'The complete social media package including video content, paid social ad management, and influencer outreach.',
      perfectFor: 'Perfect if social media is a primary marketing channel and you want maximum impact.',
      highlightedFeatures: [
        'Everything in Pro',
        'Daily posting',
        'Video content creation',
        'Paid social ad management',
        'Influencer outreach',
        'Weekly strategy calls',
      ],
      notIncluded: [],
    },
  },
  featureMatrix: [
    {
      name: 'Content',
      features: [
        { name: 'Posts per Week', basic: '3', pro: '5', ultimate: 'Daily' },
        { name: 'Content Calendar', basic: true, pro: true, ultimate: true },
        { name: 'Custom Graphics', basic: 'Basic', pro: 'Advanced', ultimate: 'Premium' },
        { name: 'Video Content', basic: false, pro: false, ultimate: true },
      ],
    },
    {
      name: 'Management',
      features: [
        { name: 'Platforms Managed', basic: '1', pro: '2-3', ultimate: 'All' },
        { name: 'Community Management', basic: 'Monitoring', pro: 'Active', ultimate: 'Full' },
        { name: 'Engagement Strategy', basic: false, pro: true, ultimate: true },
        { name: 'Influencer Outreach', basic: false, pro: false, ultimate: true },
      ],
    },
    {
      name: 'Reporting',
      features: [
        { name: 'Analytics Report', basic: 'Monthly', pro: 'Bi-weekly', ultimate: 'Weekly' },
        { name: 'Strategy Calls', basic: false, pro: 'Bi-weekly', ultimate: 'Weekly' },
        { name: 'Ad Integration', basic: false, pro: false, ultimate: true },
      ],
    },
  ],
  faqs: [
    { question: 'Which platforms do you manage?', answer: 'We work with Facebook, Instagram, LinkedIn, TikTok, and Google Business Profile. The number of platforms depends on your plan tier.' },
    { question: 'Do you create original content?', answer: 'Yes. We create custom graphics, captions, and content calendars. Pro and Ultimate plans include more advanced design and video content.' },
    { question: 'Can I approve posts before they go live?', answer: 'Absolutely. We use a content approval workflow so you see everything before it\'s published. You can approve, request changes, or suggest new ideas.' },
    { question: 'How do you measure success?', answer: 'We track engagement rates, follower growth, reach, website traffic from social, and conversion metrics. Monthly reports break it all down clearly.' },
  ],
  testimonials: [],
}

// ─── Local SEO ──────────────────────────────────────────────────────────
const localSeo: ProductContent = {
  slug: 'local-seo',
  name: 'Local SEO',
  tagline: 'Own your local market.',
  description: 'Dominate local search results in Sarasota, Tampa, and Bradenton. Google Business Profile optimization, local citations, and map pack strategies.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'Local visibility essentials',
      description: 'Get found in local search with Google Business Profile optimization, citation building, and review management.',
      perfectFor: 'Perfect if you\'re a local business that wants to show up in Google Maps and local search results.',
      highlightedFeatures: [
        'Google Business Profile optimization',
        'Local citation building',
        'Review monitoring',
        'Local keyword targeting',
        'Monthly local ranking reports',
        'NAP consistency audit',
      ],
      notIncluded: ['Content creation', 'Link building', 'Competitor monitoring'],
    },
    pro: {
      tagline: 'Local market domination',
      description: 'Everything in Basic plus content strategy, local link building, and competitor monitoring to actively grow your local presence.',
      perfectFor: 'Perfect if you want to actively outrank local competitors and drive more foot traffic.',
      highlightedFeatures: [
        'Everything in Basic',
        'Local content strategy',
        'Local link building',
        'Competitor monitoring',
        'Bi-weekly reports & calls',
        'Multi-location support',
      ],
      notIncluded: ['Dedicated manager'],
    },
    ultimate: {
      tagline: 'Total local dominance',
      description: 'The full local SEO package. Dedicated manager, weekly reporting, and advanced strategies for businesses with multiple locations.',
      perfectFor: 'Perfect for multi-location businesses or those that depend heavily on local search traffic.',
      highlightedFeatures: [
        'Everything in Pro',
        'Dedicated account manager',
        'Weekly reporting',
        'Multi-location management',
        'Advanced local strategies',
        'Priority support',
      ],
      notIncluded: [],
    },
  },
  featureMatrix: [
    {
      name: 'Local Visibility',
      features: [
        { name: 'GBP Optimization', basic: true, pro: true, ultimate: true },
        { name: 'Citation Building', basic: true, pro: true, ultimate: true },
        { name: 'Local Keyword Targeting', basic: true, pro: true, ultimate: true },
        { name: 'Multi-Location Support', basic: false, pro: true, ultimate: true },
      ],
    },
    {
      name: 'Growth',
      features: [
        { name: 'Local Content Strategy', basic: false, pro: true, ultimate: true },
        { name: 'Local Link Building', basic: false, pro: true, ultimate: true },
        { name: 'Competitor Monitoring', basic: false, pro: true, ultimate: true },
        { name: 'Advanced Local Strategies', basic: false, pro: false, ultimate: true },
      ],
    },
    {
      name: 'Support & Reporting',
      features: [
        { name: 'Ranking Reports', basic: 'Monthly', pro: 'Bi-weekly', ultimate: 'Weekly' },
        { name: 'NAP Consistency Audit', basic: true, pro: true, ultimate: true },
        { name: 'Review Monitoring', basic: true, pro: true, ultimate: true },
        { name: 'Dedicated Manager', basic: false, pro: false, ultimate: true },
      ],
    },
  ],
  faqs: [
    { question: 'How is this different from regular SEO?', answer: 'Local SEO focuses specifically on ranking in Google Maps, local pack results, and location-based searches. It includes Google Business Profile optimization, local citations, and review management — strategies that don\'t apply to national SEO campaigns.' },
    { question: 'How long until I rank in the local pack?', answer: 'It depends on your starting point and competition level. Most businesses see improvements in local rankings within 2-4 months, with significant gains by month 6.' },
    { question: 'Do you handle multiple locations?', answer: 'Yes. Pro and Ultimate plans include multi-location support. Each location gets its own Google Business Profile optimization and local citation strategy.' },
  ],
  testimonials: [],
}

// ─── Short Form Video Marketing ─────────────────────────────────────────
const shortFormVideo: ProductContent = {
  slug: 'short-form-video-marketing',
  name: 'Short Form Video Marketing',
  tagline: 'Video content that stops the scroll.',
  description: 'Professional short-form video production for TikTok, Instagram Reels, and YouTube Shorts. Scripted, shot, edited, and optimized for engagement.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'Starter video package',
      description: 'Two professionally produced short-form videos per month. Ideal for businesses testing the waters with video marketing.',
      perfectFor: 'Perfect if you want to start building a video presence without a huge commitment.',
      highlightedFeatures: [
        '2 videos per month',
        'Script development',
        'Professional editing',
        'Platform optimization',
        'Monthly performance review',
      ],
      notIncluded: ['On-location shoots', 'Paid promotion', 'Multi-platform repurposing'],
    },
    pro: {
      tagline: 'Growth video package',
      description: 'Four videos per month with advanced editing, trend-based content, and multi-platform optimization.',
      perfectFor: 'Perfect if you\'re ready to make video a core part of your marketing strategy.',
      highlightedFeatures: [
        '4 videos per month',
        'Trend-based content strategy',
        'Advanced editing & effects',
        'Multi-platform optimization',
        'Bi-weekly analytics review',
        'Hashtag & caption strategy',
      ],
      notIncluded: ['Dedicated videographer'],
    },
    ultimate: {
      tagline: 'Full video production',
      description: 'Eight videos per month with dedicated production, on-location shoots, and paid promotion management.',
      perfectFor: 'Perfect if video is a primary driver of your marketing and brand awareness.',
      highlightedFeatures: [
        'Everything in Pro',
        '8 videos per month',
        'On-location production',
        'Paid video promotion',
        'Weekly strategy calls',
        'Priority turnaround',
      ],
      notIncluded: [],
    },
  },
  featureMatrix: [
    {
      name: 'Production',
      features: [
        { name: 'Videos per Month', basic: '2', pro: '4', ultimate: '8' },
        { name: 'Script Development', basic: true, pro: true, ultimate: true },
        { name: 'Professional Editing', basic: true, pro: true, ultimate: true },
        { name: 'On-Location Shoots', basic: false, pro: false, ultimate: true },
      ],
    },
    {
      name: 'Strategy & Distribution',
      features: [
        { name: 'Platform Optimization', basic: true, pro: true, ultimate: true },
        { name: 'Trend-Based Content', basic: false, pro: true, ultimate: true },
        { name: 'Hashtag Strategy', basic: false, pro: true, ultimate: true },
        { name: 'Paid Promotion', basic: false, pro: false, ultimate: true },
      ],
    },
    {
      name: 'Reporting',
      features: [
        { name: 'Monthly Review', basic: true, pro: true, ultimate: true },
        { name: 'Bi-Weekly Analytics', basic: false, pro: true, ultimate: true },
        { name: 'Weekly Strategy Calls', basic: false, pro: false, ultimate: true },
      ],
    },
  ],
  faqs: [
    { question: 'What platforms do you create videos for?', answer: 'We create content optimized for TikTok, Instagram Reels, YouTube Shorts, and Facebook. Each video is formatted and optimized for the specific platform\'s algorithm and audience behavior.' },
    { question: 'Do I need to be on camera?', answer: 'Not at all. We can create videos using product shots, B-roll, screen recordings, text overlays, and AI-assisted visuals. If you want to be on camera, we\'ll coach you through it.' },
    { question: 'How long are the videos?', answer: 'Most short-form content runs 15-60 seconds, depending on the platform and content type. We optimize length based on what performs best for your audience and niche.' },
    { question: 'Can I add this to my social media plan?', answer: 'Yes. Short Form Video can be added as an add-on to any Social Media Marketing plan, or purchased as a standalone service.' },
  ],
  testimonials: [],
}

// ─── Google LSA Management ──────────────────────────────────────────────
const googleLsa: ProductContent = {
  slug: 'google-lsa-management',
  name: 'Google Local Service Ads',
  tagline: 'Pay-per-lead, not pay-per-click.',
  description: 'Google Local Service Ads management that puts your business at the very top of local search results. You only pay for qualified leads.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'LSA management',
      description: 'Full setup and ongoing management of your Google Local Service Ads profile. Includes background check coordination, profile optimization, and lead management.',
      perfectFor: 'Perfect for service-based businesses in Sarasota, Tampa, and Bradenton looking for qualified local leads.',
      highlightedFeatures: [
        'Profile setup & verification',
        'Background check coordination',
        'Lead monitoring & management',
        'Dispute handling',
        'Monthly performance reporting',
        'Budget optimization',
      ],
      notIncluded: [],
    },
    pro: {
      tagline: 'LSA management',
      description: 'Full setup and ongoing management of your Google Local Service Ads profile. Includes background check coordination, profile optimization, and lead management.',
      perfectFor: 'Perfect for service-based businesses in Sarasota, Tampa, and Bradenton looking for qualified local leads.',
      highlightedFeatures: [
        'Everything in Basic',
        'Advanced bid management',
        'Weekly lead reviews',
      ],
      notIncluded: [],
    },
    ultimate: {
      tagline: 'LSA management',
      description: 'Full setup and ongoing management of your Google Local Service Ads profile. Includes background check coordination, profile optimization, and lead management.',
      perfectFor: 'Perfect for service-based businesses in Sarasota, Tampa, and Bradenton looking for qualified local leads.',
      highlightedFeatures: [
        'Everything in Pro',
        'Dedicated account manager',
        'Priority support',
      ],
      notIncluded: [],
    },
  },
  featureMatrix: [],
  faqs: [
    { question: 'What is the difference between LSA and Google Ads?', answer: 'Google Local Service Ads appear at the very top of search results — above even regular Google Ads. The biggest difference is you pay per qualified lead, not per click. You also get a Google Guaranteed badge that builds trust with customers.' },
    { question: 'How much does each lead cost?', answer: 'Lead costs vary by industry and location. In the Sarasota/Tampa market, most service businesses see lead costs between $15-$50 per lead. You set a weekly budget and only pay for leads that match your service area and categories.' },
    { question: 'What\'s the setup fee for?', answer: 'The $150 one-time setup fee covers profile creation, background check coordination, license verification, service area configuration, and initial optimization. It\'s the foundation work to get your ads live and performing.' },
    { question: 'Can I dispute bad leads?', answer: 'Yes. Google allows you to dispute leads that were spam, wrong numbers, or outside your service area. We handle the dispute process for you as part of our management service.' },
    { question: 'Which industries qualify for LSA?', answer: 'Google LSA is available for many service industries including HVAC, plumbing, electrical, roofing, pest control, real estate, legal, financial advisors, and more. Contact us to check if your industry qualifies.' },
  ],
  testimonials: [],
}

// ─── Google Business Profile Optimization ───────────────────────────────
const googleBusinessProfile: ProductContent = {
  slug: 'google-business-profile-optimization',
  name: 'Google Business Profile Optimization',
  tagline: 'Own the map pack.',
  description: 'One-time professional optimization of your Google Business Profile to maximize visibility in local search and Google Maps.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'Full GBP optimization',
      description: 'A comprehensive one-time optimization of your Google Business Profile. We audit and optimize every field, add photos, set up categories, and build your profile for maximum local visibility.',
      perfectFor: 'Perfect for any local business that wants to show up higher in Google Maps and local search results.',
      highlightedFeatures: [
        'Full profile audit & optimization',
        'Category & attribute setup',
        'Photo optimization & upload',
        'Service area configuration',
        'Q&A section setup',
        'Review response templates',
      ],
      notIncluded: ['Ongoing management', 'Monthly reporting', 'Review monitoring'],
    },
    pro: {
      tagline: 'Full GBP optimization',
      description: 'A comprehensive one-time optimization of your Google Business Profile.',
      perfectFor: 'Perfect for any local business that wants to show up higher in Google Maps.',
      highlightedFeatures: [
        'Everything in Basic',
        'Competitor analysis',
        'Post scheduling setup',
      ],
      notIncluded: [],
    },
    ultimate: {
      tagline: 'Full GBP optimization',
      description: 'A comprehensive one-time optimization of your Google Business Profile.',
      perfectFor: 'Perfect for any local business that wants to show up higher in Google Maps.',
      highlightedFeatures: [
        'Everything in Pro',
        'Ongoing monthly management',
        'Review monitoring',
      ],
      notIncluded: [],
    },
  },
  featureMatrix: [],
  faqs: [
    { question: 'Is this a one-time service or ongoing?', answer: 'This is a one-time optimization for $200. If you want ongoing GBP management (posting, review monitoring, monthly updates), check out our Local SEO plans which include GBP management.' },
    { question: 'Do I need to give you access to my profile?', answer: 'Yes. We\'ll need owner or manager access to your Google Business Profile. We\'ll walk you through granting access — it takes about 2 minutes.' },
    { question: 'How long does the optimization take?', answer: 'We complete the full optimization within 3-5 business days. You\'ll receive a summary of all changes made and recommendations for ongoing maintenance.' },
    { question: 'Will this help me rank in the map pack?', answer: 'GBP optimization is one of the strongest signals for local map pack rankings. While we can\'t guarantee specific positions, a fully optimized profile significantly improves your chances of appearing in the top 3 local results.' },
  ],
  testimonials: [],
}

// ─── SEO Primer ─────────────────────────────────────────────────────────
const seoPrimer: ProductContent = {
  slug: 'seo-primer',
  name: 'SEO Primer',
  tagline: 'Know where you stand.',
  description: 'A comprehensive one-time SEO audit and strategy report. Understand your current SEO health, identify quick wins, and get a clear roadmap for improvement.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'Comprehensive SEO audit',
      description: 'A deep-dive SEO audit covering technical health, keyword opportunities, content gaps, and competitor analysis. Delivered as an actionable strategy document you can use immediately.',
      perfectFor: 'Perfect if you want to understand your SEO situation before committing to a monthly plan, or if you have an in-house team that needs direction.',
      highlightedFeatures: [
        'Full technical SEO audit',
        'Keyword opportunity analysis',
        'Competitor benchmarking',
        'Content gap identification',
        'Actionable recommendations',
        '1-hour strategy call',
      ],
      notIncluded: ['Ongoing optimization', 'Content creation', 'Link building'],
    },
    pro: {
      tagline: 'Comprehensive SEO audit',
      description: 'A deep-dive SEO audit with expanded scope.',
      perfectFor: 'Perfect for businesses with larger sites or multiple locations.',
      highlightedFeatures: ['Everything in Basic', 'Multi-location analysis', 'Extended strategy call'],
      notIncluded: [],
    },
    ultimate: {
      tagline: 'Comprehensive SEO audit',
      description: 'A deep-dive SEO audit with full implementation support.',
      perfectFor: 'Perfect for businesses that want the audit plus hands-on help.',
      highlightedFeatures: ['Everything in Pro', 'Implementation support', 'Follow-up audit'],
      notIncluded: [],
    },
  },
  featureMatrix: [],
  faqs: [
    { question: 'What do I get in the report?', answer: 'A detailed document covering: technical SEO health score, crawl errors, site speed analysis, keyword rankings and opportunities, content gaps, backlink profile, competitor comparison, and a prioritized list of recommended actions.' },
    { question: 'Is this the same as a monthly SEO plan?', answer: 'No. The SEO Primer is a one-time audit and strategy document. It tells you what needs to be done. If you want us to do the work, you\'d move to one of our Fully Managed SEO plans afterward.' },
    { question: 'How long does the audit take?', answer: 'We deliver the full report within 7-10 business days. The included strategy call is scheduled after delivery so you\'ve had time to review the findings.' },
    { question: 'Is the $553 price a sale?', answer: 'Yes — the regular price is $653. The current sale price of $553 is available for a limited time. This is a one-time fee with no recurring charges.' },
  ],
  testimonials: [],
}

// ─── Add-On Hosting Site ────────────────────────────────────────────────
const addOnHostingSite: ProductContent = {
  slug: 'add-on-hosting-site',
  name: 'Add-On Hosting Site',
  tagline: 'More sites, one plan.',
  description: 'Add additional websites to your existing Managed Web Hosting plan. Each site gets its own SSL, backups, and monitoring.',
  category: 'Hosting',
  tiers: {
    basic: {
      tagline: 'Additional hosted site',
      description: 'Add another website to your existing hosting plan. Includes SSL, daily backups, and monitoring — shares development hours from your main plan.',
      perfectFor: 'Perfect if you manage multiple websites and want them all under one hosting plan.',
      highlightedFeatures: [
        'SSL certificate included',
        'Daily automated backups',
        'Uptime monitoring',
        'Security protection',
        'Shared dev hours from main plan',
      ],
      notIncluded: ['Dedicated development hours', 'Separate support queue'],
    },
    pro: {
      tagline: 'Additional hosted site',
      description: 'Add another website with priority support.',
      perfectFor: 'Perfect for additional business sites requiring priority handling.',
      highlightedFeatures: ['Everything in Basic', 'Priority support'],
      notIncluded: [],
    },
    ultimate: {
      tagline: 'Additional hosted site',
      description: 'Add another website with dedicated resources.',
      perfectFor: 'Perfect for high-traffic additional sites.',
      highlightedFeatures: ['Everything in Pro', 'Dedicated resources'],
      notIncluded: [],
    },
  },
  featureMatrix: [],
  faqs: [
    { question: 'Do I need an existing hosting plan?', answer: 'Yes. The Add-On Hosting Site is designed to be added to an existing Managed Web Hosting plan (Basic, Pro, or Ultimate). Each additional site costs $15/month.' },
    { question: 'Does each site get its own SSL?', answer: 'Yes. Every site on our hosting gets its own SSL certificate, daily backups, and uptime monitoring — regardless of whether it\'s your primary site or an add-on.' },
    { question: 'Are development hours shared?', answer: 'Yes. The development hours included in your hosting plan (Pro: 2 hrs/mo, Ultimate: 4 hrs/mo) are shared across all your hosted sites.' },
  ],
  testimonials: [],
}

// ─── InkTree Page ───────────────────────────────────────────────────────
const inkTreePage: ProductContent = {
  slug: 'inktree-page',
  name: 'InkTree Page',
  tagline: 'Your links, your brand.',
  description: 'A custom-branded link-in-bio page that matches your brand identity. Perfect for social media profiles, business cards, and email signatures.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'Branded link page',
      description: 'A professionally designed link-in-bio page with your branding, unlimited links, and analytics tracking. Hosted on our infrastructure with your custom subdomain.',
      perfectFor: 'Perfect if you need a professional link page that matches your brand instead of using generic tools.',
      highlightedFeatures: [
        'Custom branded design',
        'Unlimited links',
        'Click analytics',
        'Social media icons',
        'Custom subdomain',
        'Mobile optimized',
      ],
      notIncluded: ['Custom domain', 'A/B testing', 'Email capture'],
    },
    pro: {
      tagline: 'Branded link page',
      description: 'An enhanced link page with custom domain support.',
      perfectFor: 'Perfect for businesses wanting full brand control.',
      highlightedFeatures: ['Everything in Basic', 'Custom domain', 'Email capture form'],
      notIncluded: [],
    },
    ultimate: {
      tagline: 'Branded link page',
      description: 'Full-featured link page with advanced analytics.',
      perfectFor: 'Perfect for brands with advanced tracking needs.',
      highlightedFeatures: ['Everything in Pro', 'A/B testing', 'Advanced analytics'],
      notIncluded: [],
    },
  },
  featureMatrix: [],
  faqs: [
    { question: 'How is this different from Linktree?', answer: 'InkTree is fully custom-designed to match your brand identity. No generic templates, no Linktree branding. It\'s hosted on our fast infrastructure and integrates seamlessly with your Webink services.' },
    { question: 'Can I use my own domain?', answer: 'The base plan includes a custom subdomain (e.g., links.yourbrand.com). For a fully custom domain, talk to us about options.' },
    { question: 'How many links can I add?', answer: 'Unlimited. Add as many links as you need — social profiles, website pages, booking links, product pages, and more.' },
  ],
  testimonials: [],
}

// ─── Paid Advertising (PPC) ─────────────────────────────────────────────
const paidAdvertising: ProductContent = {
  slug: 'paid-advertising',
  name: 'Paid Advertising',
  tagline: 'Ads that pay for themselves.',
  description: 'Expert Google Ads and Meta advertising management. We build, launch, and optimize paid campaigns that deliver measurable ROI.',
  category: 'Marketing',
  tiers: {
    basic: {
      tagline: 'Single network management',
      description: 'Management of paid ads on one platform — either Google Ads or Meta (Facebook/Instagram). Includes setup, creative development, and ongoing optimization.',
      perfectFor: 'Perfect if you\'re starting with paid ads and want to test one channel before expanding.',
      highlightedFeatures: [
        'One ad network (Google or Meta)',
        'Campaign setup & structure',
        'Ad creative development',
        'Audience research & targeting',
        'A/B testing',
        'Monthly performance reporting',
      ],
      notIncluded: ['Multi-platform management', 'LinkedIn/TikTok ads', 'Video ad production'],
    },
    pro: {
      tagline: 'Two network management',
      description: 'Management across two ad platforms with cross-channel strategy. Run Google Ads and Meta ads with a unified approach.',
      perfectFor: 'Perfect if you want to reach customers across both search and social with coordinated campaigns.',
      highlightedFeatures: [
        'Two ad networks (Google + Meta)',
        'Cross-platform strategy',
        'Conversion tracking setup',
        'Retargeting campaigns',
        'Bi-weekly optimization reports',
        'Monthly strategy calls',
      ],
      notIncluded: ['Additional networks'],
    },
    ultimate: {
      tagline: 'Full multi-channel management',
      description: 'Comprehensive multi-channel paid advertising across Google, Meta, LinkedIn, and more. Full-funnel strategy with advanced tracking.',
      perfectFor: 'Perfect if paid ads are a major revenue driver and you need maximum reach across all channels.',
      highlightedFeatures: [
        'Everything in Pro',
        'Three+ ad networks',
        'LinkedIn & TikTok ads',
        'Advanced conversion tracking',
        'Weekly optimization',
        'Dedicated account manager',
      ],
      notIncluded: [],
    },
  },
  featureMatrix: [
    {
      name: 'Campaign Management',
      features: [
        { name: 'Ad Networks', basic: '1', pro: '2', ultimate: '3+' },
        { name: 'Campaign Setup', basic: true, pro: true, ultimate: true },
        { name: 'Ad Creative Development', basic: true, pro: true, ultimate: true },
        { name: 'Retargeting', basic: false, pro: true, ultimate: true },
      ],
    },
    {
      name: 'Optimization & Reporting',
      features: [
        { name: 'A/B Testing', basic: true, pro: true, ultimate: true },
        { name: 'Conversion Tracking', basic: true, pro: true, ultimate: true },
        { name: 'Monthly Reports', basic: true, pro: true, ultimate: true },
        { name: 'Weekly Optimization', basic: false, pro: false, ultimate: true },
        { name: 'Dedicated Manager', basic: false, pro: false, ultimate: true },
      ],
    },
  ],
  faqs: [
    { question: 'How much should I budget for ad spend?', answer: 'Most Sarasota businesses start with $1,500-$3,000/month in ad spend. This is separate from the management fee. We\'ll recommend a budget during our initial consultation based on your goals and competition.' },
    { question: 'What is the management fee structure?', answer: 'Single network: 20% of ad spend with a $250 onboarding fee. Two networks: 25% with $500 onboarding. Three+ networks: 30% with $250 per network onboarding.' },
    { question: 'How quickly will I see results?', answer: 'Paid ads can generate traffic and leads almost immediately. Most campaigns produce measurable results within 2-4 weeks as we optimize targeting and bidding strategies.' },
    { question: 'Do you create the ad graphics and copy?', answer: 'Yes. Ad creative development is included in all plans. We write the copy, design the graphics, and produce video when needed. You approve everything before it goes live.' },
    { question: 'Can I see where my money is going?', answer: 'Absolutely. We provide transparent reporting showing every dollar of ad spend and the results it generated. No hidden fees, no mystery — full visibility into your campaigns.' },
  ],
  testimonials: [],
}

// ─── Default Testimonial ────────────────────────────────────────────────
export const defaultTestimonial: Testimonial = {
  quote: 'Working with Webink completely transformed our online presence. Professional, responsive, and they truly understand what small businesses need to grow.',
  name: 'Tiffini Brown',
  business: 'Local Business Owner',
  location: 'Sarasota, FL',
  service: 'Web Design & Marketing',
  rating: 5,
}

// ─── Registry ───────────────────────────────────────────────────────────
const productContentMap: Record<string, ProductContent> = {
  'managed-web-hosting': managedWebHosting,
  'fully-managed-seo': fullyManagedSeo,
  'social-media-marketing': socialMediaMarketing,
  'local-seo': localSeo,
  'short-form-video-marketing': shortFormVideo,
  'google-lsa-management': googleLsa,
  'google-business-profile-optimization': googleBusinessProfile,
  'seo-primer': seoPrimer,
  'add-on-hosting-site': addOnHostingSite,
  'inktree-page': inkTreePage,
  'paid-advertising': paidAdvertising,
}

export function getProductContent(slug: string): ProductContent | null {
  return productContentMap[slug] || null
}

// ─── Pricing Helpers ────────────────────────────────────────────────────
export function getAnnualPrice(monthlyPriceCents: number): number {
  return Math.round(monthlyPriceCents * 12 * 0.9) // 10% discount
}

export function getMonthlyEquivalent(annualPriceCents: number): number {
  return Math.round(annualPriceCents / 12)
}

export function getAnnualSavings(monthlyPriceCents: number): number {
  return (monthlyPriceCents * 12) - getAnnualPrice(monthlyPriceCents)
}

export function formatPrice(cents: number | null): string {
  if (cents === null || cents === 0) return '$0'
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

import { PrismaClient, ProductType, ProductStatus, BillingInterval } from '../src/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { execSync } from 'child_process'
import 'dotenv/config'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter }) as PrismaClient

interface VariantSeed {
  name: string
  priceMonthly?: number
  priceAnnual?: number
  priceOneTime?: number
  salePrice?: number
  setupFee?: number
  billingInterval: BillingInterval
  trialDays?: number
  contactOnly?: boolean
  sortOrder: number
}

interface ProductSeed {
  name: string
  slug: string
  description: string
  shortDescription?: string
  category: string
  type: ProductType
  status: ProductStatus
  featured?: boolean
  setupFee?: number
  billingInterval?: string
  trialDays?: number
  sortOrder: number
  variants: VariantSeed[]
}

// ═══════════════════════════════════════════════════════════════════════════
// ALL PRODUCTS FROM WOOCOMMERCE CSV EXPORT (24 March 2026)
// Prices in CENTS. Every value is exact from the WooCommerce export.
//
// Source: wc-product-export-24-3-2026-1774394549039.csv
// ═══════════════════════════════════════════════════════════════════════════

const products: ProductSeed[] = [
  // ─── 1. Managed Web Hosting (WC ID 1504) ──────────────────────────────
  // variable-subscription: 3 levels x 2 renewal = 6 variations
  // SEO Check-Up addon REMOVED per business requirement
  {
    name: 'Managed Web Hosting',
    slug: 'managed-web-hosting',
    description: 'Managed hosting is something that is offered as a way for clients to take the focus off of maintaining a website and back on doing what they are best at, whether that be growing your business, writing a blog or selling your products managed wordpress hosting takes the hassle out of maintaining your site. We offer the same functions as many of the large managed hosting sites like security and threat protection, regular updates for website software and routine backups to ensure your site and data are always safe.\n\nKeeping your site up to date with plugin, theme and WordPress updates is the most essential thing you can do to ensure the security of your site and your business. Hackers are constantly working to access your site in an attempt to find valuable information, you should have someone working just as hard to keep them out. Webink Solutions will monitor your site 24/7 and ensure that all of your systems are running to full potential.\n\n*Development time NOT included with Basic',
    shortDescription: 'Professional managed WordPress hosting with 24/7 monitoring, security protection, routine backups, and automatic updates.',
    category: 'hosting',
    type: 'VARIABLE_SUBSCRIPTION',
    status: 'ACTIVE',
    featured: true,
    billingInterval: 'month',
    sortOrder: 1,
    variants: [
      // Monthly
      { name: 'Basic - Monthly', priceMonthly: 3100, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro - Monthly', priceMonthly: 3900, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate - Monthly', priceMonthly: 5900, billingInterval: 'MONTHLY', sortOrder: 3 },
      // Annual
      { name: 'Basic - Annual', priceAnnual: 33500, billingInterval: 'ANNUAL', sortOrder: 4 },
      { name: 'Pro - Annual', priceAnnual: 42100, billingInterval: 'ANNUAL', sortOrder: 5 },
      { name: 'Ultimate - Annual', priceAnnual: 63700, billingInterval: 'ANNUAL', sortOrder: 6 },
    ],
  },

  // ─── 2. Add-On Hosting Site (WC ID 2259) ──────────────────────────────
  {
    name: 'Add-On Hosting Site',
    slug: 'add-on-hosting-site',
    description: 'Effortless Multi-Site Management: Webink Solutions\' Add-on Site Feature\n\nStreamline your digital portfolio with our Add-on Site feature. Ideal for those managing multiple websites, this solution offers the convenience of a single hosting account for all your sites.\n\nKey Advantages:\n- Unified Hosting Account: Easily manage multiple websites under one roof.\n- Shared Development Hours: Utilize your 2 to 4 hours of monthly development work across all sites, ensuring each gets the attention it needs.\n- Comprehensive Managed Hosting Services: Each Add-on Site benefits from robust security, routine backups, 24/7 monitoring, 20GB disk space, unlimited bandwidth, unlimited domain-based email addresses, free migration, premium themes, and SSL.\n\nSimplify Your Online Presence: With the Add-on Site feature, managing multiple websites has never been easier. Share resources, save time, and secure your digital presence, all under one account with Webink Solutions.',
    shortDescription: 'Add another website to your existing hosting plan with shared resources and full managed hosting services.',
    category: 'hosting',
    type: 'SUBSCRIPTION',
    status: 'ACTIVE',
    billingInterval: 'month',
    sortOrder: 2,
    variants: [
      { name: 'Add-On Site', priceMonthly: 1500, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },

  // ─── 3. Fully Managed SEO (WC ID 1531) ────────────────────────────────
  // CSV: Basic $1103, Pro $1493, Ultimate $1993, signup $250
  {
    name: 'Fully Managed SEO',
    slug: 'fully-managed-seo',
    description: 'Fully Managed SEO\n\n- Fully Managed SEO Plan\n- Data Driven Strategy\n- Products (deliverables) vary depending on monthly need\n- Monthly SEO and Content Reports',
    shortDescription: 'Comprehensive, fully managed SEO with data-driven strategy and monthly reporting.',
    category: 'seo',
    type: 'VARIABLE_SUBSCRIPTION',
    status: 'ACTIVE',
    featured: true,
    setupFee: 25000,
    billingInterval: 'month',
    sortOrder: 3,
    variants: [
      { name: 'Basic', priceMonthly: 110300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro', priceMonthly: 149300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate', priceMonthly: 199300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 3 },
    ],
  },

  // ─── 4. SEO Primer (WC ID 2388) ───────────────────────────────────────
  // CSV: Regular $653, Sale $553, simple product
  {
    name: 'SEO Primer',
    slug: 'seo-primer',
    description: 'Introducing SEO Primer, our all-inclusive On-Page SEO service designed to elevate your website\'s search engine performance. This service is perfect for websites needing optimization for up to 5 pages. Our meticulous approach ensures your site is optimized for both users and search engines, helping you rank higher and attract more traffic. If you need more than 5 pages optimized, please contact us for customized pricing and services tailored to your needs.\n\nOur SEO Primer includes:\n- Keyword Research: Identify the best keywords for your website.\n- Keyword Difficulty Analysis: Determine the competitiveness of selected keywords.\n- Final List of Keywords for Optimization: Curate a list of target keywords.\n- Site Structure Analysis: Evaluate and optimize your website\'s layout.\n- URL Analysis: Review and refine URL structures for better SEO.\n- Title & Meta Tags: Craft compelling and SEO-friendly titles and meta tags.\n- Meta Data Creation for Final Keywords: Develop metadata based on selected keywords.\n- Meta Data and On-Page Revision: Implement and adjust metadata and on-page content.\n- Keyword Density & Prominence Check: Ensure optimal keyword usage.\n- Hyperlinking the Content: Add relevant hyperlinks within your content.\n- Internal Linking: Enhance site navigation and SEO with strategic internal links.\n- Image Optimization: Improve image SEO with proper tags and compression.\n- Header Tags Optimization: Structure content with SEO-friendly headers.\n- Anchor Text Optimization: Optimize anchor text for better search performance.\n- Canonical URLs Implementation: Prevent duplicate content issues with canonical tags.\n- Robots.txt Optimization: Manage and optimize the robots.txt file.\n- Broken Link Checking: Identify and fix broken links.\n- XML Sitemap Creation & Update: Generate and maintain XML sitemaps for search engines.\n- HTML Sitemap Creation & Update: Develop user-friendly HTML sitemaps.\n- URL List (TXT Sitemap) Creation: Create and update text-based sitemaps.\n- Creating Accounts in Google: Set up essential Google accounts for SEO management.\n- Submit XML Sitemap: Ensure your sitemaps are submitted to search engines.\n\nOur holistic approach addresses both technical and on-page SEO aspects, making your website more visible and appealing to search engines. With SEO Primer, you can expect a thorough optimization process that significantly enhances your site\'s SEO performance and online presence.',
    shortDescription: 'Boost your website\'s search engine ranking with our SEO Primer service. Comprehensive On-Page SEO optimization for up to 5 pages, covering keyword research, site structure analysis, and technical SEO.',
    category: 'seo',
    type: 'SIMPLE',
    status: 'ACTIVE',
    sortOrder: 4,
    variants: [
      { name: 'SEO Primer', priceOneTime: 65300, salePrice: 55300, billingInterval: 'ONE_TIME', sortOrder: 1 },
    ],
  },

  // ─── 5. Local SEO (WC ID 2133) ────────────────────────────────────────
  // CSV: Basic $1103, Pro $1603, Ultimate $2103, signup $250
  {
    name: 'Local SEO',
    slug: 'local-seo',
    description: 'Local SEO Services\n\nWebink Solutions specializes in Local SEO aimed at making Sarasota businesses the go-to spots in their neighborhoods. From setting up your Google Business Profile for optimal local search results to employing hyper-local keywords, we help you nail that community vibe. Our services include keeping your business info consistent across the web, tracking your strategy\'s effectiveness, and making sure your local content gets the spotlight it deserves. Plus, we keep things agile with regular strategy check-ins. In short, we\'re all about putting your local business front and center in the community!\n\n- Monthly Local Visibility Reports\n- Comprehensive Local SEO Strategy\n- On-Page SEO with Local Focus\n- Custom Signal Crafting\n- Niche & Local Signal Development\n- Brand Foundation & Optimization\n- Google My Business/Google Business Profile Management\n- Local Content & Media Enhancement\n- Targeted Link Building\n- Advanced Tactics & Special Features\n\n*Note this is a month-to-month subscription and can be cancelled at anytime, SEO services require minimum of 3-6 months to see results. Consider if our 3-month plan is a better option for you.',
    shortDescription: 'Local SEO services to make Sarasota businesses the go-to spots in their neighborhoods with Google Business Profile management and hyper-local optimization.',
    category: 'seo',
    type: 'VARIABLE_SUBSCRIPTION',
    status: 'ACTIVE',
    featured: true,
    setupFee: 25000,
    billingInterval: 'month',
    sortOrder: 5,
    variants: [
      { name: 'Basic', priceMonthly: 110300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro', priceMonthly: 160300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate', priceMonthly: 210300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 3 },
    ],
  },

  // ─── 6. Local SEO 3-Month BOOST (WC ID 2138) ──────────────────────────
  // CSV: Basic reg $1103 sale $993, Pro reg $1603 sale $1443, Ultimate reg $1993 sale $1893
  {
    name: 'Local SEO 3-Month BOOST',
    slug: 'local-seo-3-month-boost',
    description: 'Local SEO Services — 3-Month Commitment Special:\n\nLock in your discounted rate today with a 3-month commitment to our game-changing Local SEO services! Why 3 months? Because SEO isn\'t a sprint; it\'s a marathon. It takes at least 3-6 months to really start making waves. Stick with us for the first 3 months and you\'ll be set to see exciting results that drive your business forward. And don\'t worry, after the initial period, you\'re free to cancel anytime while still enjoying the same great rate.\n\nWebink Solutions specializes in Local SEO aimed at making Sarasota businesses the go-to spots in their neighborhoods. From setting up your Google Business Profile for optimal local search results to employing hyper-local keywords, we help you nail that community vibe. Our services include keeping your business info consistent across the web, tracking your strategy\'s effectiveness, and making sure your local content gets the spotlight it deserves. Plus, we keep things agile with regular strategy check-ins. In short, we\'re all about putting your local business front and center in the community!\n\n- Monthly Local Visibility Reports\n- Comprehensive Local SEO Strategy\n- On-Page SEO with Local Focus\n- Custom Signal Crafting\n- Niche & Local Signal Development\n- Brand Foundation & Optimization\n- Google My Business/Google Business Profile Management\n- Local Content & Media Enhancement\n- Targeted Link Building\n- Advanced Tactics & Special Features',
    shortDescription: 'Lock in a discounted rate with a 3-month commitment to Local SEO. Same comprehensive service at a reduced monthly price.',
    category: 'seo',
    type: 'VARIABLE_SUBSCRIPTION',
    status: 'ACTIVE',
    setupFee: 25000,
    billingInterval: 'month',
    sortOrder: 6,
    variants: [
      { name: 'Basic', priceMonthly: 110300, salePrice: 99300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro', priceMonthly: 160300, salePrice: 144300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate', priceMonthly: 199300, salePrice: 189300, setupFee: 25000, billingInterval: 'MONTHLY', sortOrder: 3 },
    ],
  },

  // ─── 7. Social Media Marketing (WC ID 1549) ───────────────────────────
  // variable-subscription: 3 levels x 3 video addon options = 9 variations
  // CSV: signup $99, Basic $493, Pro $793, Ultimate $993 + video add-on tiers
  {
    name: 'Social Media Marketing',
    slug: 'social-media-marketing',
    description: 'Social Media Marketing Solutions\n\nWe operate in an online world. Internet usage and online interactions continue to steadily increase each year. The way you are perceived online and the way you interact with your audience online matters. How easily you are found and reviewed on Google, Facebook, and other social media platforms has changed the landscape for local businesses. That is where digital marketing or online marketing comes into play. This involves all of your marketing efforts to reach, interact with, and attract your audience in the online and digital world. From digital channels such as search engine, social media, email, webinars, blogs, and other websites to communication through text or multimedia messages.\n\nYour potential audience reach has never had more opportunities. You can not only target your ideal client more easily but also measure results with analytics with faster, easier metrics and be able to adjust and dial in as needed more quickly.\n\nWe help to create digital marketing strategies to reach the overall goals of your business. We provide strategic tools, analytics, resources, best practices, and planning to get your brand to the customers you want to reach with a cohesive brand message. Partnering with our team, we will work with you to accomplish the vision and goals you have for your business.\n\n* All subscriptions require a one-time $99 on-boarding fee\n** $99/mo Social Network Add-on (up to 3 posts per week)\n*** 10 days notice to cancel, all payments are made on the first of the month',
    shortDescription: 'Strategic social media marketing with analytics-driven campaigns to reach your ideal audience across all major platforms.',
    category: 'social',
    type: 'VARIABLE_SUBSCRIPTION',
    status: 'ACTIVE',
    featured: true,
    setupFee: 9900,
    billingInterval: 'month',
    sortOrder: 7,
    variants: [
      // Subscription Level x Short Form Video Add-on
      // Variant names: "Level - VideoOption" for multi-attribute dropdown parsing
      { name: 'Basic - None', priceMonthly: 49300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Basic - 2 Short Form Videos', priceMonthly: 61300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Basic - 4 Short Form Videos', priceMonthly: 73300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 3 },
      { name: 'Pro - None', priceMonthly: 79300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 4 },
      { name: 'Pro - 2 Short Form Videos', priceMonthly: 91300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 5 },
      { name: 'Pro - 4 Short Form Videos', priceMonthly: 103300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 6 },
      { name: 'Ultimate - None', priceMonthly: 99300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 7 },
      { name: 'Ultimate - 2 Short Form Videos', priceMonthly: 111300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 8 },
      { name: 'Ultimate - 4 Short Form Videos', priceMonthly: 123300, setupFee: 9900, billingInterval: 'MONTHLY', sortOrder: 9 },
    ],
  },

  // ─── 8. Short Form Video Marketing (WC ID 1965) ───────────────────────
  // CSV: Basic $160, Pro $320, Ultimate $480, signup $49
  {
    name: 'Short Form Video Marketing',
    slug: 'short-form-video-marketing',
    description: 'Introducing Webink Solutions\' Short Form Video Marketing Service: your one-stop solution for creating and scheduling engaging, trend-driven content for Instagram Reels, Facebook Reels, TikTok Videos, or YouTube Shorts. We understand the power of short-form videos in today\'s fast-paced digital landscape, and our expert team is here to ensure your brand stays ahead of the curve.\n\nOur service includes:\n1. Trend-based prompts: We\'ll provide you with creative and unique prompts, tailored to your brand and based on current trends, to make your short-form videos truly stand out.\n2. Professional video editing: Our skilled editors will transform your raw footage into polished and captivating content, designed to grab your audience\'s attention.\n3. Trending audio: We\'ll incorporate the latest trending audio, enhancing your video\'s appeal and increasing the likelihood of it going viral.\n4. Written content & hashtags: Our team will create compelling captions and carefully research relevant hashtags to maximize your reach and visibility.\n5. Optimal posting times: We\'ll study your target audience and post your videos at the most effective times, ensuring they reach the maximum number of viewers.\n\nLet Webink Solutions take your social media presence to new heights with our Short Form Video Marketing Service. Stay on top of trends, engage your audience, and watch your brand\'s online presence soar!',
    shortDescription: 'Professional short-form video creation and scheduling for Instagram Reels, Facebook Reels, TikTok, and YouTube Shorts.',
    category: 'video',
    type: 'VARIABLE_SUBSCRIPTION',
    status: 'ACTIVE',
    setupFee: 4900,
    billingInterval: 'month',
    sortOrder: 8,
    variants: [
      { name: 'Basic', priceMonthly: 16000, setupFee: 4900, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro', priceMonthly: 32000, setupFee: 4900, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate', priceMonthly: 48000, setupFee: 4900, billingInterval: 'MONTHLY', sortOrder: 3 },
    ],
  },

  // ─── 9. Paid Advertising (WC ID 2695) ─────────────────────────────────
  // CSV: simple, $0 regular price — contact for pricing
  {
    name: 'Paid Advertising',
    slug: 'paid-advertising',
    description: 'PPC Management \u2013 Tailored to Your Needs\nGrow Your Business with Customizable Multi-Network PPC Campaigns\n\nTake control of your digital advertising with a flexible PPC management package that adapts to your business goals. Whether you want to focus on a single platform or expand your reach across multiple networks, we\'ve got you covered. With WebInk Solutions, you\'ll get expert campaign management designed to maximize your ad spend and deliver measurable results.\n\nThis purchase covers the one-time onboarding fee only and includes access to our onboarding process to kickstart your campaigns. After purchase, you\'ll receive an onboarding form to complete, and monthly billing will follow based on your total ad spend.\n\nImportant Billing Details:\n- All ad spend will be connected to your accounts, and you\'ll pay those ad platform fees directly.\n- WebInk Solutions will bill separately for our management fee (a percentage of your total monthly ad spend).\n- This setup ensures full transparency and control over your advertising budget.\n\nPricing Options:\n1. Single Network (Focused Growth): One-Time Onboarding Fee: $250, Management Fee: 20% of Ad Spend\n2. Two Networks (Accelerated Expansion): One-Time Onboarding Fee: $500 ($250 per network), Management Fee: 25% of Ad Spend\n3. Three or More Networks (Maximum Impact): One-Time Onboarding Fee: $250 per network, Management Fee: 30% of Ad Spend\n\nWhat\'s Included:\n- Keyword Research & Precise Targeting\n- Compelling Ad Copy Creation\n- Campaign Setup, Management, and Optimization\n- Monthly Performance Reporting with Actionable Insights\n- Ad Creatives Included for Ad Spend Over $5,000/mo\n\nReady to grow your business? Select the platforms that best align with your goals and let us handle the rest.',
    shortDescription: 'Customizable PPC Management across Google, Meta, LinkedIn, and X/Twitter. This purchase covers the one-time onboarding fee; monthly management fees are billed separately based on ad spend.',
    category: 'advertising',
    type: 'SIMPLE',
    status: 'ACTIVE',
    sortOrder: 9,
    variants: [
      { name: 'Contact for Pricing', contactOnly: true, billingInterval: 'ONE_TIME', sortOrder: 1 },
    ],
  },

  // ─── 10. Google Business Profile Optimization (WC ID 2726) ─────────────
  // CSV: simple, $200 regular price
  {
    name: 'Google Business Profile Optimization',
    slug: 'google-business-profile-optimization',
    description: 'Google Business Profile Creation & Optimization\n\nWhy Your Google Business Profile Matters:\n- Local Visibility: Appear prominently in Google Maps and local search results.\n- Credibility & Trust: Make a strong first impression with accurate, up-to-date business information.\n- Easy Customer Engagement: Encourage reviews, answer FAQs, and showcase photos to connect with potential customers.\n\nWhat We Offer:\n- Complete Setup & Verification: We handle the entire process\u2014from creation to final verification\u2014so you don\'t have to.\n- Profile Optimization: Strategic category selection, keyword placement, and compelling descriptions to improve local SEO.\n- Ongoing Support: Need updates or new features? We\'re here to help you stay competitive and relevant.\n\nBenefits of Partnering with Webink Solutions:\n- Proven Local SEO Expertise: We\'ve helped countless businesses rank higher in local searches.\n- Tailored Strategy: We customize your profile to reflect your unique brand and community needs.\n- Seamless Experience: No guesswork\u2014just professional, end-to-end management and reliable results.\n\nStart standing out in local search. Let Webink Solutions craft a Google Business Profile that brings more customers right to your door!',
    shortDescription: 'Amplify your local presence with Google Business Profile Creation & Optimization. Boost your local SEO, build online authority, and attract the right customers.',
    category: 'other',
    type: 'SIMPLE',
    status: 'ACTIVE',
    sortOrder: 10,
    variants: [
      { name: 'Standard', priceOneTime: 20000, billingInterval: 'ONE_TIME', sortOrder: 1 },
    ],
  },

  // ─── 11. Google Local Service Ads Management (WC ID 3029) ──────────────
  // CSV: subscription, $250/mo, signup $150
  {
    name: 'Google Local Service Ads (LSA) Management & Optimization',
    slug: 'google-lsa-management',
    description: 'LSA Management \u2013 Dominate Local Search\n\nSecure the most valuable local search real estate with a specialized Local Service Ads (LSA) management package from Webink Solutions. We handle the complex compliance, continuous auditing, and optimization required to earn the crucial Google Verified badge, driving high-quality, ready-to-book leads directly to your business.\n\nThis purchase covers the one-time setup fee only and initiates the mandatory verification process to get your ads approved.\n\nImportant Billing Details:\n- Ad Spend: All lead costs are connected to your accounts, and you\'ll pay these ad platform fees directly to Google. We will set up the LSA account and assist you with adding your billing credentials for full transparency.\n- Management Fee: Webink Solutions will bill separately for our fixed monthly management fee ($250/month). This fee does not include your ad budget.\n- Ad Model: LSA operates on a Pay-Per-Lead (PPL) basis, which is typically more cost-effective than standard Pay-Per-Click (PPC) campaigns.\n\nLSA Pricing:\n- One-Time Onboarding Fee: $150 \u2014 Covers the initial configuration and compliance coordination.\n- Management Fee: $250/month \u2014 Covers all ongoing optimization and lead auditing.\n- Performance Bonus: $50 (conditional) \u2014 Applied only when monthly optimizations achieve a 10% increase in lead volume for the ad spend.\n\nWhat\'s Included:\n- Lead Auditing & Credit Management: We review all charged leads and submit disputes to fight for charge credits.\n- Ranking Optimization: We continuously monitor your Responsiveness Score which heavily impacts your ad rank.\n- Budget & Performance Advisory: We track your effective Cost Per Qualified Lead (CPQL) and advise on budget adjustments.\n- Compliance Monitoring: We track document expiration dates to prevent a lapse in verification.',
    shortDescription: 'Secure top-of-Google placement and qualified leads with professional LSA management. Includes compliance setup, Google Verified badge, expert lead auditing, and continuous ranking optimization.',
    category: 'advertising',
    type: 'SUBSCRIPTION',
    status: 'ACTIVE',
    setupFee: 15000,
    billingInterval: 'month',
    sortOrder: 11,
    variants: [
      { name: 'Standard', priceMonthly: 25000, setupFee: 15000, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },

  // ─── 12. RapidSSL DV Certificate (WC ID 2549) ─────────────────────────
  // CSV: subscription, $25/year
  {
    name: 'RapidSSL DV Certificate',
    slug: 'rapidssl-dv-certificate',
    description: 'RapidSSL\u00ae Certificate (Now called RapidSSL Standard DV)\n\nLightning-fast standard SSL w/ 256-bit encryption\n\nRapidSSL\u00ae certificates (a.k.a RapidSSL Standard DV) will secure your website fast, for less. As the name suggests, you will speed through the certificate enrollment process because of the automated DCV system used for this standard domain validation (DV) certificate. RapidSSL\u00ae certificates are best-suited when needing basic encryption for a small business or as an entry-level certificate. It\'s truly known for its lightning-fast issuance process, cheap price and because of the unlimited server licenses at no extra cost, making it a perfect affordable SSL certificate solution for securing something as simple as a login page or your internal network(s).',
    shortDescription: 'Lightning-fast standard SSL certificate with 256-bit encryption for secure HTTPS connections.',
    category: 'other',
    type: 'SUBSCRIPTION',
    status: 'ACTIVE',
    billingInterval: 'year',
    sortOrder: 12,
    variants: [
      { name: 'Annual', priceAnnual: 2500, billingInterval: 'ANNUAL', sortOrder: 1 },
    ],
  },

  // ─── 13. InkTree Page (WC ID 1710) ────────────────────────────────────
  // CSV: subscription, $5/mo, signup $10
  {
    name: 'InkTree Page',
    slug: 'inktree-page',
    description: 'Custom link-in-bio page for social media profiles. A branded, mobile-optimized landing page that consolidates all your important links in one place.',
    shortDescription: 'Custom branded link-in-bio page for social media.',
    category: 'other',
    type: 'SUBSCRIPTION',
    status: 'ACTIVE',
    setupFee: 1000,
    billingInterval: 'month',
    sortOrder: 13,
    variants: [
      { name: 'Standard', priceMonthly: 500, setupFee: 1000, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },

  // ─── 14. Social Media - Basic Package (WC ID 1795) ────────────────────
  // CSV: simple, $493 regular price (legacy standalone product)
  {
    name: 'Social Media - Basic Package',
    slug: 'social-media-basic-package',
    description: 'Social Media Basic Package \u2014 a standalone purchase option for basic social media marketing services.',
    category: 'social',
    type: 'SIMPLE',
    status: 'ACTIVE',
    sortOrder: 14,
    variants: [
      { name: 'Basic Package', priceOneTime: 49300, billingInterval: 'ONE_TIME', sortOrder: 1 },
    ],
  },

  // ─── 15. Custom Social Media Package for HER Fitness (WC ID 2635) ─────
  // Client-specific — DRAFT so it doesn't appear publicly
  // CSV: subscription, $585.25/mo
  {
    name: 'Custom Social Media Package for HER Fitness',
    slug: 'custom-social-media-her-fitness',
    description: 'Custom Social Media Package for HER Fitness\n\nThis custom package is designed specifically for HER Fitness Boutique. For all other clients, please explore our standard Social Media Marketing package.\n\nIn today\'s digital world, your online presence is key to building connections with your audience and driving engagement. At Webink Solutions, we understand the importance of showcasing your brand in a way that resonates with your clients.\n\nWhat\'s Included:\n- 3-5 Social Media Posts per Week\n- Custom Content Strategy\n- Scheduling and Optimization\n- Dedicated Support\n\nImportant Details:\n- This package does not include ad budget allocation, reels, or story creation.\n- Locked Pricing: This custom plan is grandfathered at the current rate.\n- Flexible Terms: A 10-day notice is required for cancellations, and all payments are processed on the 1st of each month.',
    category: 'social',
    type: 'SUBSCRIPTION',
    status: 'DRAFT',
    billingInterval: 'month',
    sortOrder: 15,
    variants: [
      { name: 'HER Fitness Custom', priceMonthly: 58525, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },
]

async function main() {
  // ─── Safety: record pre-seed counts ─────────────────────────────────
  console.log('Pre-seed safety check...')
  const preUsers = await prisma.user.count()
  const preOrders = await prisma.order.count()
  const preSubs = await prisma.subscription.count()
  console.log(`   Users: ${preUsers} | Orders: ${preOrders} | Subscriptions: ${preSubs}`)

  // ─── DB backup via mysqldump ────────────────────────────────────────
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  try {
    const dbUrl = process.env.DATABASE_URL || ''
    const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    if (match) {
      const [, user, pass, host, port, db] = match
      const dumpFile = `/tmp/webink-backup-${timestamp}.sql`
      console.log(`Taking DB backup to ${dumpFile}...`)
      execSync(
        `mysqldump -u${user} -p${pass} -h${host} -P${port} ${db} > ${dumpFile}`,
        { stdio: 'pipe' }
      )
      console.log('   Backup complete')
    } else {
      console.log('   Could not parse DATABASE_URL for backup — continuing with caution')
    }
  } catch {
    console.log('   mysqldump not available — skipping backup (running locally?)')
  }

  // ─── Handle FK constraints: disconnect subscriptions/orderItems ─────
  const subCount = await prisma.subscription.count()
  const orderItemCount = await prisma.orderItem.count()

  if (subCount > 0) {
    console.log(`\n   WARNING: ${subCount} subscriptions reference existing variants`)
    console.log('   Deleting subscriptions (variant IDs will change)...')
    await prisma.subscription.deleteMany({})
  }

  if (orderItemCount > 0) {
    console.log(`   WARNING: ${orderItemCount} order items reference existing variants`)
    console.log('   Deleting order items (variant IDs will change)...')
    await prisma.orderItem.deleteMany({})
  }

  // ─── Rebuild products ─────────────────────────────────────────────────
  console.log('\nRebuilding products from WooCommerce CSV export...')
  console.log('   Deleting existing products and variants...')

  await prisma.productVariant.deleteMany({})
  await prisma.product.deleteMany({})
  console.log('   Cleared existing products and variants')

  for (const product of products) {
    const { variants, ...productData } = product

    const created = await prisma.product.create({
      data: {
        ...productData,
        active: productData.status === 'ACTIVE',
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            priceMonthly: v.priceMonthly ?? null,
            priceAnnual: v.priceAnnual ?? null,
            priceOneTime: v.priceOneTime ?? null,
            salePrice: v.salePrice ?? null,
            setupFee: v.setupFee ?? null,
            billingInterval: v.billingInterval,
            trialDays: v.trialDays ?? null,
            contactOnly: v.contactOnly ?? false,
            sortOrder: v.sortOrder,
          })),
        },
      },
    })

    console.log(`   ${created.name} (${variants.length} variant${variants.length > 1 ? 's' : ''})`)
  }

  // ─── Verify counts ─────────────────────────────────────────────────────
  const productCount = await prisma.product.count()
  const variantCount = await prisma.productVariant.count()
  console.log(`\nRebuild complete: ${productCount} products, ${variantCount} variants`)

  // ─── Verify customer data unchanged ─────────────────────────────────
  const postUsers = await prisma.user.count()
  const postOrders = await prisma.order.count()
  console.log(`\nPost-seed safety verification:`)
  console.log(`   Users: ${postUsers} (was ${preUsers}) ${postUsers === preUsers ? 'OK' : 'MISMATCH'}`)
  console.log(`   Orders: ${postOrders} (was ${preOrders}) ${postOrders === preOrders ? 'OK' : 'MISMATCH'}`)

  console.log('\nSeeding complete!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

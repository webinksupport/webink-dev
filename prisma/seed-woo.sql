-- WooCommerce Product Rebuild — Generated from CSV export (24 March 2026)
-- SEO Check-Up addon REMOVED from hosting per business requirement

SET @now = NOW();

-- Safety: record pre-counts
SELECT 'PRE-SEED COUNTS' as label;
SELECT COUNT(*) as users FROM User;
SELECT COUNT(*) as orders FROM `Order`;
SELECT COUNT(*) as subscriptions FROM Subscription;

-- Handle FK constraints: remove subscriptions and order items that reference variants
DELETE FROM Subscription;
DELETE FROM OrderItem;

-- Clear existing products
DELETE FROM ProductVariant;
DELETE FROM Product;

-- ═══════════════════════════════════════════════════════════════════════
-- 1. Managed Web Hosting (WC ID 1504)
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_hosting_main', 'Managed Web Hosting', 'managed-web-hosting',
  'Managed hosting is something that is offered as a way for clients to take the focus off of maintaining a website and back on doing what they are best at, whether that be growing your business, writing a blog or selling your products managed wordpress hosting takes the hassle out of maintaining your site. We offer the same functions as many of the large managed hosting sites like security and threat protection, regular updates for website software and routine backups to ensure your site and data are always safe.\n\nKeeping your site up to date with plugin, theme and WordPress updates is the most essential thing you can do to ensure the security of your site and your business. Hackers are constantly working to access your site in an attempt to find valuable information, you should have someone working just as hard to keep them out. Webink Solutions will monitor your site 24/7 and ensure that all of your systems are running to full potential.\n\n*Development time NOT included with Basic',
  'Professional managed WordPress hosting with 24/7 monitoring, security protection, routine backups, and automatic updates.',
  'hosting', 'VARIABLE_SUBSCRIPTION', 'ACTIVE', 1, 1, NULL, 'month', 1, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_hosting_basic_mo', 'prod_hosting_main', 'Basic - Monthly', 3100, NULL, NULL, NULL, NULL, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now),
  ('var_hosting_pro_mo', 'prod_hosting_main', 'Pro - Monthly', 3900, NULL, NULL, NULL, NULL, 'MONTHLY', 0, 1, 'ACTIVE', 2, @now, @now),
  ('var_hosting_ult_mo', 'prod_hosting_main', 'Ultimate - Monthly', 5900, NULL, NULL, NULL, NULL, 'MONTHLY', 0, 1, 'ACTIVE', 3, @now, @now),
  ('var_hosting_basic_yr', 'prod_hosting_main', 'Basic - Annual', NULL, 33500, NULL, NULL, NULL, 'ANNUAL', 0, 1, 'ACTIVE', 4, @now, @now),
  ('var_hosting_pro_yr', 'prod_hosting_main', 'Pro - Annual', NULL, 42100, NULL, NULL, NULL, 'ANNUAL', 0, 1, 'ACTIVE', 5, @now, @now),
  ('var_hosting_ult_yr', 'prod_hosting_main', 'Ultimate - Annual', NULL, 63700, NULL, NULL, NULL, 'ANNUAL', 0, 1, 'ACTIVE', 6, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 2. Add-On Hosting Site (WC ID 2259)
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_hosting_addon', 'Add-On Hosting Site', 'add-on-hosting-site',
  'Effortless Multi-Site Management: Webink Solutions\' Add-on Site Feature\n\nStreamline your digital portfolio with our Add-on Site feature. Ideal for those managing multiple websites, this solution offers the convenience of a single hosting account for all your sites.\n\nKey Advantages:\n- Unified Hosting Account: Easily manage multiple websites under one roof.\n- Shared Development Hours: Utilize your 2 to 4 hours of monthly development work across all sites, ensuring each gets the attention it needs.\n- Comprehensive Managed Hosting Services: Each Add-on Site benefits from robust security, routine backups, 24/7 monitoring, 20GB disk space, unlimited bandwidth, unlimited domain-based email addresses, free migration, premium themes, and SSL.\n\nSimplify Your Online Presence: With the Add-on Site feature, managing multiple websites has never been easier. Share resources, save time, and secure your digital presence, all under one account with Webink Solutions.',
  'Add another website to your existing hosting plan with shared resources and full managed hosting services.',
  'hosting', 'SUBSCRIPTION', 'ACTIVE', 1, 0, NULL, 'month', 2, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_addon_site', 'prod_hosting_addon', 'Add-On Site', 1500, NULL, NULL, NULL, NULL, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 3. Fully Managed SEO (WC ID 1531) — signup $250
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_seo_full', 'Fully Managed SEO', 'fully-managed-seo',
  'Fully Managed SEO\n\n- Fully Managed SEO Plan\n- Data Driven Strategy\n- Products (deliverables) vary depending on monthly need\n- Monthly SEO and Content Reports',
  'Comprehensive, fully managed SEO with data-driven strategy and monthly reporting.',
  'seo', 'VARIABLE_SUBSCRIPTION', 'ACTIVE', 1, 1, 25000, 'month', 3, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_seo_full_basic', 'prod_seo_full', 'Basic', 110300, NULL, NULL, NULL, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now),
  ('var_seo_full_pro', 'prod_seo_full', 'Pro', 149300, NULL, NULL, NULL, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 2, @now, @now),
  ('var_seo_full_ult', 'prod_seo_full', 'Ultimate', 199300, NULL, NULL, NULL, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 3, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 4. SEO Primer (WC ID 2388) — Regular $653, Sale $553
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_seo_primer', 'SEO Primer', 'seo-primer',
  'Introducing SEO Primer, our all-inclusive On-Page SEO service designed to elevate your website\'s search engine performance. This service is perfect for websites needing optimization for up to 5 pages. Our meticulous approach ensures your site is optimized for both users and search engines, helping you rank higher and attract more traffic. If you need more than 5 pages optimized, please contact us for customized pricing and services tailored to your needs.\n\nOur SEO Primer includes:\n- Keyword Research\n- Keyword Difficulty Analysis\n- Final List of Keywords for Optimization\n- Site Structure Analysis\n- URL Analysis\n- Title & Meta Tags\n- Meta Data Creation for Final Keywords\n- Meta Data and On-Page Revision\n- Keyword Density & Prominence Check\n- Hyperlinking the Content\n- Internal Linking\n- Image Optimization\n- Header Tags Optimization\n- Anchor Text Optimization\n- Canonical URLs Implementation\n- Robots.txt Optimization\n- Broken Link Checking\n- XML Sitemap Creation & Update\n- HTML Sitemap Creation & Update\n- URL List (TXT Sitemap) Creation\n- Creating Accounts in Google\n- Submit XML Sitemap',
  'Boost your website\'s search engine ranking with our SEO Primer service. Comprehensive On-Page SEO optimization for up to 5 pages.',
  'seo', 'SIMPLE', 'ACTIVE', 1, 0, NULL, NULL, 4, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_seo_primer', 'prod_seo_primer', 'SEO Primer', NULL, NULL, 65300, 55300, NULL, 'ONE_TIME', 0, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 5. Local SEO (WC ID 2133) — signup $250
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_local_seo', 'Local SEO', 'local-seo',
  'Local SEO Services\n\nWebink Solutions specializes in Local SEO aimed at making Sarasota businesses the go-to spots in their neighborhoods. From setting up your Google Business Profile for optimal local search results to employing hyper-local keywords, we help you nail that community vibe. Our services include keeping your business info consistent across the web, tracking your strategy\'s effectiveness, and making sure your local content gets the spotlight it deserves.\n\n- Monthly Local Visibility Reports\n- Comprehensive Local SEO Strategy\n- On-Page SEO with Local Focus\n- Custom Signal Crafting\n- Niche & Local Signal Development\n- Brand Foundation & Optimization\n- Google Business Profile Management\n- Local Content & Media Enhancement\n- Targeted Link Building\n- Advanced Tactics & Special Features\n\n*Note: month-to-month subscription, cancellable anytime. SEO services require 3-6 months minimum to see results.',
  'Local SEO services to make Sarasota businesses the go-to spots in their neighborhoods with Google Business Profile management and hyper-local optimization.',
  'seo', 'VARIABLE_SUBSCRIPTION', 'ACTIVE', 1, 1, 25000, 'month', 5, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_local_seo_basic', 'prod_local_seo', 'Basic', 110300, NULL, NULL, NULL, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now),
  ('var_local_seo_pro', 'prod_local_seo', 'Pro', 160300, NULL, NULL, NULL, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 2, @now, @now),
  ('var_local_seo_ult', 'prod_local_seo', 'Ultimate', 210300, NULL, NULL, NULL, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 3, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 6. Local SEO 3-Month BOOST (WC ID 2138) — signup $250, sale prices
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_local_seo_boost', 'Local SEO 3-Month BOOST', 'local-seo-3-month-boost',
  'Local SEO Services - 3-Month Commitment Special:\n\nLock in your discounted rate today with a 3-month commitment to our game-changing Local SEO services! Why 3 months? Because SEO isn\'t a sprint; it\'s a marathon. It takes at least 3-6 months to really start making waves. Stick with us for the first 3 months and you\'ll be set to see exciting results that drive your business forward.\n\nSame comprehensive Local SEO service including Monthly Reports, On-Page SEO, Google Business Profile Management, Link Building, and more.',
  'Lock in a discounted rate with a 3-month commitment to Local SEO. Same comprehensive service at a reduced monthly price.',
  'seo', 'VARIABLE_SUBSCRIPTION', 'ACTIVE', 1, 0, 25000, 'month', 6, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_lseo_boost_basic', 'prod_local_seo_boost', 'Basic', 110300, NULL, NULL, 99300, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now),
  ('var_lseo_boost_pro', 'prod_local_seo_boost', 'Pro', 160300, NULL, NULL, 144300, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 2, @now, @now),
  ('var_lseo_boost_ult', 'prod_local_seo_boost', 'Ultimate', 199300, NULL, NULL, 189300, 25000, 'MONTHLY', 0, 1, 'ACTIVE', 3, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 7. Social Media Marketing (WC ID 1549) — signup $99
-- 3 levels x 3 video add-on options = 9 variations
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_social', 'Social Media Marketing', 'social-media-marketing',
  'Social Media Marketing Solutions\n\nWe operate in an online world. Internet usage and online interactions continue to steadily increase each year. The way you are perceived online and the way you interact with your audience online matters. How easily you are found and reviewed on Google, Facebook, and other social media platforms has changed the landscape for local businesses.\n\nWe help to create digital marketing strategies to reach the overall goals of your business. We provide strategic tools, analytics, resources, best practices, and planning to get your brand to the customers you want to reach with a cohesive brand message.\n\n* All subscriptions require a one-time $99 on-boarding fee\n** 10 days notice to cancel, all payments are made on the first of the month',
  'Strategic social media marketing with analytics-driven campaigns to reach your ideal audience across all major platforms.',
  'social', 'VARIABLE_SUBSCRIPTION', 'ACTIVE', 1, 1, 9900, 'month', 7, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_social_b_none', 'prod_social', 'Basic - None', 49300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now),
  ('var_social_b_2vid', 'prod_social', 'Basic - 2 Short Form Videos', 61300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 2, @now, @now),
  ('var_social_b_4vid', 'prod_social', 'Basic - 4 Short Form Videos', 73300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 3, @now, @now),
  ('var_social_p_none', 'prod_social', 'Pro - None', 79300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 4, @now, @now),
  ('var_social_p_2vid', 'prod_social', 'Pro - 2 Short Form Videos', 91300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 5, @now, @now),
  ('var_social_p_4vid', 'prod_social', 'Pro - 4 Short Form Videos', 103300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 6, @now, @now),
  ('var_social_u_none', 'prod_social', 'Ultimate - None', 99300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 7, @now, @now),
  ('var_social_u_2vid', 'prod_social', 'Ultimate - 2 Short Form Videos', 111300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 8, @now, @now),
  ('var_social_u_4vid', 'prod_social', 'Ultimate - 4 Short Form Videos', 123300, NULL, NULL, NULL, 9900, 'MONTHLY', 0, 1, 'ACTIVE', 9, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 8. Short Form Video Marketing (WC ID 1965) — signup $49
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_sfv', 'Short Form Video Marketing', 'short-form-video-marketing',
  'Introducing Webink Solutions\' Short Form Video Marketing Service: your one-stop solution for creating and scheduling engaging, trend-driven content for Instagram Reels, Facebook Reels, TikTok Videos, or YouTube Shorts.\n\nOur service includes:\n1. Trend-based prompts tailored to your brand\n2. Professional video editing\n3. Trending audio incorporation\n4. Written content & hashtags\n5. Optimal posting times\n\nLet Webink Solutions take your social media presence to new heights!',
  'Professional short-form video creation and scheduling for Instagram Reels, Facebook Reels, TikTok, and YouTube Shorts.',
  'video', 'VARIABLE_SUBSCRIPTION', 'ACTIVE', 1, 0, 4900, 'month', 8, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_sfv_basic', 'prod_sfv', 'Basic', 16000, NULL, NULL, NULL, 4900, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now),
  ('var_sfv_pro', 'prod_sfv', 'Pro', 32000, NULL, NULL, NULL, 4900, 'MONTHLY', 0, 1, 'ACTIVE', 2, @now, @now),
  ('var_sfv_ult', 'prod_sfv', 'Ultimate', 48000, NULL, NULL, NULL, 4900, 'MONTHLY', 0, 1, 'ACTIVE', 3, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 9. Paid Advertising (WC ID 2695) — Contact for Pricing
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_ppc', 'Paid Advertising', 'paid-advertising',
  'PPC Management - Tailored to Your Needs\n\nTake control of your digital advertising with a flexible PPC management package that adapts to your business goals.\n\nPricing Options:\n1. Single Network: Onboarding $250, Management 20% of Ad Spend\n2. Two Networks: Onboarding $500, Management 25% of Ad Spend\n3. Three+ Networks: Onboarding $250/network, Management 30% of Ad Spend\n\nIncludes: Keyword Research, Ad Copy Creation, Campaign Management, Monthly Reporting, Ad Creatives for spend over $5,000/mo.',
  'Customizable PPC Management across Google, Meta, LinkedIn, and X/Twitter. Monthly management fees based on ad spend.',
  'advertising', 'SIMPLE', 'ACTIVE', 1, 0, NULL, NULL, 9, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_ppc_contact', 'prod_ppc', 'Contact for Pricing', NULL, NULL, NULL, NULL, NULL, 'ONE_TIME', 1, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 10. Google Business Profile Optimization (WC ID 2726) — $200 one-time
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_gbp', 'Google Business Profile Optimization', 'google-business-profile-optimization',
  'Google Business Profile Creation & Optimization\n\nWhy Your Google Business Profile Matters:\n- Local Visibility: Appear prominently in Google Maps and local search results.\n- Credibility & Trust: Make a strong first impression with accurate, up-to-date business information.\n- Easy Customer Engagement: Encourage reviews, answer FAQs, and showcase photos.\n\nWhat We Offer:\n- Complete Setup & Verification\n- Profile Optimization with strategic category selection and keyword placement\n- Ongoing Support\n\nStart standing out in local search. Let Webink Solutions craft a Google Business Profile that brings more customers right to your door!',
  'Amplify your local presence with Google Business Profile Creation & Optimization. Boost your local SEO and attract the right customers.',
  'other', 'SIMPLE', 'ACTIVE', 1, 0, NULL, NULL, 10, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_gbp_std', 'prod_gbp', 'Standard', NULL, NULL, 20000, NULL, NULL, 'ONE_TIME', 0, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 11. Google LSA Management (WC ID 3029) — $250/mo, signup $150
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_lsa', 'Google Local Service Ads (LSA) Management & Optimization', 'google-lsa-management',
  'LSA Management - Dominate Local Search\n\nSecure the most valuable local search real estate with a specialized Local Service Ads management package from Webink Solutions.\n\nLSA Pricing:\n- One-Time Onboarding Fee: $150\n- Management Fee: $250/month\n- Performance Bonus: $50 (conditional, on 10% lead volume increase)\n\nIncludes: Lead Auditing & Credit Management, Ranking Optimization, Budget & Performance Advisory, Compliance Monitoring.',
  'Secure top-of-Google placement and qualified leads with professional LSA management. Includes Google Verified badge setup and continuous optimization.',
  'advertising', 'SUBSCRIPTION', 'ACTIVE', 1, 0, 15000, 'month', 11, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_lsa_std', 'prod_lsa', 'Standard', 25000, NULL, NULL, NULL, 15000, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 12. RapidSSL DV Certificate (WC ID 2549) — $25/year
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_ssl', 'RapidSSL DV Certificate', 'rapidssl-dv-certificate',
  'RapidSSL Certificate (Now called RapidSSL Standard DV)\n\nLightning-fast standard SSL w/ 256-bit encryption. RapidSSL certificates will secure your website fast, for less. Best-suited for basic encryption for a small business or as an entry-level certificate. Unlimited server licenses at no extra cost.',
  'Lightning-fast standard SSL certificate with 256-bit encryption for secure HTTPS connections.',
  'other', 'SUBSCRIPTION', 'ACTIVE', 1, 0, NULL, 'year', 12, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_ssl_annual', 'prod_ssl', 'Annual', NULL, 2500, NULL, NULL, NULL, 'ANNUAL', 0, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 13. InkTree Page (WC ID 1710) — $5/mo, signup $10
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_inktree', 'InkTree Page', 'inktree-page',
  'Custom link-in-bio page for social media profiles. A branded, mobile-optimized landing page that consolidates all your important links in one place.',
  'Custom branded link-in-bio page for social media.',
  'other', 'SUBSCRIPTION', 'ACTIVE', 1, 0, 1000, 'month', 13, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_inktree_std', 'prod_inktree', 'Standard', 500, NULL, NULL, NULL, 1000, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 14. Social Media - Basic Package (WC ID 1795) — $493 one-time
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_social_basic', 'Social Media - Basic Package', 'social-media-basic-package',
  'Social Media Basic Package - a standalone purchase option for basic social media marketing services.',
  NULL,
  'social', 'SIMPLE', 'ACTIVE', 1, 0, NULL, NULL, 14, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_social_basic_pkg', 'prod_social_basic', 'Basic Package', NULL, NULL, 49300, NULL, NULL, 'ONE_TIME', 0, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- 15. Custom Social Media for HER Fitness (WC ID 2635) — DRAFT
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO Product (id, name, slug, description, shortDescription, category, type, status, active, featured, setupFee, billingInterval, sortOrder, createdAt, updatedAt)
VALUES ('prod_her_fitness', 'Custom Social Media Package for HER Fitness', 'custom-social-media-her-fitness',
  'Custom Social Media Package for HER Fitness\n\nThis custom package is designed specifically for HER Fitness Boutique.\n\nIncludes: 3-5 Social Media Posts per Week, Custom Content Strategy, Scheduling and Optimization, Dedicated Support.\n\nDoes not include ad budget allocation, reels, or story creation. Locked pricing grandfathered at current rate.',
  NULL,
  'social', 'SUBSCRIPTION', 'DRAFT', 0, 0, NULL, 'month', 15, @now, @now);

INSERT INTO ProductVariant (id, productId, name, priceMonthly, priceAnnual, priceOneTime, salePrice, setupFee, billingInterval, contactOnly, active, status, sortOrder, createdAt, updatedAt) VALUES
  ('var_her_fitness', 'prod_her_fitness', 'HER Fitness Custom', 58525, NULL, NULL, NULL, NULL, 'MONTHLY', 0, 1, 'ACTIVE', 1, @now, @now);

-- ═══════════════════════════════════════════════════════════════════════
-- Post-seed verification
-- ═══════════════════════════════════════════════════════════════════════
SELECT 'POST-SEED COUNTS' as label;
SELECT COUNT(*) as products FROM Product;
SELECT COUNT(*) as variants FROM ProductVariant;
SELECT COUNT(*) as users FROM User;
SELECT COUNT(*) as orders FROM `Order`;

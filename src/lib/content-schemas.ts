/**
 * Content schemas define every editable field per page.
 * The CMS editor reads these to render the appropriate UI per field type.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'html'
  | 'image'
  | 'image_array'
  | 'feature_list'
  | 'process_steps'
  | 'faq_list'
  | 'pricing_tiers'
  | 'stat_list'
  | 'link'
  | 'seo'

export interface ContentFieldSchema {
  key: string
  label: string
  type: FieldType
  description?: string
}

export interface PageSchema {
  slug: string
  label: string
  url: string
  fields: ContentFieldSchema[]
}

// ─── Service Page Common Fields ─────────────────────────────────────

function servicePageFields(serviceName: string): ContentFieldSchema[] {
  return [
    { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
    { key: 'hero_subtext', label: 'Hero Subtext', type: 'textarea' },
    { key: 'hero_image', label: 'Hero Background Image', type: 'image' },
    { key: 'photos', label: `${serviceName} Photos`, type: 'image_array', description: 'Photos shown in the team/workspace section (need 3+)' },
    { key: 'features', label: `${serviceName} Features`, type: 'feature_list', description: 'Feature cards with icon, title, and description' },
    { key: 'process_steps', label: 'Process Steps', type: 'process_steps', description: 'Numbered steps explaining how you work' },
    { key: 'pricing', label: 'Pricing Tiers', type: 'pricing_tiers' },
    { key: 'faqs', label: 'FAQs', type: 'faq_list', description: 'Question & answer pairs' },
    { key: 'hero_cta_text', label: 'Hero CTA Text', type: 'text' },
    { key: 'hero_cta_link', label: 'Hero CTA Link', type: 'link' },
    { key: 'seo_meta_title', label: 'Meta Title', type: 'seo' },
    { key: 'seo_meta_description', label: 'Meta Description', type: 'seo' },
    { key: 'seo_og_image', label: 'OG / Featured Image', type: 'image', description: 'Social sharing image (Open Graph)' },
  ]
}

// ─── Page Schemas ───────────────────────────────────────────────────

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    slug: 'home',
    label: 'Homepage',
    url: '/',
    fields: [
      { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
      { key: 'hero_subtext', label: 'Hero Subtext', type: 'textarea' },
      { key: 'hero_image', label: 'Hero Background Image', type: 'image' },
      { key: 'hero_cta_text', label: 'Hero CTA Text', type: 'text' },
      { key: 'hero_cta_link', label: 'Hero CTA Link', type: 'link' },
      { key: 'services_eyebrow', label: 'Services Eyebrow', type: 'text' },
      { key: 'services_heading', label: 'Services Heading', type: 'text' },
      { key: 'about_eyebrow', label: 'About Eyebrow', type: 'text' },
      { key: 'about_heading', label: 'About Heading', type: 'text' },
      { key: 'about_body', label: 'About Body', type: 'html' },
      { key: 'stats', label: 'Stats Section', type: 'stat_list', description: 'Stat cards with value, suffix, label, sublabel' },
      { key: 'stats_heading', label: 'Stats Section Heading', type: 'text' },
      { key: 'seo_meta_title', label: 'Meta Title', type: 'seo' },
      { key: 'seo_meta_description', label: 'Meta Description', type: 'seo' },
      { key: 'seo_og_image', label: 'OG / Featured Image', type: 'image', description: 'Social sharing image (Open Graph)' },
    ],
  },
  {
    slug: 'about',
    label: 'About',
    url: '/about',
    fields: [
      { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
      { key: 'hero_subtext', label: 'Hero Subtext', type: 'textarea' },
      { key: 'hero_image', label: 'Hero Background Image', type: 'image' },
      { key: 'founder_name', label: 'Founder Name', type: 'text' },
      { key: 'founder_bio', label: 'Founder Bio', type: 'html' },
      { key: 'founder_image', label: 'Founder Photo', type: 'image' },
      { key: 'team_photos', label: 'Team Photos', type: 'image_array' },
      { key: 'mission_heading', label: 'Mission Heading', type: 'text' },
      { key: 'mission_body', label: 'Mission Body', type: 'html' },
      { key: 'values', label: 'Company Values', type: 'feature_list', description: 'Values with icon, title, and description' },
      { key: 'seo_meta_title', label: 'Meta Title', type: 'seo' },
      { key: 'seo_meta_description', label: 'Meta Description', type: 'seo' },
      { key: 'seo_og_image', label: 'OG / Featured Image', type: 'image', description: 'Social sharing image (Open Graph)' },
    ],
  },
  {
    slug: 'contact',
    label: 'Contact',
    url: '/contact',
    fields: [
      { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
      { key: 'hero_subtext', label: 'Hero Subtext', type: 'textarea' },
      { key: 'hero_image', label: 'Hero Background Image', type: 'image' },
      { key: 'form_heading', label: 'Form Heading', type: 'text' },
      { key: 'form_subtext', label: 'Form Subtext', type: 'textarea' },
      { key: 'seo_meta_title', label: 'Meta Title', type: 'seo' },
      { key: 'seo_meta_description', label: 'Meta Description', type: 'seo' },
      { key: 'seo_og_image', label: 'OG / Featured Image', type: 'image', description: 'Social sharing image (Open Graph)' },
    ],
  },
  {
    slug: 'services',
    label: 'Services Hub',
    url: '/services',
    fields: [
      { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
      { key: 'hero_subtext', label: 'Hero Subtext', type: 'textarea' },
      { key: 'hero_image', label: 'Hero Background Image', type: 'image' },
      { key: 'seo_meta_title', label: 'Meta Title', type: 'seo' },
      { key: 'seo_meta_description', label: 'Meta Description', type: 'seo' },
      { key: 'seo_og_image', label: 'OG / Featured Image', type: 'image', description: 'Social sharing image (Open Graph)' },
    ],
  },
  {
    slug: 'services/web-design',
    label: 'Web Design',
    url: '/services/web-design',
    fields: servicePageFields('Web Design'),
  },
  {
    slug: 'services/seo',
    label: 'SEO Services',
    url: '/services/seo',
    fields: servicePageFields('SEO'),
  },
  {
    slug: 'services/social-media',
    label: 'Social Media',
    url: '/services/social-media',
    fields: servicePageFields('Social Media'),
  },
  {
    slug: 'services/paid-advertising',
    label: 'Paid Advertising',
    url: '/services/paid-advertising',
    fields: servicePageFields('Paid Advertising'),
  },
  {
    slug: 'services/ai-marketing',
    label: 'AI Marketing',
    url: '/services/ai-marketing',
    fields: servicePageFields('AI Marketing'),
  },
  {
    slug: 'services/custom-crm',
    label: 'Custom CRM',
    url: '/services/custom-crm',
    fields: servicePageFields('Custom CRM'),
  },
  {
    slug: 'services/web-hosting',
    label: 'Web Hosting',
    url: '/services/web-hosting',
    fields: servicePageFields('Web Hosting'),
  },
  {
    slug: 'pricing',
    label: 'Pricing',
    url: '/pricing',
    fields: [
      { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
      { key: 'hero_subtext', label: 'Hero Subtext', type: 'textarea' },
      { key: 'faqs', label: 'Pricing FAQs', type: 'faq_list' },
      { key: 'seo_meta_title', label: 'Meta Title', type: 'seo' },
      { key: 'seo_meta_description', label: 'Meta Description', type: 'seo' },
      { key: 'seo_og_image', label: 'OG / Featured Image', type: 'image', description: 'Social sharing image (Open Graph)' },
    ],
  },
]

export function getPageSchema(slug: string): PageSchema | undefined {
  return PAGE_SCHEMAS.find((p) => p.slug === slug)
}

/** List of icon names available in the ServicePageLayout icon map */
export const AVAILABLE_ICONS = [
  'Globe', 'Search', 'TrendingUp', 'Share2', 'Server', 'Brain',
  'Zap', 'Shield', 'BarChart3', 'Clock', 'Users', 'Target',
  'Megaphone', 'Palette', 'Code', 'Cpu', 'CheckCircle2',
]

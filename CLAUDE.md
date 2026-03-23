# CLAUDE.md — Webink Design System & Build Spec
> **Read this file before making ANY changes to this codebase.**
> Every design decision, animation, and component must conform to the standards documented here.

---

## 1. PROJECT OVERVIEW

**What this is:** A complete ground-up rebuild of [webink.solutions](https://webink.solutions) in Next.js. The current site runs on WordPress + WooCommerce + Salient theme. This Next.js rebuild replaces it entirely.

| Field | Value |
|-------|-------|
| Company | Webink Solutions |
| Owner | **Sean Rowe** (NEVER "Sean Brennan" or any other name) |
| Location | Sarasota, FL (also serves Tampa & Bradenton) |
| Dev URL | https://dev.webink.solutions |
| Production URL | https://webink.solutions |
| GitHub Repo | `webinksupport/webink-dev` |

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Scroll animations | Framer Motion |
| Pinned / horizontal scroll | GSAP + ScrollTrigger |
| Smooth scroll | Lenis (LenisProvider already in `layout.tsx` — **do not remove**) |
| SVG / text animations | anime.js |
| Carousels / sliders | Flickity |
| Image-ready callbacks | imagesloaded |
| Headline scaling | fitty |
| Icons | lucide-react |

### Services Offered
- SEO
- Social Media Marketing
- PPC / Paid Ads
- Web Design
- Web Hosting
- AI-Powered Marketing
- Custom CRM & SaaS Development

### Brand Voice
Professional, results-focused, Florida-based, forward-thinking with AI. Warm and approachable — not corporate, not overly playful. Uses "we" language. Avoids jargon. Always backs claims with stats when possible.

---

## 2. BRAND IDENTITY

### About Sean Rowe
Sean Rowe is the founder and owner of Webink Solutions. His background as a firefighter/paramedic before building the agency is a core part of the brand story — it humanizes the brand. Reference this origin story on the About page.

### NAP (Critical for Local SEO)
```
Name:    Webink Solutions
Address: 1609 Georgetowne Blvd, Sarasota, FL 34232
Phone:   (941) 840-1381
Email:   hello@webink.solutions
```
NAP must be consistent everywhere it appears. Do not invent or vary address formats.

### Key Taglines / Phrases
- "Rethink Design"
- "Sarasota's Premiere Digital Agency"
- "We Drive Growth Through Structure & Process"
- "Digital Marketing for the Digital Age"

---

## 3. COLOR SYSTEM ⚠️ CRITICAL

### Primary Backgrounds
These are the ONLY acceptable backgrounds for full sections:

| Name | Hex | When to Use |
|------|-----|-------------|
| White | `#FFFFFF` | Primary light background |
| Off-White / Light Gray | `#F8F8F8` | Secondary light BG, cards, alternating sections |
| Near-Black | `#0F0F0F` | Dark sections, hero, footer, CTA blocks |
| Ink Black | `#0A0A0A` | Deep dark BG for depth layering under `#0F0F0F` |

### Accent Colors — USE AS ACCENTS ONLY
Accent colors must NEVER be used as full section backgrounds.

| Name | Hex | Role |
|------|-----|------|
| **Neon Cyan** | `#14EAEA` | Primary accent — borders, glows, underlines, icon circles |
| **Neon Pink** | `#F813BE` | Secondary accent — CTAs, badges, highlights |
| **Electric Lime** | `#B9FF33` | Tertiary — use sparingly, 1-3 moments per page max |

### Balance Rules
- **Cyan and pink** should appear roughly equally across all sections of a page
- **Lime** gets maximum 1-3 accent moments per page (e.g., one highlighted word, one gradient)
- **NEVER** use `#14EAEA`, `#F813BE`, or `#B9FF33` as a full section background
- A thin cyan border on a card = ✅ accent. A section with cyan fill = ❌ WRONG

### Text Color Rules
| Background | Text Color |
|-----------|-----------|
| White / Off-White sections | `#1A1A1A` (dark) |
| Dark sections (`#0F0F0F` / `#0A0A0A`) | `#FFFFFF` (white) |
| On cyan accent elements | `#0A0A0A` (very dark) |
| On pink accent elements | `#FFFFFF` (white) |

⚠️ **NEVER** place dark text on a bright neon background. It fails contrast AND looks bad.

### Gradients
```css
/* Hero image overlay */
--gradient-hero: radial-gradient(circle at bottom, #B9FF33 0%, #14EAEA 76%);

/* Dark section depth */
--gradient-dark-wash: linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%);

/* CTA button fill */
--gradient-cta: linear-gradient(90deg, #F813BE 0%, #14EAEA 100%);
```

### CSS Variables (already in `globals.css`)
```css
:root {
  --color-black: #000000;
  --color-ink: #0A0A0A;
  --color-near-black: #0F0F0F;
  --color-white: #FFFFFF;
  --color-off-white: #F8F8F8;
  --color-cyan: #14EAEA;
  --color-pink: #F813BE;
  --color-lime: #B9FF33;
  --color-carbon: #333333;
  --color-gray-light: #E5E5E5;
}
```

### Custom Scrollbar (in `globals.css`)
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #ffffff; }
::-webkit-scrollbar-thumb { background: #14EAEA; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #F813BE; }
```

---

## 4. TYPOGRAPHY

### Primary Font: Urbanist
Import Urbanist from Google Fonts in `layout.tsx`. Weights: **100, 300, 400, 600, 700, 800, 900**.

```tsx
// In layout.tsx
import { Urbanist } from 'next/font/google'
const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['100', '300', '400', '600', '700', '800', '900'],
  variable: '--font-urbanist',
})
```

Apply via: `<body className={`${urbanist.variable} font-sans`}>`

Add to `tailwind.config.ts`:
```ts
fontFamily: {
  sans: ['var(--font-urbanist)', 'system-ui', 'sans-serif'],
}
```

### Type Scale & Usage

| Element | Weight | Size (desktop) | Notes |
|---------|--------|----------------|-------|
| Hero headline | 100–300 | 80–120px (clamp) | Thin = dramatic impact |
| H2 section headings | 700 | 40–56px | Bold, anchoring |
| H3 subheadings | 600 | 24–32px | Semi-bold |
| Body copy | 400 | 16–17px | Line-height: 1.6 |
| Eyebrow / label text | 700 | 12–13px | ALL CAPS, letter-spacing: 3px |
| CTA buttons | 600 | 15–16px | |
| Captions | 400 italic | 14px | |

### Eyebrow Text Pattern (use on every section)
```tsx
<p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4">
  Our Services
</p>
```
Alternate between cyan and pink for eyebrow labels across different sections.

### Responsive Type (use clamp)
```css
.hero-headline { font-size: clamp(3rem, 8vw, 7.5rem); }
.section-heading { font-size: clamp(2rem, 4vw, 3.5rem); }
.body-copy { font-size: clamp(1rem, 1.1vw, 1.0625rem); }
```

---

## 5. ANIMATION SYSTEM ⚠️ CRITICAL

### Framer Motion — Import Pattern
```tsx
'use client'
import { motion } from 'framer-motion'
```

---

### Pattern 1: Scale-Grow on Scroll (Salient-style)
**Use this on ALL images. No exceptions.**

```tsx
<motion.div
  initial={{ scale: 0.92, opacity: 0, y: 20 }}
  whileInView={{ scale: 1, opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
  viewport={{ once: true, margin: "-80px" }}
  className="overflow-hidden rounded-2xl"
>
  <Image ... className="w-full h-full object-cover" />
</motion.div>
```

**Note:** The `overflow-hidden` on the wrapper is mandatory — it clips the image during the scale so it doesn't bleed outside its container.

---

### Pattern 2: Stagger Children on Scroll
Use for service cards, feature lists, team grids — any repeated set of elements.

```tsx
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Usage:
<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      {/* card content */}
    </motion.div>
  ))}
</motion.div>
```

---

### Pattern 3: Hero Entrance (Sequential Load)
Elements on the hero load in sequence — staggered delays, not simultaneous.

| Element | Delay | Duration | Notes |
|---------|-------|----------|-------|
| Eyebrow label | 0s | 0.6s | Fade up |
| Main headline | 0s | 1.0s | Fade up |
| Subtext | 0.2s | 0.8s | Fade up |
| CTA buttons | 0.4s | 0.6s | Fade up |
| Featured image | 0.3s | 1.2s | scale 0.9→1, rotate -2°→0°, x 60→0 |

```tsx
// Hero image entrance
<motion.div
  initial={{ scale: 0.9, rotate: -2, x: 60, opacity: 0 }}
  animate={{ scale: 1, rotate: 0, x: 0, opacity: 1 }}
  transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
>
```

---

### Pattern 4: GSAP Horizontal Scroll
Use for portfolio showcase or horizontal feature strips.

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// In useEffect:
const totalWidth = container.scrollWidth - container.offsetWidth
ScrollTrigger.create({
  trigger: container,
  pin: true,
  scrub: 1,
  end: () => `+=${totalWidth}`
})
```

Always clean up in the useEffect return:
```js
return () => ScrollTrigger.getAll().forEach(t => t.kill())
```

---

### Pattern 5: Lenis Smooth Scroll
**Already configured in `layout.tsx` as LenisProvider. DO NOT remove or modify.**

If you need to access Lenis inside a component:
```tsx
import { useLenis } from 'lenis/react'
const lenis = useLenis()
```

---

### Pattern 6: Highlighter Text Effect
Used for accenting a word or phrase in a heading with a sliding underline.

```css
/* In globals.css */
@keyframes highlight {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.animate-highlight {
  position: relative;
  display: inline-block;
}

.animate-highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background: #14EAEA;
  transform: scaleX(0);
  transform-origin: left;
  animation: highlight 0.6s ease-out 0.5s forwards;
}
```

Usage: `<span className="animate-highlight">key phrase</span>`

---

### Pattern 7: Fade-Up (General Purpose)
Simple scroll entrance for text blocks.

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
  viewport={{ once: true, margin: "-60px" }}
>
```

---

### Animation Easing Reference
Always use this cubic bezier for premium feel: `[0.25, 0.46, 0.45, 0.94]`

This mimics `easeOutQuart` — fast in, gently decelerates.

---

## 6. COMPONENT PATTERNS

### Navigation
- **Position:** Fixed, full width, `z-50`
- **State 1 (top — scrollY < 80):** Transparent background + white text (sits over dark hero)
- **State 2 (scrolled — scrollY ≥ 80):** `backdrop-blur-xl bg-white/90` + dark text (`#1A1A1A`)
- **Logo:** Minimum `h-12`. White version on transparent state, dark version on scrolled state.
- **CTA in nav:** "Get a Quote" button, pink filled, always visible
- **Mobile:** Off-canvas slide-out menu (right side), smooth slide transition

```tsx
const [scrolled, setScrolled] = useState(false)
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY >= 80)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

---

### Hero Section
- **Background:** Full-bleed photo (Baja beach photo from `public/images/photos/`)
- **Overlay:** `rgba(0,0,0,0.55)` — dark enough for white text contrast
- **Layout:** Text LEFT aligned, large featured image (device mockup or client work) RIGHT
- **Sub-hero strip:** Dark info bar at the bottom of the hero (stats, trust badges, or phone number)
- **Scroll indicator:** Thin white circle at bottom-center with a chevron-down icon, subtle bounce animation

```tsx
{/* Hero overlay */}
<div className="absolute inset-0 bg-black/55" />

{/* Scroll indicator */}
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
  <div className="w-10 h-10 rounded-full border border-white/60 flex items-center justify-center animate-bounce">
    <ChevronDown className="w-4 h-4 text-white/80" />
  </div>
</div>
```

---

### Section Structure (Every Section)
Every content section follows this structure:
1. **Eyebrow text** — ALL CAPS, tracked, colored (cyan or pink)
2. **H2 heading** — Bold, large
3. **Body text** — 400 weight, 16-17px, line-height 1.6
4. **CTA or supporting element**

```tsx
<section className="px-6 md:px-16 lg:px-24 py-20 lg:py-32">
  <div className="max-w-7xl mx-auto">
    <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4">
      Section Label
    </p>
    <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
      Main Heading
    </h2>
    <p className="text-[17px] leading-relaxed text-[#333333] max-w-2xl">
      Body copy here.
    </p>
  </div>
</section>
```

**Padding rule:** `px-6 md:px-16 lg:px-24 py-20 lg:py-32`  
**Max content width:** `max-w-7xl mx-auto`

---

### Service Cards
```tsx
<div className="bg-white border border-[#E5E5E5] rounded-2xl p-8
  hover:border-[#14EAEA] hover:shadow-[0_8px_40px_rgba(20,234,234,0.15)]
  transition-all duration-300 cursor-pointer">
  {/* Icon circle — 40px, cycles through brand colors */}
  <div className="w-10 h-10 rounded-full bg-[#14EAEA] flex items-center justify-center mb-6">
    <ServiceIcon className="w-5 h-5 text-[#0A0A0A]" />
  </div>
  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Service Name</h3>
  <p className="text-[16px] leading-relaxed text-[#333333]">Brief description.</p>
</div>
```

**Icon circle color cycle:** Cyan → Pink → Lime → Cyan → Pink → Lime (repeating per card)

Always wrap service card grids in the stagger animation pattern (Pattern 2 above).

---

### Image Rules
Apply these classes to **every** image on the site:

```tsx
{/* Wrapper */}
<motion.div
  initial={{ scale: 0.92, opacity: 0, y: 20 }}
  whileInView={{ scale: 1, opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
  viewport={{ once: true, margin: "-80px" }}
  className="overflow-hidden rounded-2xl shadow-xl"
>
  <Image
    src="/images/photos/example.jpg"
    alt="Descriptive alt text with relevant keywords"
    className="w-full h-full object-cover"
  />
</motion.div>
```

**Checklist for every image:**
- [ ] `rounded-2xl` minimum (can be `rounded-3xl` for featured images)
- [ ] `shadow-xl` on the wrapper
- [ ] `object-cover` on the `<Image>` tag
- [ ] `overflow-hidden` on the wrapper (required for scale animations)
- [ ] Alt text describing the image + including relevant keywords
- [ ] Wrapped in scale-grow Framer Motion (Pattern 1)

---

### Buttons

```tsx
{/* Primary — Pink filled */}
<button className="bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full
  hover:bg-[#d10fa3] transition-colors duration-200">
  Get a Quote
</button>

{/* Secondary — Ghost / outline */}
<button className="border border-white text-white font-semibold px-8 py-4 rounded-full
  hover:bg-white hover:text-[#0A0A0A] transition-colors duration-200">
  See Our Work
</button>

{/* Dark section CTA — Cyan outlined */}
<button className="border border-[#14EAEA] text-[#14EAEA] font-semibold px-8 py-4 rounded-full
  hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-colors duration-200">
  Learn More
</button>
```

---

### Scrolling Text Marquee
```tsx
{/* Two rows, opposite scroll directions */}
<div className="overflow-hidden py-8 bg-[#0F0F0F]">
  <div className="animate-marquee-left whitespace-nowrap text-6xl font-bold text-outline-white">
    Web Design • SEO • Social Media • PPC • Branding • AI Marketing •&nbsp;
  </div>
  <div className="animate-marquee-right whitespace-nowrap text-6xl font-bold text-outline-white mt-2">
    • Web Hosting • CRM • SaaS • Digital Growth • Strategy • Content •&nbsp;
  </div>
</div>
```

Outline text in CSS:
```css
.text-outline-white {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
  color: transparent;
}
```

---

## 7. INSTALLED LIBRARIES

| Package | Purpose | Import From |
|---------|---------|-------------|
| `framer-motion` | Scroll animations, entrance effects, parallax | `framer-motion` |
| `gsap` | Horizontal scroll sections, pinned sections | `gsap` |
| `gsap/ScrollTrigger` | ScrollTrigger plugin for GSAP | `gsap/ScrollTrigger` |
| `lenis` | Smooth scroll — **do not remove from layout.tsx** | `lenis/react` |
| `animejs` | SVG path animations, staggered text effects | `animejs` |
| `flickity` | Carousels and sliders (blog preview, portfolio) | `flickity` |
| `imagesloaded` | Fire callbacks after images load (use before Flickity init) | `imagesloaded` |
| `fitty` | Auto-scale oversized headlines to fit container | `fitty` |
| `lucide-react` | Icons — use consistently throughout | `lucide-react` |
| `tailwindcss` | Utility-first CSS framework | (config only) |

### GSAP SSR Warning
Always register GSAP plugins inside `useEffect`:
```tsx
useEffect(() => {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
}, [])
```

### Flickity SSR Warning
Flickity requires browser globals. Use dynamic import:
```tsx
const Flickity = dynamic(() => import('flickity'), { ssr: false })
```

---

## 8. FILE STRUCTURE

```
webink-dev/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout. DO NOT remove LenisProvider or Urbanist font.
│   │   ├── globals.css         ← Global styles, CSS variables, scrollbar, animations
│   │   ├── page.tsx            ← Homepage
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx        ← Services index
│   │   │   ├── web-design/page.tsx
│   │   │   ├── seo/page.tsx
│   │   │   ├── ppc/page.tsx
│   │   │   ├── social-media/page.tsx
│   │   │   └── web-hosting/page.tsx
│   │   ├── blog/
│   │   │   └── page.tsx
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   └── components/
│       ├── nav/                ← Navigation components
│       ├── hero/               ← Hero section components
│       ├── sections/           ← Page section components
│       ├── cards/              ← Card components (service, blog, portfolio)
│       ├── ui/                 ← Reusable UI primitives (Button, Badge, etc.)
│       └── layout/             ← Layout wrappers (Footer, etc.)
├── public/
│   └── images/
│       ├── photos/             ← Real photography (Baja beach, team, Sarasota, clients)
│       └── ai/                 ← AI-generated images
├── tailwind.config.ts
└── CLAUDE.md                   ← This file
```

---

## 9. CONTENT GUIDELINES

### Owner Name
- ✅ CORRECT: **Sean Rowe**
- ❌ NEVER: "Sean Brennan", "Sean Brown", or any other name
- The founder story (firefighter/paramedic turned agency owner) is a key brand differentiator — reference it on the About page

### Services & Pricing
Source of truth is `WEBINK-PRODUCTS.md`. Key rules:

- All prices shown as **per month** (`/mo`), not annual totals shown as monthly
- Subscriptions are month-to-month unless noted as annual
- "Contact for Pricing" for: Paid Advertising (PPC), custom packages
- Do not invent pricing tiers or services that aren't in the product list

**Quick Pricing Reference:**
| Service | Starting Price |
|---------|---------------|
| Managed Web Hosting | $31/mo |
| Fully Managed SEO | $1,103/mo |
| Local SEO | $1,103/mo |
| Social Media Marketing | $493/mo |
| Short Form Video Marketing | $160/mo |
| Google Local Service Ads | $250/mo |
| Google Business Profile Optimization | $200 (one-time) |
| SEO Primer | $553 (one-time, sale from $653) |
| RapidSSL Certificate | $25/year |
| InkTree Page | $5/mo |
| Paid Advertising (PPC) | Contact for pricing |

### No Fabrication Policy
- Do NOT invent bios, credentials, awards, or certifications
- Do NOT invent client testimonials — only use real ones from the site audit
- Portfolio must only show REAL client work (Gulf Sands Realty, Nathan Benderson Park, etc.)
- Stats like "50+ clients served" or "300% average traffic increase" must be verified with Sean before publishing

### Geography
- Primary market: **Sarasota, FL**
- Secondary market: **Tampa, FL** and **Bradenton, FL**
- NAP must remain consistent (see Section 2 above)

---

## 10. QUALITY STANDARDS

### Build Requirements
- `next build` must pass with **zero TypeScript errors**
- No `any` types without explicit justification in a comment
- No unused imports
- Run `npm run lint` before committing

### Responsive Design
- **Mobile-first** — write mobile styles first, scale up with `md:` and `lg:` prefixes
- Test every component at **390px** (iPhone 15 Pro width) minimum
- Typography: use `clamp()` for fluid scaling, avoid fixed px at hero scale
- No horizontal scroll on mobile (unless intentional carousel)

### Accessibility
- Every `<Image>` must have a meaningful `alt` attribute with relevant keywords
- Text contrast must meet **WCAG AA** minimum (4.5:1 for body, 3:1 for large text)
- Interactive elements must have focus states
- Test with keyboard navigation

### Image Rules
- No photo appears more than once on the same page
- Real photos go in `public/images/photos/`
- AI-generated images go in `public/images/ai/`
- Always use `next/image` (not `<img>`) for optimization and LCP performance
- Add `priority` prop to above-the-fold images (hero)

### Performance
- Aim for Lighthouse score 90+ on all metrics
- Use `next/image` with blur placeholder for all images
- Lazy-load Flickity and GSAP (dynamic import)
- Keep animation bundle weight in check — don't import GSAP if Framer Motion covers it

### Commit Standards
- Do not commit commented-out code blocks
- Do not commit `console.log` statements
- Each commit should pass `next build` — no broken builds

---

## 11. HOMEPAGE SECTION PLAN (Reference)

The homepage follows this section order:

1. **Hero** — Full-bleed dark, background image + overlay, headline, CTA, device mockup
2. **Services Grid** — "What We Do" — 6 cards, stagger animation, light background
3. **About / Why Webink** — 50/50 split, process steps, Sean's story intro
4. **Stats / Social Proof** — Dark section, large numbers, testimonial quote
5. **Portfolio Preview** — "Recent Work" — 3 featured projects
6. **Scrolling Marquee** — Full-bleed dark, bidirectional kinetic text
7. **Blog Preview** — "InkBlog" — 3 recent posts
8. **Newsletter CTA** — Dark section, email signup
9. **Footer** — Dark, logo, nav links, contact, social, legal

---

## 12. DO NOT LIST

- ❌ Do not remove LenisProvider from `layout.tsx`
- ❌ Do not remove Urbanist font import from `layout.tsx`
- ❌ Do not use neon colors (`#14EAEA`, `#F813BE`, `#B9FF33`) as full section backgrounds
- ❌ Do not add `<img>` tags — always use `next/image`
- ❌ Do not commit code with TypeScript errors
- ❌ Do not use the name "Sean Brennan" anywhere
- ❌ Do not fabricate testimonials, credentials, or stats
- ❌ Do not show annual prices as monthly
- ❌ Do not place dark text on bright neon backgrounds
- ❌ Do not use the same photo more than once per page
- ❌ Do not remove `overflow-hidden` from image wrappers (breaks scale animations)
- ❌ Do not use any other font — Urbanist only

---

*Last updated: March 2026 by Octo 🐙*

---

## 13. Phase 2 � Ecommerce & Backend Build Spec

### Overview
Build a full ecommerce system on top of the existing Next.js site. The WordPress/WooCommerce database has been exported and is available at C:\OpenClaw\workspace-webink\webinkso_wp552.sql for reference.

### Products to Build
All products from WEBINK-PRODUCTS.md must be implemented as purchasable items:
- Managed Web Hosting (variable subscription: 8 monthly tiers + annual billing)
- Fully Managed SEO (Basic/Pro/Ultimate monthly subscriptions)
- Social Media Marketing (9 tiers, monthly)
- Local SEO (Basic/Pro/Ultimate monthly)
- Google Business Profile Optimization (one-time)
- Google LSA Management (monthly subscription)
- Paid Advertising/PPC (custom quote flow)
- Add-On Hosting Site (monthly addon)

### Stripe Integration
- Use Stripe Checkout for all purchases
- Use Stripe Billing for recurring subscriptions (monthly + annual)
- Implement Stripe Customer Portal for subscription management
- Webhooks: handle subscription.created, subscription.updated, subscription.deleted, payment_succeeded, payment_failed
- Store Stripe customer_id + subscription_id in user records
- DO NOT expose raw Stripe API keys client-side � server-side only

### QuickBooks Integration � CRITICAL NOTES
- The old WordPress site had a QBO sync plugin (mw_wc_qbo_sync) that caused DUPLICATE ENTRIES in QuickBooks due to Stripe fees creating separate line items
- **DO NOT** sync Stripe fee transactions directly to QuickBooks
- Sync only the WooCommerce/order total (what the customer paid) to QBO
- Stripe processing fees should be handled as a bank reconciliation item, NOT as per-order line items
- This is a hard requirement from the business owner to prevent accounting chaos

### User Accounts
- Next-Auth or custom JWT authentication
- User dashboard: active subscriptions, billing history, account settings
- Password reset, email verification
- Admin can manage all users and their subscriptions

### Admin Backend (CMS + Product Management)
- Product editor: name, description, pricing tiers, billing intervals
- Order management dashboard
- Customer list with subscription status
- Ability to pause/cancel/modify subscriptions
- Site content management: edit page text, hero images, testimonials without code changes

### Database
- Use Prisma ORM with MySQL (consistent with VoltDesk pattern)
- Reference the exported SQL for existing customer/order data migration path
- Do NOT import raw WordPress data � use it as reference only for data structure


# SALIENT-ANIMATION-BRIEF.md
# Complete Design Brief for Claude Code — Salient-Style Animations on dev.webink.solutions

> **Purpose:** This document is the single source of truth for implementing premium Salient-style animations on the Webink Solutions homepage. Read this fully before making any changes.
> 
> **Date:** March 31, 2026  
> **Current Commit:** 2541dcc5d92114b192f9d8b9c761e58150963384  
> **Branch:** master  
> **Live URL:** https://dev.webink.solutions  

---

## 1. Salient Theme Analysis

The Salient WordPress theme (by ThemeNectar) is known for its premium scroll-triggered animations. Here is the animation system it uses and the specific effects we want to replicate.

### 1.1 Animation Libraries Salient Uses

| Library | Role in Salient |
|---------|----------------|
| **Anime.js** | Primary animation engine for entrance effects, SVG paths, staggered reveals |
| **GSAP + ScrollTrigger** | Horizontal scroll sections, pinned panels, parallax layers |
| **CSS Keyframes** | Marquee text, loading spinners, subtle hover states |
| **Custom JS** | IntersectionObserver-based reveal system, parallax calculations |

**What we already have installed (package.json):**
- `framer-motion` ^11.18.2 — currently used for most entrance animations
- `gsap` ^3.14.2 — used for horizontal scroll process section
- `animejs` ^4.3.6 — installed but NOT currently used in any component
- `lenis` ^1.3.20 — smooth scroll provider (active in layout.tsx)
- `@studio-freight/lenis` ^1.0.42 — legacy Lenis (redundant, can be removed)

### 1.2 Key Entrance Animation Types (What Salient Does)

| Effect Name | Description | Salient Implementation |
|-------------|-------------|----------------------|
| **fade-from-bottom** | Element fades in while sliding up 40-80px | Most common — used on text blocks, cards |
| **grow-in** | Element scales from 0.85→1.0 with opacity 0→1 | Used on images, featured blocks |
| **reveal-from-left** | Element slides in from -60px on X axis with fade | Used on section headings, eyebrow labels |
| **reveal-from-right** | Mirror of reveal-from-left | Alternating sections |
| **flip-in-vertical** | Slight rotateX(-8° to 0°) with Y translation | Cards, pricing tables |
| **scale-rotate-in** | Combines scale(0.75→1) + rotate(-5°→0°) | Featured images, founder photo |
| **stagger-children** | Parent triggers children sequentially with 100-150ms delays | Card grids, process steps, stat counters |
| **parallax-layer** | Background moves at different speed than foreground | Hero background, about section image |

### 1.3 Timing Functions That Make It Feel Premium

| Curve Name | CSS cubic-bezier | When Salient Uses It |
|------------|-----------------|---------------------|
| **Salient Default** | `cubic-bezier(0.2, 0.65, 0.3, 1)` | Most scroll-triggered entrances |
| **Salient Overshoot** | `cubic-bezier(0.2, 1, 0.2, 1)` | Card flip-ins, bouncy elements |
| **Salient Elastic** | `cubic-bezier(0.15, 0.84, 0.35, 1.15)` | Floating stat cards, badges, tooltips |
| **easeOutQuart** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Hero entrance sequence, image reveals |

**Duration Guidelines:**
| Element Type | Duration | Notes |
|-------------|----------|-------|
| Text blocks (headings, paragraphs) | 0.7-1.0s | Longer = more premium feel |
| Cards / repeated items | 0.8-0.95s | With stagger delay of 0.1-0.15s per item |
| Images / large blocks | 1.0-1.2s | Slow, cinematic reveal |
| Small UI elements (badges, lines) | 0.5-0.7s | Snappy, responsive |
| Hero entrance sequence | 0.6-1.2s per element | Staggered 0.15-0.2s apart |

### 1.4 Specific Salient Effects Identified

1. **Parallax Layers:** Hero background image translates Y at 40% of scroll speed, creating depth
2. **Staggered Card Reveals:** Cards in a grid appear one-by-one, left-to-right then top-to-bottom (row-first stagger)
3. **Counter Animation:** Stats count up from 0 to target value with easeOutCubic, triggered by IntersectionObserver
4. **Image Reveal with Rotation:** Images rotate from -3deg to 0deg while scaling from 0.85 to 1.0 — creates a "card being placed on table" effect
5. **Horizontal Scroll Pinning:** Process/portfolio sections pin to viewport while content scrolls horizontally
6. **Text Highlight Sweep:** Underline/highlight bar sweeps from left to right under key phrases
7. **Floating Elements:** Small stat cards or badges float in with an elastic overshoot curve
8. **Marquee Text:** Continuous horizontal scroll of service keywords, GPU-accelerated

---

## 2. What Has Been Implemented (Current State)

### 2.1 Files Created/Modified

All homepage sections live in `/src/components/variant-i/`:

| File | Animations Added | Status |
|------|-----------------|--------|
| **HeroI.tsx** | Parallax background (Framer Motion useScroll/useTransform), sequential text entrance (initial/animate with staggered delays), card fan animation (3 cards fan in then tuck behind photo), logo overlay grow-in | Coded, animations defined |
| **ServicesI.tsx** | Service card stagger (flip-in-vertical with row/col delay calc), section heading reveal-from-bottom with rotation, eyebrow fade-from-left, GSAP horizontal scroll process section | Coded, GSAP imported dynamically |
| **MarqueeI.tsx** | CSS keyframe marquee-left animation, duplicated content for seamless loop | Coded, uses CSS animation |
| **AboutI.tsx** | Parallax image (useScroll/useTransform), image reveal-from-left with rotation, floating stat card with elastic overshoot, text fade-from-right | Coded |
| **FounderI.tsx** | Founder photo scale-rotate-in (0.75→1, -5°→0°), bio text fade-from-right | Coded |
| **LocalI.tsx** | Text reveal-from-left, image reveal-from-right with rotation | Coded |
| **StatsI.tsx** | Counter animation (IntersectionObserver + requestAnimationFrame), card stagger entrance | Coded |
| **TestimonialsI.tsx** | 3D flip cards (hover to reveal full review), stagger entrance, team photo strip with varied reveal directions | Coded |
| **PricingI.tsx** | Card stagger entrance | Coded |
| **CTAI.tsx** | Large grow-in entrance (scale 0.95→1, y 80→0) | Coded |
| **FooterI.tsx** | (Minimal animation) | Exists |
| **NavI.tsx** | Scroll-based state change (transparent→blurred white) | Exists |
| **LenisProvider.tsx** | Lenis smooth scroll integrated with GSAP ticker, ScrollTrigger sync | Active in layout.tsx |

### 2.2 Animation Library Usage

| Library | Where Used | How |
|---------|-----------|-----|
| **Framer Motion** | All entrance animations across all components | `motion.div` with `initial`, `whileInView`, `animate` props |
| **GSAP + ScrollTrigger** | ServicesI.tsx HorizontalProcess section | Dynamic import, pinned horizontal scroll |
| **Lenis** | layout.tsx via LenisProvider.tsx | Smooth scroll with GSAP ticker sync |
| **anime.js** | NOT USED despite being installed | Available for SVG/text effects if needed |
| **CSS Keyframes** | MarqueeI.tsx marquee, HeroI.tsx highlight sweep | In globals.css |

### 2.3 Framer Motion Animation Approach (Current Pattern)

Every section component uses this pattern:
```tsx
<motion.div
  initial={{ opacity: 0, y: 60, rotate: 2 }}
  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
  viewport={{ once: true, margin: '-60px' }}
  transition={{ duration: 1, ease: [0.2, 0.65, 0.3, 1] }}
>
```

**Key props used:**
- `initial` — starting state (invisible, offset)
- `whileInView` — target state when element enters viewport
- `animate` — for hero elements that animate on mount (not scroll-triggered)
- `viewport={{ once: true, margin: '-60px' }}` — fire once, trigger 60px before element enters
- `transition.ease` — cubic-bezier arrays for premium curves
- `useScroll` + `useTransform` — for parallax effects tied to scroll position

---

## 3. Known Issues to Fix

### 3.1 CRITICAL: Hero Height is Too Tall
**Problem:** The hero section uses `min-h-screen` which makes it take the full viewport height. Sean says it reverted to the old full-height WordPress style and should be shorter.

**Current code (HeroI.tsx line ~31):**
```tsx
className="relative min-h-screen overflow-hidden bg-[#0F0F0F]"
```

**Fix needed:** Change `min-h-screen` to a fixed max height or a shorter viewport unit:
```tsx
// Option A: Fixed height
className="relative h-[85vh] max-h-[900px] overflow-hidden bg-[#0F0F0F]"

// Option B: Shorter viewport
className="relative min-h-[75vh] overflow-hidden bg-[#0F0F0F]"
```

Also adjust the inner flex container which has `min-h-screen`:
```tsx
// Current (line ~59):
className="relative z-30 min-h-screen flex flex-col justify-center ..."

// Fix:
className="relative z-30 h-full flex flex-col justify-center ..."
```

**Also check:** The sub-hero info strip is positioned `absolute bottom-0` — if the hero shrinks, verify it still sits correctly.

### 3.2 CRITICAL: Scrolling is Jittery/Janky

**Symptoms reported:**
- Card flicker during scroll
- Marquee stuttering
- General jankiness

**Root causes (in order of likelihood):**

1. **Lenis + GSAP ScrollTrigger conflict:** The LenisProvider.tsx syncs Lenis with GSAP's ticker, but the horizontal scroll section in ServicesI.tsx creates its own ScrollTrigger instances. When the pinned section unpins, it can cause layout recalculations that jitter.

   **Fix:** In LenisProvider.tsx, add `lerp: 0.1` to Lenis config for smoother interpolation. In ServicesI.tsx, ensure `anticipatePin: 1` and `pinSpacing: true` are set (already present). Consider adding `fastScrollEnd: true` to ScrollTrigger config.

2. **Too many `willChange: 'transform'` declarations:** Multiple components set `willChange` which creates GPU layers. Having too many composited layers causes frame drops.

   **Fix:** Remove `willChange` from elements that don't need it. Only keep it on elements that are actively animating (parallax backgrounds, the horizontal scroll track).

3. **Marquee using `will-change: transform` + `backface-visibility: hidden`:** These promote to GPU but the duplicate content approach means 60+ spans are being composited.

   **Fix:** Use `contain: layout style paint` on the marquee section (already present) and consider using a single `transform: translateX()` animation on one container instead of duplicating content.

4. **Framer Motion `whileInView` on many elements simultaneously:** If multiple elements enter the viewport at once, Framer Motion fires multiple animations simultaneously which can cause frame drops.

   **Fix:** Increase `viewport.margin` to `'-100px'` so animations trigger earlier (before the user sees them), and ensure `once: true` is set everywhere (it is).

### 3.3 CRITICAL: User Can't See Any Animations

**Possible causes:**

1. **Build cache:** The deployed container may be serving a cached build that predates the animation code. This is the MOST LIKELY cause.

2. **SSR hydration mismatch:** If Framer Motion's `initial` state doesn't match the server render, the component may flash or appear static.

3. **Viewport margin too aggressive:** If `margin: '-80px'` means the trigger point is below the fold, animations may have already fired during hydration.

4. **`once: true` already fired:** If the page loaded with elements in view, animations fire immediately during hydration and appear "already done."

**Diagnostic steps:**
```bash
# Check the live container's commit
docker exec webink-dev sh -c "cd /opt/webink-dev && git log --oneline -1"

# Force rebuild
cd /opt/webink-dev && docker-compose down && docker-compose up -d --build

# Watch build logs
docker logs -f webink-dev
```

### 3.4 CMS Editing Status

The inline CMS editor is integrated with all variant-i components via `data-page` and `data-block` attributes. Recent commits fixed text duplication, image save bugs, and z-index conflicts.

**CMS should be working** based on fix history, but needs verification after animation changes. Do NOT remove any `data-page` or `data-block` attributes.

---

## 4. Technical Context

### 4.1 Infrastructure

| Item | Value |
|------|-------|
| VPS IP | 31.97.11.49 |
| SSH Port | 2222 |
| SSH Key | `C:/Users/OpenClaw/.ssh/id_ed25519_agent` |
| SSH Command | `ssh -p 2222 -i C:/Users/OpenClaw/.ssh/id_ed25519_agent root@31.97.11.49` |
| Code Location | `/opt/webink-dev/` |
| Docker Container | `webink-dev` (port 3001) |
| DB Container | `webink-mysql` (port 3306) |
| GitHub Repo | `https://github.com/webinksupport/webink-dev` |
| Branch | `master` |
| Current Commit | `2541dcc5d92114b192f9d8b9c761e58150963384` |
| Live URL | `https://dev.webink.solutions` |
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |

### 4.2 Key File Locations

```
/opt/webink-dev/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Homepage (assembles all variant-i components)
│   │   ├── layout.tsx                  ← Root layout (LenisProvider, Urbanist font)
│   │   └── globals.css                 ← Global styles, marquee keyframes, scrollbar
│   └── components/
│       ├── variant-i/
│       │   ├── NavI.tsx                ← Navigation (transparent→blur on scroll)
│       │   ├── HeroI.tsx               ← Hero (parallax, card fan, sequential entrance)
│       │   ├── MarqueeI.tsx            ← Service keyword marquee
│       │   ├── ServicesI.tsx           ← Service cards + GSAP horizontal process
│       │   ├── AboutI.tsx              ← About section (parallax image, floating card)
│       │   ├── FounderI.tsx            ← Sean Rowe bio (scale-rotate headshot)
│       │   ├── LocalI.tsx              ← Local presence section
│       │   ├── StatsI.tsx              ← Counter stats (IntersectionObserver)
│       │   ├── TestimonialsI.tsx        ← 3D flip cards
│       │   ├── PricingI.tsx            ← Pricing table
│       │   ├── CTAI.tsx                ← Final CTA section
│       │   └── FooterI.tsx             ← Footer
│       ├── editor/
│       │   ├── EditorContext.tsx        ← CMS edit mode context
│       │   └── PageEditorWrapper.tsx    ← CMS wrapper component
│       └── LenisProvider.tsx           ← Smooth scroll + GSAP sync
├── CLAUDE.md                           ← Full design system spec
├── package.json                        ← Dependencies
└── docs/
    └── SALIENT-ANIMATION-BRIEF.md     ← THIS FILE
```

### 4.3 Deploy Process

Read CLAUDE.md "DEPLOY WORKFLOW" section before deploying. Quick reference:

```bash
# From local workspace:
cd C:\OpenClaw\workspace-webink\webink-dev
git add -A && git commit -m "description" && git push origin master
node deploy.js

# OR from VPS directly (for quick iteration):
cd /opt/webink-dev
git pull origin master
docker-compose down && docker-compose up -d --build

# Verify:
docker logs webink-dev --tail 20
```

---

## 5. What "Good" Looks Like — The Desired End State

### 5.1 Overall Feel

When a user loads `dev.webink.solutions`, the homepage should feel like a **premium agency site** — think Apple product pages, Stripe.com, or the Salient theme demo. The key feeling is:

- **Effortless motion** — elements glide into view naturally, never jarring
- **Depth and dimension** — parallax creates layers, slight rotations add personality
- **Progressive reveal** — content appears as you scroll, rewarding exploration
- **Buttery smooth scrolling** — Lenis provides inertia/momentum, no native scroll jank
- **Cinematic pacing** — hero loads dramatically, then each scroll-section has its own "moment"

### 5.2 Section-by-Section Animation Spec

#### Hero (HeroI.tsx)
- **On page load (NOT scroll-triggered):**
  1. Background image fades in (0.3s)
  2. Eyebrow text slides in from left with cyan line (0.7s, delay 0.2s)
  3. Headline fades up (0.9s, delay 0.3s) — should feel weighty
  4. Subtext fades up (0.7s, delay 0.55s)
  5. CTA buttons fade up (0.7s, delay 0.7s)
  6. Card fan animation on right side (2.4s, delay 0.3s)
  7. Logo overlay grows in (0.6s, delay 1.8s)
  8. Sub-hero info strip slides up (0.6s, delay 1.1s)
  9. Scroll indicator fades in (delay 1.5s)
- **On scroll (parallax):**
  - Background image translates Y at 40% scroll speed
  - Text content fades out and translates up as user scrolls past hero
- **Height:** Should be `85vh` or `max-h-[900px]`, NOT full `min-h-screen`

#### Marquee (MarqueeI.tsx)
- Continuous horizontal scroll, no jank
- GPU-accelerated CSS transform
- Speed: ~30s per full cycle
- No visible seam where content loops

#### Services Grid (ServicesI.tsx — top half)
- **Eyebrow** slides in from left (0.7s)
- **Heading** reveals from bottom with slight rotation (1s)
- **Subtext** fades up (0.8s, delay 0.15s)
- **Cards** stagger in with flip-in-vertical effect:
  - Each card: opacity 0→1, y 75→0, rotateX -8deg→0deg, scale 0.96→1
  - Stagger: row-first, then column (row * 0.15s + col * 0.1s)
  - Ease: [0.2, 1, 0.2, 1] (Salient overshoot curve)
  - Duration: 0.85s per card

#### Process (ServicesI.tsx — HorizontalProcess)
- GSAP ScrollTrigger pins the section while content scrolls horizontally
- 4 panels with scrub: 0.8
- Should NOT cause page jitter when pinning/unpinning

#### About (AboutI.tsx)
- Image: Parallax, reveals from left with rotation
- Floating stat card: Elastic overshoot entrance, delay 0.5s
- Text: Fades in from right

#### Founder (FounderI.tsx)
- Headshot: Scale-rotate-in from 0.75→1, -5deg→0deg
- Bio text: Fade from right

#### Stats (StatsI.tsx)
- Counter animation: Numbers count up from 0 with easeOutCubic (1.8s)
- Cards: Stagger entrance with overshoot curve

#### Testimonials (TestimonialsI.tsx)
- Cards: Stagger entrance, 3D flip on hover
- Team photos: Varied reveal directions

#### CTA (CTAI.tsx)
- Large grow-in entrance (scale 0.95→1, y 80→0, duration 1.2s)

### 5.3 Smooth Scrolling Requirements

- **Lenis** must remain active (LenisProvider in layout.tsx)
- Lenis config: `duration: 1.2`, `smoothWheel: true`, `syncTouch: false`
- GSAP integration: Lenis scroll events sync to ScrollTrigger.update
- No native scroll behavior — Lenis handles all scroll interpolation

### 5.4 Performance Requirements

- No layout thrashing
- GPU compositing only (transform + opacity)
- Minimal willChange usage
- `viewport={{ once: true }}` on ALL whileInView animations
- Reduced motion support via `prefers-reduced-motion` media query

### 5.5 What to NOT Do

- Do NOT add new animation libraries
- Do NOT remove the GSAP horizontal scroll — just fix jitter
- Do NOT remove LenisProvider
- Do NOT break CMS editability (preserve all data-page and data-block attributes)
- Do NOT use position: sticky for horizontal scroll (GSAP pin is correct)
- Do NOT animate layout-triggering CSS properties (width, height, padding, margin)

---

## 6. Priority Fixes (Ordered)

### P0 — Must Fix First
1. **Hero height** — Change from `min-h-screen` to `h-[85vh] max-h-[900px]`
2. **Verify animations are visible** — Rebuild container if needed
3. **Fix scroll jitter** — Debug Lenis/GSAP conflict, reduce willChange, test horizontal scroll

### P1 — Fix Next
4. **Marquee smoothness** — Ensure no stutter
5. **Card stagger timing** — Verify row-first stagger looks intentional
6. **Counter animation** — Verify stats count up smoothly

### P2 — Polish
7. **Reduced motion support** — Add prefers-reduced-motion fallbacks
8. **Mobile animations** — Verify/simplify for mobile
9. **Performance audit** — Lighthouse check

---

## 7. Testing Checklist

After implementing fixes, verify:

- [ ] Hero loads at ~85vh height, not full screen
- [ ] Hero entrance sequence plays in order (eyebrow → headline → subtext → CTAs → card fan → logo)
- [ ] Scrolling is butter-smooth with no jitter
- [ ] Marquee scrolls continuously without stuttering
- [ ] Service cards stagger in visibly when scrolled to
- [ ] Horizontal process section pins and scrolls smoothly, unpins without jump
- [ ] About section image has visible parallax effect
- [ ] Floating stat card bounces in with overshoot
- [ ] Stats counter animates from 0 to target values
- [ ] Testimonial cards flip on hover
- [ ] CTA section has dramatic grow-in entrance
- [ ] No console errors
- [ ] CMS edit mode still works
- [ ] Mobile: animations work or gracefully degrade
- [ ] Lighthouse Performance score >= 85

---

## 8. Reference: Easing Curves Quick Reference

```tsx
// Salient Default — smooth deceleration
ease: [0.2, 0.65, 0.3, 1]

// Salient Overshoot — slight bounce at end
ease: [0.2, 1, 0.2, 1]

// Salient Elastic — pronounced overshoot
ease: [0.15, 0.84, 0.35, 1.15]

// easeOutQuart — fast start, gentle stop
ease: [0.25, 0.46, 0.45, 0.94]
```

---

*End of brief. This file lives at `/opt/webink-dev/docs/SALIENT-ANIMATION-BRIEF.md`.*

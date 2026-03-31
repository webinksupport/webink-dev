# DEPLOYMENT-ISSUE.md — Salient Animations on dev.webink.solutions

**Date:** 2026-03-31
**Status:** NEEDS FIX — animations not rendering for end users
**Author:** Mason (subagent handoff doc for Claude Code)

---

## 1. Files Modified

All in `/opt/webink-dev/src/`:

### Variant-I Components (homepage sections)
- `components/variant-i/HeroI.tsx` (290 lines) — Hero with parallax + card entrance animations
- `components/variant-i/HeroI.tsx.bak` — Backup of previous version
- `components/variant-i/NavI.tsx` — Fixed nav with scroll-aware styling
- `components/variant-i/MarqueeI.tsx` — Infinite scrolling service ticker
- `components/variant-i/ServicesI.tsx` — Service cards with staggered 3D entrance
- `components/variant-i/AboutI.tsx` — About section with slide-in image + text
- `components/variant-i/FounderI.tsx` — Founder bio with circular portrait scale-in
- `components/variant-i/LocalI.tsx` — Local presence section with parallax image
- `components/variant-i/StatsI.tsx` — Counter stats with scale-up entrance
- `components/variant-i/TestimonialsI.tsx` — Flip-card testimonials with 3D rotateX entrance
- `components/variant-i/PricingI.tsx` — Pricing cards with rotateY tilt entrance
- `components/variant-i/CTAI.tsx` — CTA section with scale-up entrance
- `components/variant-i/FooterI.tsx` — Footer (static, no animations)

### Page & Layout
- `app/page.tsx` — Imports all variant-i components, passes CMS content
- `app/globals.css` — Contains marquee keyframes, Lenis scroll styles
- `components/LenisProvider.tsx` — Smooth scroll wrapper (Lenis)
- `components/editor/PageEditorWrapper.tsx` — CMS inline editing context

### Config
- `package.json` — Added `framer-motion ^11.18.2`, `lenis`
- `tailwind.config.ts` — Custom animations, colors (#14EAEA, #F813BE, #B9FF33)
- `Dockerfile` — Multi-stage build for Next.js
- `docker-compose.yml` — Service definition with Traefik labels
- `.dockerignore` — Optimized for smaller builds

---

## 2. What the Animations Should Do

### HeroI.tsx (Hero Section)
- **Background:** Full-bleed Baja beach image with parallax scroll (`useTransform` on scrollYProgress, bgY 0%->40%)
- **Text container:** Fades out + moves up on scroll (`textOpacity` 1->0, `textY` 0->-60)
- **Eyebrow line:** Slides in from left (`x: -20 -> 0, opacity: 0 -> 1`, delay 0.3s)
- **Headline:** Slides up (`y: 30 -> 0, opacity: 0 -> 1`, delay 0.5s)
- **Subtext:** Slides up (`y: 20 -> 0, opacity: 0 -> 1`, delay 0.7s)
- **CTA buttons:** Slide up (`y: 20 -> 0, opacity: 0 -> 1`, delay 0.9s)
- **Right card stack (desktop):** Three overlapping cards animate in sequence:
  - Cyan accent card: slides from right, fades in/out with rotation
  - Pink accent card: same pattern, slightly delayed
  - Main photo card: slides from right with rotation (`x: 80 -> 0, rotate: -6 -> 0`)
  - Logo overlay: scales up (`scale: 0.8 -> 1.05, opacity: 0 -> 1`)
- **Bottom strip:** Slides up (`y: 20 -> 0, opacity: 0 -> 1`, delay 1.2s)
- **Scroll indicator:** Fades in with bounce animation

### ServicesI.tsx (Service Cards)
- **Eyebrow:** Slides in from left
- **Heading:** Slides up with slight rotation (`y: 60, rotate: 2deg -> 0`)
- **Cards:** Staggered 3D entrance — each card starts `translateY(75px) scale(0.96) rotateX(-8deg)` and animates to rest, with `perspective: 1200px`
- Uses `useInView` with `triggerOnce: true, margin: '-80px'`

### AboutI.tsx
- **Image:** Slides in from left with scale + rotation (`x: -60, scale: 0.85, rotate: -3deg -> 0`)
- **Stat badge:** Pops in with scale + rotation (`y: 30, scale: 0.7, rotate: 6deg -> 0`)
- **Text block:** Slides in from right (`x: 45, y: 20 -> 0`)

### FounderI.tsx
- **Portrait:** Scale + rotation entrance (`scale: 0.75, rotate: -5deg -> 0`)
- **Bio text:** Slides from right (`x: 50, y: 20 -> 0`)

### StatsI.tsx
- **Counter numbers:** Scale up from below (`y: 60, scale: 0.9 -> 0, 1`) with stagger
- Uses `useInView` to trigger counting animation

### TestimonialsI.tsx
- **Cards:** 3D flip cards with rotateX entrance (`y: 75, scale: 0.95, rotateX: -15deg -> 0`)
- **Photo strip:** Three images slide in from different directions (left, bottom, right)

### PricingI.tsx
- **Cards:** rotateY tilt entrance (`rotateY: +/-8deg -> 0`) with stagger

### CTAI.tsx
- **Content block:** Scale up from below (`y: 80, scale: 0.95 -> 0, 1`)

### Horizontal Scroll (ServicesI Process Section)
- 4-panel horizontal scroll section using `useScroll` + `useTransform`
- Panels are 100vw wide, translated horizontally based on scroll progress

---

## 3. What We've Tried

1. **Git committed all changes** — Commit `2541dcc` includes all 267 files (animations + scroll fixes + CMS fixes + password recovery)
2. **Docker rebuild** — `docker compose build --no-cache && docker compose up -d` on the VPS
3. **Container verified running** — `webink-dev` container is Up, created 2026-03-31T13:24:17Z
4. **Traefik routing verified** — Container is on `traefik_default` network, Traefik routes `dev.webink.solutions` -> port 3001
5. **Git push** — Code pushed to `origin/master` on GitHub (webinksupport/webink-dev)
6. **Internal HTML verified** — `wget` from inside container returns full HTML with all variant-i content

---

## 4. What's NOT Working

### The Core Problem: SSR renders `opacity:0` and animations may not fire

When you view `https://dev.webink.solutions/` page source, you see:
- `<section class="jsx-49b68153eb968f6c relative min-h-screen...">` (styled-jsx hash present)
- Elements have inline `style="opacity:0;transform:translateY(30px)"` etc.
- These are framer-motion's `initial` states rendered server-side
- The `motion.div` components become plain `div`s in SSR output (expected)
- Client-side hydration SHOULD animate these to their `animate` values

**Possible failure modes:**
1. **JS hydration error** — If React hydration fails silently, animations never fire and content stays at `opacity:0` (invisible)
2. **styled-jsx conflict** — The `jsx-49b68153eb968f6c` hash on the section suggests styled-jsx is active; this may conflict with framer-motion's style injection
3. **framer-motion SSR mismatch** — The server renders plain divs, client expects motion components; if there's a mismatch, hydration errors suppress animations
4. **Bundle loading failure** — If JS chunks fail to load (network, CORS, etc.), no hydration happens at all

### Key Evidence:
- The **HTML IS being served correctly** (verified via wget from inside container AND via curl to `https://dev.webink.solutions/`)
- The **content IS present** in the HTML (baja-beach.jpg, "Websites That Work", all sections)
- `framer-motion` IS in the bundle (1 chunk contains it)
- But **everything starts at `opacity:0`** in SSR, requiring client JS to animate visible
- If a user's browser doesn't execute the JS properly, they see a blank page
- **User searched page source for "HeroI" and found nothing** — this is EXPECTED because component names are compiled away by Next.js. The content IS there, just without React component names in the HTML.

---

## 5. Current VPS State

```
VPS IP:          31.97.11.49 (port 2222)
SSH:             ssh -i ~/.ssh/id_ed25519_agent -p 2222 root@31.97.11.49

Git Branch:      master
Latest Commit:   2541dcc (chore: Salient animations, scroll fixes, password recovery, CMS fixes)
Working Tree:    Clean (no uncommitted changes)
Remote:          https://github.com/webinksupport/webink-dev.git

Container:       webink-dev (Up, created 2026-03-31T13:24:17Z)
Image:           webink-dev-webink-dev (built from local Dockerfile)
Port:            3001 (internal, no host port mapping — Traefik handles routing)
Network:         traefik_default + webink-dev_default
Next.js:         14.2.3, production mode, ready on port 3001

Traefik:         Running, routes dev.webink.solutions -> webink-dev:3001
SSL:             Let's Encrypt via certresolver
External:        https://dev.webink.solutions/ returns HTTP 200

MySQL:           webink-mysql (Up 4 days), database: webinkdb
```

---

## 6. What Needs to Happen

### Priority 1: Diagnose the Animation Failure
1. **Open dev.webink.solutions in a browser with DevTools** — Check console for:
   - React hydration errors
   - JS loading failures (failed chunk fetches)
   - framer-motion warnings
2. **Check if framer-motion is initializing** — In console, look for motion elements getting `data-framer-*` attributes after hydration
3. **Test with JS disabled** — Confirm the page is blank (expected) vs. showing content (would mean animations are CSS-only and something else is wrong)

### Priority 2: Fix the Root Cause
**Most likely fix:** The SSR `opacity:0` problem. Options:
- **Option A:** Add `whileInView` instead of `animate` for scroll-triggered sections (ensures they trigger on viewport entry, not just on mount)
- **Option B:** Use CSS animations as fallback — add `@keyframes` in globals.css with `animation-fill-mode: forwards` so content becomes visible even without JS
- **Option C:** Remove `initial={{ opacity: 0 }}` from components and use `whileInView` with `viewport={{ once: true }}` pattern exclusively
- **Option D:** Check if there's a hydration mismatch from styled-jsx (`jsx-*` classes) conflicting with framer-motion and resolve it

### Priority 3: Verify the Fix
1. Rebuild container: `cd /opt/webink-dev && docker compose build --no-cache && docker compose up -d`
2. Test `https://dev.webink.solutions/` in multiple browsers
3. Verify animations play on scroll
4. Check page source still has proper SEO content

### Quick Deploy Commands
```bash
ssh -i ~/.ssh/id_ed25519_agent -p 2222 root@31.97.11.49
cd /opt/webink-dev
git pull  # if changes were pushed from elsewhere
docker compose build --no-cache
docker compose up -d
docker logs webink-dev --tail 50  # verify startup
```

---

## 7. Architecture Notes for Claude Code

- **Next.js 14.2.3** App Router (not Pages Router)
- **All variant-i components are client components** (`'use client'` directive)
- **page.tsx is a SERVER component** that fetches CMS content and passes to client components
- **CMS system:** Content stored in MySQL via Prisma, loaded server-side via `getPageContent()`
- **Editor system:** `PageEditorWrapper` provides inline editing context (admin only)
- **Smooth scroll:** Lenis library wraps the entire app
- **Traefik** handles SSL termination and routing — no need to manage certs manually
- **No port mapping** on the container — Traefik connects via Docker network
- **framer-motion ^11.18.2** — Used for all entrance animations
- **styled-jsx** — Active (Next.js default), producing `jsx-*` class hashes

---

*This doc was generated by Mason (subagent) to facilitate handoff to Claude Code for the deployment fix.*

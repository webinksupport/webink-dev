# DESIGN-SYSTEM.md — Webink Solutions Visual Reference
> Quick-reference guide for colors, type, spacing, and components.
> For full rules and code patterns, see `CLAUDE.md`.

---

## 🎨 COLOR SWATCHES

### Primary Backgrounds
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ████████  White           #FFFFFF   — Primary light background     │
│  (white)                                                            │
│                                                                     │
│  ▓▓▓▓▓▓▓▓  Off-White       #F8F8F8   — Cards, alt sections         │
│  (lt gray)                                                          │
│                                                                     │
│  ████████  Near-Black      #0F0F0F   — Dark sections, hero, footer  │
│  (v.dark)                                                           │
│                                                                     │
│  ████████  Ink Black       #0A0A0A   — Deep BG, depth layering      │
│  (darkest)                                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Accent Colors (ACCENT ONLY — never full backgrounds)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ▓▓▓▓▓▓▓▓  Neon Cyan       #14EAEA   PRIMARY accent                 │
│  (cyan)    ↳ borders, glows, icon circles, underlines, eyebrows     │
│                                                                     │
│  ▓▓▓▓▓▓▓▓  Neon Pink       #F813BE   SECONDARY accent               │
│  (pink)    ↳ CTAs, badges, highlights, alternate eyebrows           │
│                                                                     │
│  ▓▓▓▓▓▓▓▓  Electric Lime   #B9FF33   TERTIARY — use sparingly       │
│  (lime)    ↳ max 1-3 moments per page, gradients, single accents    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Text Colors
```
On light backgrounds (#FFFFFF / #F8F8F8):
  Body text:      #1A1A1A  ████  Dark charcoal
  Secondary text: #333333  ████  Carbon gray
  Muted text:     #666666  ████  Mid gray

On dark backgrounds (#0F0F0F / #0A0A0A):
  All text:       #FFFFFF  ████  Pure white

On cyan (#14EAEA):
  Text:           #0A0A0A  ████  Very dark (for contrast)

On pink (#F813BE):
  Text:           #FFFFFF  ████  White
```

### Color Balance Rule
```
Per page:
  Cyan  ████████████  ~50% of accent usage
  Pink  ████████████  ~50% of accent usage
  Lime  ██            Max 3 moments only

✅ Balanced:  cyan eyebrow → pink CTA → cyan card border → pink badge
❌ Imbalanced: cyan everywhere, pink nowhere
❌ Wrong:     full cyan section background
```

---

## 🔤 TYPOGRAPHY — URBANIST

### Font Weights Visual Guide
```
Urbanist 100  ·  The quick brown fox — Ultra-thin (hero display only)
Urbanist 300  ·  The quick brown fox — Light (hero headlines, dramatic)
Urbanist 400  ·  The quick brown fox — Regular (body copy, 16-17px)
Urbanist 600  ·  The quick brown fox — Semi-bold (subheadings, buttons)
Urbanist 700  ·  The quick brown fox — Bold (section headings, labels)
Urbanist 800  ·  The quick brown fox — Extra-bold (stat numbers)
Urbanist 900  ·  The quick brown fox — Black (max emphasis moments)
```

### Size & Usage Reference
```
12-13px  /  700  /  TRACKING 3PX  /  ALL CAPS   →  Eyebrow labels
16-17px  /  400  /  line-height 1.6             →  Body copy
20-24px  /  600                                 →  Lead paragraph
24-32px  /  600                                 →  H3 subheadings
40-56px  /  700                                 →  H2 section headings
80-120px /  100-300                             →  Hero display headlines

clamp(3rem, 8vw, 7.5rem)   →  Hero headline
clamp(2rem, 4vw, 3.5rem)   →  Section H2
clamp(1rem, 1.1vw, 1.0625rem)  →  Body copy
```

### Eyebrow Text Example
```
Label Style:  font-size: 12px | font-weight: 700 | letter-spacing: 3px | text-transform: UPPERCASE
Color:        #14EAEA (cyan) OR #F813BE (pink) — alternate between sections

Example output:  O U R  S E R V I C E S  ←  in neon cyan
```

---

## 📐 SPACING SCALE

Based on Tailwind's default 4px base unit:

```
Spacing Token   px Value   Tailwind Class   Common Use
─────────────────────────────────────────────────────
4px             1 unit     p-1              Icon padding
8px             2 units    p-2              Small gaps
12px            3 units    p-3              Tight padding
16px            4 units    p-4              Base padding
24px            6 units    p-6             
32px            8 units    p-8              Card padding
48px            12 units   p-12             
64px            16 units   p-16             
80px            20 units   py-20            Section padding (mobile)
96px            24 units   py-24            
128px           32 units   py-32            Section padding (desktop)
```

### Section Padding (Standard)
```
Mobile:   px-6   py-20    →  24px horizontal / 80px vertical
Tablet:   px-16  py-24    →  64px horizontal
Desktop:  px-24  py-32    →  96px horizontal / 128px vertical

Max content width: max-w-7xl (1280px) with mx-auto
```

### Grid System
```
Standard content:  1 column (mobile) → 2 col (md) → 3 col (lg)
Service cards:     1 col (mobile) → 2 col (sm) → 3 col (lg)
Hero layout:       1 col (mobile) → 2 col (lg) — text left, image right
Stats row:         2 col (mobile) → 4 col (md)

Column gap:        gap-6 (24px) minimum | gap-8 (32px) standard | gap-12 (48px) for hero splits
```

---

## 🎛️ COMPONENT QUICK REFERENCE

### Button Variants
```
Primary (pink filled):
  bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full
  hover: bg-[#d10fa3]

Secondary (ghost, light bg):
  border border-[#1A1A1A] text-[#1A1A1A] font-semibold px-8 py-4 rounded-full
  hover: bg-[#1A1A1A] text-white

Secondary (ghost, dark bg):
  border border-white text-white font-semibold px-8 py-4 rounded-full
  hover: bg-white text-[#0A0A0A]

Cyan outline (dark sections):
  border border-[#14EAEA] text-[#14EAEA] font-semibold px-8 py-4 rounded-full
  hover: bg-[#14EAEA] text-[#0A0A0A]
```

### Card Border States
```
Default:  border: 1px solid #E5E5E5
Hover:    border: 1px solid #14EAEA + box-shadow: 0 8px 40px rgba(20,234,234,0.15)
```

### Radius Reference
```
rounded-lg     8px   →  Small UI elements, badges
rounded-xl     12px  →  Buttons, small cards
rounded-2xl    16px  →  Standard cards, images (MINIMUM for images)
rounded-3xl    24px  →  Featured large images
rounded-full   pill  →  Buttons, icon circles, tags
```

### Shadow Reference
```
shadow-sm   →  Subtle hover lift on cards
shadow-md   →  Standard card depth
shadow-xl   →  Featured images, hero elements
shadow-2xl  →  Modal overlays

Cyan glow:  box-shadow: 0 8px 40px rgba(20,234,234,0.15)
Pink glow:  box-shadow: 0 8px 40px rgba(248,19,190,0.15)
```

---

## 🎬 ANIMATION QUICK REFERENCE

### Easing (use everywhere)
```
[0.25, 0.46, 0.45, 0.94]  ←  Standard Webink easing (easeOutQuart feel)
```

### Duration Reference
```
0.3s  →  Micro-interactions (hover color change, button press)
0.6s  →  Short content fades, button entrances
0.8s  →  Image scale-grow, text section fades
1.0s  →  Hero headline entrance
1.2s  →  Hero featured image entrance (longest)
```

### Scroll Animation Patterns
```
All images:
  initial: { scale: 0.92, opacity: 0, y: 20 }
  whileInView: { scale: 1, opacity: 1, y: 0 }
  duration: 0.8

Text sections:
  initial: { opacity: 0, y: 24 }
  whileInView: { opacity: 1, y: 0 }
  duration: 0.6

Stagger delay: 0.1s between children
Viewport margin: "-80px" for images, "-60px" for text
viewport.once: true (always — don't re-animate on scroll back)
```

---

## 📸 IMAGE DIRECTORY

```
public/images/
├── photos/          ←  Real photography
│   ├── hero/        ←  Hero background images (Baja beach photo here)
│   ├── team/        ←  Sean Rowe and team photos
│   ├── sarasota/    ←  Local Sarasota lifestyle photography
│   └── clients/     ←  Client website screenshots for portfolio
└── ai/              ←  AI-generated images (label in alt text if relevant)
```

**Rules:**
- Use `next/image` (never `<img>`)
- Add `priority` prop on above-fold images
- Every image needs descriptive `alt` text with keywords
- No photo duplicates on a single page
- `rounded-2xl` minimum + `shadow-xl` + `overflow-hidden` wrapper + scale-grow animation

---

## ✅ PRE-COMMIT CHECKLIST

Before every commit, verify:
- [ ] `next build` passes with zero TypeScript errors
- [ ] No new `any` types without justification
- [ ] All new images have `alt` text
- [ ] No neon color used as full section background
- [ ] Mobile layout tested at 390px width
- [ ] Lenis and Urbanist still in `layout.tsx`
- [ ] No `console.log` statements
- [ ] No hardcoded prices (use constants from a pricing file)
- [ ] Owner name is "Sean Rowe" wherever referenced
- [ ] All buttons have hover states

---

*Last updated: March 2026 by Octo 🐙*

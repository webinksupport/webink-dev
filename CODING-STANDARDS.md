# Webink Dev — Coding Standards

> **Read this file before building or modifying any page.** Every agent, developer, or contributor must follow these rules.

---

## 1. All Content Must Be Editable

Every piece of user-facing content — text, images, and background images — **must** use the editor components from `@/components/editor/`. Never hardcode content that should be user-configurable.

### Text

Use `EditableText` for all text content (headings, paragraphs, labels, button text, etc.).

```tsx
import EditableText from '@/components/editor/EditableText'

<EditableText
  as="h1"                           // HTML tag to render
  pageSlug="home"                   // page identifier (matches DB key)
  blockKey="hero_headline"          // unique key within the page
  defaultValue="Your Headline"      // fallback when no DB entry exists
  className="text-4xl font-bold"
/>
```

**Rules:**
- `blockKey` must be unique within a `pageSlug`.
- Always provide a meaningful `defaultValue`.
- Never wrap `EditableText` output in another element that sets `textContent` — the editor needs direct DOM access.

### Images

Use `EditableImage` for all images (logos, photos, icons, cards, etc.).

```tsx
import EditableImage from '@/components/editor/EditableImage'

<EditableImage
  pageSlug="home"
  blockKey="about_image"
  src="/images/default-photo.jpg"   // default fallback image
  alt="Descriptive alt text"
  fill                              // or width={} height={}
  className="object-cover"
/>
```

**Rules:**
- Never use `<Image>` from `next/image` directly for content images. Always use `EditableImage`.
- `<Image>` from `next/image` is only acceptable for **purely decorative/structural** elements that should never change (e.g., loading spinners), though this is rare.
- Provide a descriptive `alt` attribute for accessibility.

### Background Images

Use `EditableBackground` for full-bleed or section background images.

```tsx
import EditableBackground from '@/components/editor/EditableBackground'

<EditableBackground
  pageSlug="home"
  blockKey="hero_bg"
  defaultSrc="/images/default-bg.jpg"
  defaultOverlayOpacity={0.55}
  defaultPosition="center"
  className="absolute inset-0"
>
  {children}
</EditableBackground>
```

**Rules:**
- Never set `backgroundImage` in inline `style` attributes — it overrides the editable background.
- The `EditableBackground` component handles its own dark overlay; do not layer a duplicate.

---

## 2. Page Wrapper

Every public page must be wrapped in `PageEditorWrapper` (or `VisualEditor`), which provides the `EditorProvider` context.

```tsx
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageContent, getPageJsonContent } from '@/lib/content'

export default async function MyPage() {
  const content = await getPageContent('my-page')
  const jsonContent = await getPageJsonContent('my-page')

  return (
    <PageEditorWrapper
      pageSlug="my-page"
      initialContent={content}
      initialJsonContent={jsonContent}
    >
      {/* page content here */}
    </PageEditorWrapper>
  )
}
```

---

## 3. Save & Cache Pattern

### How saves work
1. Admin enters edit mode (pencil button, bottom-right).
2. Clicks an editable element → toolbar opens.
3. Makes changes → clicks **Save Changes**.
4. `saveBlock()` sends a `PUT /api/content/{pageSlug}` request.
5. On success, the local EditorContext state updates immediately.
6. The server cache is automatically invalidated via `/api/clear-cache`.

### Resolution order
- **EditableText**: DB context value → SSR `value` prop → `defaultValue`
- **EditableImage**: DB JSON → CMS prop → `src` prop
- **EditableBackground**: DB JSON → CMS `cmsData` prop → `default*` props

This ensures that saved values always take priority over SSR/hardcoded defaults, even before a page refresh.

### No caching conflicts
- Set `export const revalidate = 0` on all public pages to ensure dynamic rendering.
- Never use `generateStaticParams` for pages with editable content.

---

## 4. Block Key Naming Convention

Use descriptive, snake_case keys scoped to the section:

```
hero_headline
hero_subtext
hero_bg
about_image
about_body
footer_logo
nav_logo_dark
stats_bg_image
```

For items in arrays, use the pattern `{section}_{item}_{index}`:

```
services_panel_0_image
team_photo_1
```

---

## 5. Adding a New Page

1. Create the page in `src/app/{slug}/page.tsx`.
2. Add `export const revalidate = 0`.
3. Fetch content with `getPageContent` and `getPageJsonContent`.
4. Wrap in `PageEditorWrapper` with the correct `pageSlug`.
5. Use `EditableText`, `EditableImage`, and `EditableBackground` for all content.
6. Use the `"global"` pageSlug for shared elements (nav logos, footer logo).

---

## 6. Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| Using `<Image>` from `next/image` for content | Use `<EditableImage>` instead |
| Hardcoding `backgroundImage` in `style` | Use `<EditableBackground>` |
| Setting `revalidate` to a non-zero value | Set `revalidate = 0` for editable pages |
| Forgetting `pageSlug` on editable components | Always set `pageSlug` explicitly or ensure `EditorProvider` context exists |
| Duplicate `blockKey` within a page | Each key must be unique per `pageSlug` |

---

## 7. File Reference

| Component | Path | Purpose |
|-----------|------|---------|
| `EditableText` | `src/components/editor/EditableText.tsx` | Editable text element |
| `EditableImage` | `src/components/editor/EditableImage.tsx` | Editable image element |
| `EditableBackground` | `src/components/editor/EditableBackground.tsx` | Editable background with overlay controls |
| `EditorToolbar` | `src/components/editor/EditorToolbar.tsx` | Floating toolbar for editing |
| `EditorContext` | `src/components/editor/EditorContext.tsx` | State management & save logic |
| `PageEditorWrapper` | `src/components/editor/PageEditorWrapper.tsx` | Page-level editor provider |
| `MediaPicker` | `src/components/editor/MediaPicker.tsx` | Image upload & selection modal |
| Content API | `src/app/api/content/[pageSlug]/route.ts` | GET/PUT content blocks |
| Content helpers | `src/lib/content.ts` | Server-side DB fetch functions |

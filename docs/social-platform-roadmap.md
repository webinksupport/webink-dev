# Webink Social Platform — Loomly Replacement Roadmap

> Internal build plan for evolving Webink's Social Media Studio into a production-grade
> Loomly alternative for agency use. Last updated: 2026-04-10.

---

## 1. Product Vision

Replace Loomly as Webink's client-facing social media management platform. The tool must support:

- **Multi-client workspaces** — each client has their own brand, accounts, and content
- **Three creation lanes** — Automated, AI-Assist, and Manual
- **Image generation** built into the content workflow
- **Easiest possible connection UX** — staged approach, defer complex OAuth until needed
- **Agency-grade scheduling, approval, and publishing**

### Feature Parity Goals vs Loomly

| Loomly Feature | Webink Status | Priority |
|----------------|---------------|----------|
| Content calendar | ✅ Built (CalendarView) | — |
| Post scheduling | ✅ Built | — |
| Multi-platform publishing (FB, IG) | ✅ Built (hardcoded IDs) | P0: client-scope |
| LinkedIn publishing | ❌ Placeholder | P1 |
| TikTok publishing | ❌ Not started | P2 |
| Approval workflows | ✅ Built (ReviewQueue) | P1: add comments |
| Content ideas/inspiration | ✅ Built (AI-powered) | — |
| Brand asset library | ✅ Built (BrandAssets) | — |
| Analytics & reporting | ⚠️ Basic IG insights | P1 |
| Post preview mockups | ❌ Not started | P2 |
| Hashtag manager | ✅ Built | — |
| Content recycling | ✅ Built (Recycler) | — |
| CSV bulk import | ✅ Built | — |
| Team roles/permissions | ❌ Not started | P2 |
| Client portal / external review | ❌ Not started | P2 |
| A/B testing | ✅ Built | — |
| UTM tracking | ❌ Not started | P3 |

**Webink advantages over Loomly:**
- AI content generation (ideas, captions, carousels, reels, scoring)
- AI image generation (FLUX, DALL-E, Gemini — multi-provider)
- Brand voice enforcement via AI
- Competitor intelligence & gap analysis
- Content pillars framework
- Text overlay renderer

---

## 2. Three Creation Lanes

### Lane 1: Manual Path
User writes everything themselves. No AI involved.

**Flow:** New Post → Write caption → Upload/select image → Set hashtags → Choose platforms → Schedule or publish

**Current state:** Partially supported via PostBuilder step 5 (Build & Schedule). Needs a dedicated "manual compose" entry point that skips AI steps.

### Lane 2: AI-Assist Path
User provides a topic or brief; AI generates options; user picks and refines.

**Flow:** Enter topic → AI generates 3 content ideas → Pick one → AI suggests image prompt → Generate image → Review & edit caption → Schedule

**Current state:** ✅ Fully built as PostBuilder 5-step wizard. This is the strongest lane.

### Lane 3: Automated Path
System generates and queues content on a schedule with minimal human input.

**Flow:** Configure content pillars + brand voice + frequency → System auto-generates posts → Posts land in Review Queue → Approve/reject → Auto-publish on schedule

**Current state:** Foundations exist (content pillars, brand profile, cron auto-post). Missing: auto-generation trigger, frequency config, pillar-to-post pipeline.

### Implementation Plan for Lanes

**Phase 1 (Now):** Add lane selector UI to SocialStudio. Manual lane = simplified composer. AI-Assist lane = existing PostBuilder. Automated lane = config panel + "generate batch" action.

**Phase 2:** Automated lane gets cron-triggered generation (e.g., "generate 5 posts per week from pillars"). Posts auto-enter review queue.

**Phase 3:** Smart scheduling — AI picks optimal times based on analytics. Auto-approve option for trusted content types.

---

## 3. Media / Image Generation Flow

### Current Architecture
```
Topic → AI suggests image prompt → User picks model/provider → Generate image
                                                                    ↓
                                                          Saved to /uploads/social/
                                                                    ↓
                                                          Attached to post draft
```

### Supported Providers
- Together AI (FLUX.1/FLUX.2 — best for brand consistency with reference images)
- Google Gemini (native image generation)
- OpenAI DALL-E 3
- FAL.AI
- Anthropic (via API)

### Enhancement Plan
1. **Brand asset auto-injection** — When generating for a client, automatically include their logo/brand assets as reference images (FLUX Kontext supports this)
2. **Template library** — Pre-built prompt templates for common post types (quote cards, product shots, behind-the-scenes)
3. **Batch generation** — Generate 5-10 images at once for a content week
4. **Text overlay integration** — After generating base image, apply text overlays (already built via render-overlay API)
5. **Video thumbnail generation** — For Reel posts, generate cover images

---

## 4. Client / Account Model

### Current State
```
SocialClient {
  name, instagramHandle, facebookPageId, accessToken,
  brandProfileId, userId, status
}
```

**Problem:** Publishing routes hardcode `FB_PAGE_ID` and `IG_USER_ID`. Client model exists but isn't wired into publishing.

### Target Architecture
```
SocialClient {
  name
  // Platform connections (per-platform)
  connections: SocialConnection[]
  // Brand identity
  brandProfile: SocialBrandProfile
  // Content
  posts: SocialPost[]
  // Team access
  members: SocialClientMember[]
}

SocialConnection {
  platform: "facebook" | "instagram" | "linkedin" | "tiktok"
  platformAccountId   // e.g., IG user ID, FB page ID
  accessToken
  tokenExpiresAt
  status: "active" | "expired" | "pending_setup"
  lastVerifiedAt
  connectionMethod: "manual_token" | "oauth" | "pending"
}
```

### Migration Plan
1. **Now:** Add `SocialConnection` model. Refactor publish routes to resolve credentials from client context instead of hardcoded constants. Support `manual_token` connection method (paste token + account ID).
2. **Later:** Add OAuth flow for Meta (requires app review). Add LinkedIn OAuth.
3. **Future:** Client self-service portal for connecting their own accounts.

---

## 5. Scheduling / Publishing Architecture

### Current Flow
```
Post created (DRAFT)
  → Admin reviews (PENDING_REVIEW)
    → Approved (SCHEDULED, scheduledAt set)
      → Cron checks every N minutes
        → If due: PUBLISHING → call Meta API → PUBLISHED or FAILED
```

### Reliability Improvements Needed

| Issue | Solution |
|-------|----------|
| No publish log (only final status) | Add `PublishLog` model — every attempt recorded |
| No retry on failure | Auto-retry FAILED posts up to 3 times with backoff |
| Hardcoded Meta IDs | Resolve from client's SocialConnection |
| No dry-run mode | `DRY_RUN` flag skips API calls, logs what would happen |
| No timezone support | Add `timezone` field to SocialClient |
| No queue conflict detection | Warn when 2+ posts scheduled within 30 min |
| No publish receipt/proof | Store API response + screenshot-able preview |

### PublishLog Model
```prisma
model PublishLog {
  id          String   @id @default(cuid())
  postId      String
  post        SocialPost @relation(...)
  platform    String   // "facebook" | "instagram" | "linkedin"
  action      String   // "publish" | "retry" | "dry_run"
  status      String   // "success" | "failed" | "skipped"
  platformPostId String?
  requestPayload Json?
  responsePayload Json?
  errorMessage String? @db.Text
  attemptNumber Int    @default(1)
  createdAt   DateTime @default(now())
}
```

---

## 6. Approval / Review Workflow

### Current State
- Single-stage review: DRAFT → PENDING_REVIEW → SCHEDULED
- Admin can approve, request changes, or reject
- Notes field stores feedback (overwrites on each action)

### Enhancements

**Phase 1 (Now):**
- Add `PostActivity` model for threaded comments/history on each post
- Track all status changes with timestamps and who made them
- Support back-and-forth discussion without losing history

**Phase 2:**
- Client review link (shareable URL, no login required, with approve/reject buttons)
- Email notifications on status changes
- Batch approve from calendar view

**Phase 3:**
- Multi-tier approval (creator → manager → client)
- Auto-approve rules (e.g., "approve all posts matching content pillar X")

---

## 7. Cron / Reliability Model

### Current Cron Setup
- External cron hits `GET /api/cron/social-auto-post` with Bearer token
- Finds SCHEDULED posts where `scheduledAt <= now`
- Publishes sequentially to Instagram only

### Target Architecture

| Component | Current | Target |
|-----------|---------|--------|
| Trigger | External cron (single endpoint) | External cron + internal scheduler |
| Platforms | Instagram only | FB + IG + LinkedIn (per-connection) |
| Retry | None | 3 retries with exponential backoff |
| Logging | Status field only | Full PublishLog with request/response |
| Monitoring | None | Failed post alerts (email/webhook) |
| Rate limiting | None | Platform-specific rate limits |
| Health check | None | `/api/cron/health` endpoint |

### Cron Endpoints Plan
```
GET /api/cron/social-auto-post     — Publish due posts (existing, enhanced)
GET /api/cron/social-retry-failed  — Retry recently failed posts
GET /api/cron/social-auto-generate — Generate posts from automation config
GET /api/cron/social-token-check   — Verify token health, alert on expiry
GET /api/cron/health               — System health check
```

---

## 8. Connection UX — Staged Approach

### The Problem
Meta and LinkedIn require app review for production OAuth. This takes weeks. We need to ship value before that's done.

### Staged Connection Strategy

**Stage 1: Manual Token (NOW)**
- Admin pastes a Page Access Token + Page ID / IG User ID into client settings
- Token obtained from Meta Graph API Explorer or Business Manager
- System validates token on save (test API call)
- Works immediately, no app review needed
- Clear UI showing token expiry and refresh instructions

**Stage 2: OAuth via Dev App (SOON)**
- Create Meta app in dev mode
- OAuth flow works for accounts that are admins/testers of the app
- Good enough for Webink's own clients (add them as testers)
- LinkedIn: similar dev-mode OAuth

**Stage 3: Production OAuth (LATER)**
- Submit Meta app for review
- Full self-service connection for any user
- Token auto-refresh via long-lived tokens

### Connection Status UI
Each platform connection shows:
- Green: Connected & verified (token valid, recent successful post)
- Yellow: Connected but token expiring soon (< 7 days)
- Red: Disconnected or token expired
- Gray: Not configured yet (with setup guide)

---

## 9. What Can Be Built Now vs. What Depends on External Setup

### Build NOW (No External Dependencies)
- [x] Client-scoped credential resolution (refactor hardcoded IDs)
- [x] PublishLog model & logging
- [x] Dry-run / test publishing mode
- [x] Three creation lanes UI
- [x] Connection onboarding states & status UI
- [x] Post activity/comments model
- [x] Queue reliability (retry logic, conflict detection)
- [x] Timezone support per client
- [ ] Automated content generation pipeline (pillars → drafts)
- [ ] Batch image generation
- [ ] Post preview mockups (phone frame)
- [ ] Client review links (shareable, no-login)

### Needs Meta App Setup
- [ ] OAuth connection flow (Stage 2)
- [ ] Token auto-refresh
- [ ] Carousel publishing (requires app permissions)
- [ ] Reel/video publishing (requires app permissions)
- [ ] Stories publishing
- [ ] Full Instagram Insights API access

### Needs LinkedIn App Setup
- [ ] LinkedIn OAuth flow
- [ ] LinkedIn publishing
- [ ] LinkedIn analytics

### Needs Additional Infrastructure
- [ ] Email notifications (SMTP already configured)
- [ ] Webhook alerts for failures
- [ ] Background job queue (for heavy operations)

---

## 10. Phased Implementation Plan

### Phase 1: Foundation (Current Sprint)
**Goal:** Make the existing platform production-grade for single-brand and multi-client use.

1. Add `PublishLog` and `PostActivity` models to schema
2. Refactor publishing to use client-scoped credentials
3. Add dry-run mode for testing without live API calls
4. Build three creation lanes selector UI
5. Add connection status & onboarding UI
6. Add retry logic and conflict detection to scheduler
7. Add timezone field to client model

### Phase 2: Automation & Polish (Next Sprint)
**Goal:** Enable the automated creation lane and improve UX.

1. Pillar-to-post auto-generation pipeline
2. Frequency/schedule config for automation
3. Batch image generation
4. Post preview mockups (phone frame with platform chrome)
5. Email notifications on post status changes
6. Calendar drag-to-reschedule improvements

### Phase 3: Platform Expansion (Following Sprint)
**Goal:** Add LinkedIn, improve Meta integration depth.

1. Meta OAuth flow (dev app mode)
2. LinkedIn OAuth + publishing
3. Carousel publishing support
4. Reel/video publishing support
5. Enhanced analytics with historical tracking
6. Client review portal (shareable links)

### Phase 4: Scale & Self-Service (Future)
**Goal:** Production OAuth, team features, client self-service.

1. Meta app production review
2. Full self-service account connection
3. Team roles and permissions
4. Multi-tier approval workflows
5. White-label option for client portal
6. TikTok integration
7. Reporting / PDF export

---

## Appendix: Key File Paths

| Component | Path |
|-----------|------|
| Social Studio main | `src/app/admin/social/SocialStudio.tsx` |
| PostBuilder (AI-Assist lane) | `src/app/admin/social/tabs/PostBuilder.tsx` |
| Client Manager | `src/app/admin/social/tabs/ClientManager.tsx` |
| Publishing API | `src/app/api/social/posts/[id]/publish/route.ts` |
| Auto-post cron | `src/app/api/cron/social-auto-post/route.ts` |
| Prisma schema | `prisma/schema.prisma` |
| Image generation | `src/app/api/social/generate-image/route.ts` |
| AI model registry | `src/lib/ai/social-model-registry.ts` |

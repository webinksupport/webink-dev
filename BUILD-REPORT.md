# BUILD REPORT — Social Platform Loomly Replacement (Phase 1)

**Date:** 2026-04-10
**Task:** Evolve Webink Social Media Studio into a production-grade Loomly replacement

---

## What Was Planned

Transform the existing social studio into a Loomly-style multi-client social media management platform with:
1. Three creation lanes (Manual / AI-Assist / Automated)
2. Client-scoped credential management (replacing hardcoded Meta IDs)
3. Publish logging & reliability (retry, dry-run, conflict detection)
4. Connection onboarding UX (staged approach for platform connections)
5. Post activity/comments for review workflows
6. Comprehensive roadmap document for continued development

---

## What Was Actually Implemented

### Phase A: Roadmap Document
- Created `docs/social-platform-roadmap.md` — comprehensive internal build plan covering:
  - Feature parity goals vs Loomly
  - Three creation lanes architecture
  - Client/account model evolution
  - Scheduling/publishing reliability improvements
  - Staged connection UX (manual token → dev OAuth → production OAuth)
  - Phased implementation plan (4 phases)

### Phase B: Foundation Build

#### 1. Database Schema Enhancements (`prisma/schema.prisma`)
- **SocialPost** — Added `clientId`, `creationLane`, `retryCount`, `maxRetries` fields, plus relations to `PublishLog` and `PostActivity`
- **SocialClient** — Added `timezone` field and `SocialConnection` relation
- **SocialConnection** (NEW) — Per-platform connection model with `platformAccountId`, `accessToken`, `tokenExpiresAt`, `status`, `connectionMethod`, `lastVerifiedAt`, `lastError`
- **PublishLog** (NEW) — Records every publish attempt with platform, action, status, error, attempt number, dry-run flag
- **PostActivity** (NEW) — Threaded activity/comments on posts with type (comment/status_change/approval/rejection/edit), author, timestamps

#### 2. Publishing Infrastructure (`src/lib/social/publish-utils.ts`)
- `resolveCredentials()` — Resolves tokens from: client connection → client legacy fields → system settings → env vars
- `publishToPlatform()` — Unified publish function with dry-run support for Facebook, Instagram, LinkedIn
- `logPublishAttempt()` — Records every attempt to PublishLog
- `recordActivity()` — Records post activity entries
- `checkScheduleConflicts()` — Detects posts within 30 min of each other for the same client

#### 3. Publish Route Refactor (`src/app/api/social/posts/[id]/publish/route.ts`)
- Removed hardcoded `FB_PAGE_ID` and `IG_USER_ID` constants
- Uses `resolveCredentials()` to look up per-client or system-level credentials
- Supports `dryRun` mode (pass `{ dryRun: true }` in request body)
- Logs every platform publish attempt to `PublishLog`
- Records status changes and dry-run results to `PostActivity`

#### 4. Cron Auto-Post Refactor (`src/app/api/cron/social-auto-post/route.ts`)
- Uses `resolveCredentials()` instead of hardcoded IDs
- Publishes to all platforms in post's platform list (not just Instagram)
- Auto-retries FAILED posts (up to 3 attempts, within 2-hour window, max 5 per cron run)
- Full `PublishLog` entries for every attempt
- `PostActivity` entries for status changes

#### 5. New API Routes
- `POST /api/social/posts/[id]/activity` — Add comments/notes to posts
- `GET /api/social/posts/[id]/activity` — Fetch post activity history
- `GET /api/social/posts/[id]/logs` — Fetch publish attempt logs
- `POST /api/social/connections` — Create/update platform connections with token validation
- `GET /api/social/connections` — List connections (filterable by clientId)
- `POST /api/social/schedule-check` — Check for scheduling conflicts
- `POST /api/social/batch-generate` — Generate batch of posts from content pillars (automated lane)

#### 6. UI Components
- **CreationLanes** (`src/app/admin/social/components/CreationLanes.tsx`) — Lane selector with Manual/AI-Assist/Automated cards showing step previews
- **ConnectionStatus** (`src/app/admin/social/components/ConnectionStatus.tsx`) — Collapsible status bar showing FB/IG/LinkedIn connection health with inline setup form for manual token entry
- **PostActivityPanel** (`src/app/admin/social/components/PostActivityPanel.tsx`) — Threaded activity/comments panel with real-time posting

#### 7. SocialStudio Integration (`src/app/admin/social/SocialStudio.tsx`)
- Added ConnectionStatus bar below header (shows at all times)
- Added CreationLanes selector when entering PostBuilder tab
- Lane choice flows into PostBuilder (manual starts at compose step, AI-assist at topic step)
- PostBuilder now tracks `creationLane` in saved posts

---

## What Still Depends on External Platform/App Credentials

| Feature | Dependency |
|---------|-----------|
| Instagram/Facebook publishing | Meta access token (manual paste works NOW) |
| Instagram OAuth flow | Meta App Review (dev mode works for team members) |
| LinkedIn publishing | LinkedIn App + OAuth setup |
| TikTok publishing | TikTok Developer App |
| Token auto-refresh | Long-lived token exchange (Meta) |
| Full Instagram Insights | Meta App Review for `instagram_manage_insights` |

**Manual token approach works immediately** — no app review needed. Admin pastes a Page Access Token and Account ID in the new Connection setup UI.

---

## Where to Review

- **Dev site:** https://dev.webink.solutions (after deploy)
- **Social Studio:** https://dev.webink.solutions/admin → Social tab
- **Roadmap document:** `docs/social-platform-roadmap.md`

---

## Recommended Next Steps

1. **Deploy to dev** — Run `node deploy.js` after committing to push to dev.webink.solutions
2. **Run Prisma migration** on the VPS to create the new tables (`PublishLog`, `PostActivity`, `SocialConnection`)
3. **Set up a Meta access token** via the Connection UI for Webink's own accounts
4. **Configure content pillars** to enable the automated creation lane
5. **Test dry-run mode** — publish a post with dry-run to verify the flow without hitting Meta API
6. **Phase 2 priorities:**
   - Automated generation cron (auto-create posts from pillars on a schedule)
   - Batch image generation for auto-generated posts
   - Email notifications on post status changes
   - Post preview mockups (phone frame rendering)

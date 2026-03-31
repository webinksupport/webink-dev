# Webink Solutions -- WooCommerce -- Next.js Migration Plan

> **Owner:** Sean (Webink Solutions)
> **Created:** 2026-03-31
> **Status:** Draft -- Ready for review
> **Scope:** Migrate ~20-30 legacy WooCommerce subscribers to the new Next.js platform without billing disruption

---

## Table of Contents

1. [DNS & Hosting Strategy](#1-dns--hosting-strategy)
2. [User Account Migration](#2-user-account-migration)
3. [Stripe Setup](#3-stripe-setup)
4. [Phased Migration Plan](#4-phased-migration-plan)
5. [Technical Checklist](#5-technical-checklist)
6. [Risks & Mitigations](#6-risks--mitigations)
7. [Rollback Plan](#7-rollback-plan)

---

## 1. DNS & Hosting Strategy

### Current State

| Domain | Points To | Purpose |
|--------|-----------|---------|
| `webink.solutions` | WordPress + WooCommerce | Production site, billing, subscriptions |
| `dev.webink.solutions` | Next.js (Hostinger VPS) | New platform in development |

### Recommended: Option B -- WordPress stays on root, new platform on subdomain

**Why Option B over Option A:**
- Zero disruption to existing clients -- `webink.solutions` keeps working exactly as-is
- No DNS propagation risk during development
- Legacy billing URLs remain unchanged
- Simpler rollback: just shut down the subdomain

**Setup:**

| Phase | `webink.solutions` | `app.webink.solutions` | Notes |
|-------|-------------------|----------------------|-------|
| Development | WordPress (unchanged) | Next.js platform | Both live, independent |
| Soft Launch | WordPress (unchanged) | Next.js (new signups) | New users go to `app.` |
| Migration | WordPress (billing only) | Next.js (all users) | Legacy users redirected to Woo for billing |
| Cutover | **Next.js** | Redirect -- root | WordPress retired or archived |

### DNS Configuration Steps

```
# During development & soft launch (no changes to root)
app.webink.solutions  --  A record -- VPS IP (31.97.11.49)

# At cutover
webink.solutions      --  A record -- VPS IP (31.97.11.49)
old.webink.solutions  --  A record -- old WordPress IP (keep for 90 days)
```

### Running Both Simultaneously

- **WordPress:** Stays on current hosting (cPanel/shared hosting at webink.solutions)
- **Next.js:** Runs on Hostinger VPS (31.97.11.49) behind Traefik reverse proxy
- **No port conflicts:** WordPress on its own server, Next.js on VPS
- **Traefik config** routes `app.webink.solutions` to the Next.js Docker container
- **SSL:** Both get their own Let's Encrypt certs (WordPress via cPanel, Next.js via Traefik)

### Traefik Dynamic Config (for VPS)

```yaml
# /opt/traefik/dynamic/webink-app.yml
http:
  routers:
    webink-app:
      rule: "Host(`app.webink.solutions`)"
      entrypoints:
        - websecure
      service: webink-app
      tls:
        certResolver: letsencrypt

  services:
    webink-app:
      loadBalancer:
        servers:
          - url: "http://webink-dev:3000"
```

---

## 2. User Account Migration

### 2.1 Export Data from WooCommerce

**What to extract per customer:**

| Field | WooCommerce Source | New Platform Field |
|-------|-------------------|-------------------|
| Email | `user_email` | `User.email` |
| Display Name | `display_name` | `User.name` |
| Phone | `billing_phone` meta | `User.phone` |
| Subscription Plan | WooSub product name | Map to `ProductVariant` |
| Subscription Status | `post_status` on subscription | `Subscription.status` |
| Monthly Amount | `_order_total` or line item | Used for Stripe price matching |
| Stripe Customer ID | `_stripe_customer_id` meta | `User.stripeCustomerId` |
| Subscription Start Date | `post_date` on subscription | `Subscription.currentPeriodStart` |
| Billing Cycle | WooSub billing period | `ProductVariant.billingInterval` |

**Export Script (run on WordPress DB):**

```sql
-- Export customers with active subscriptions
SELECT
  u.user_email AS email,
  u.display_name AS name,
  pm_phone.meta_value AS phone,
  pm_stripe.meta_value AS stripe_customer_id,
  s.ID AS woo_subscription_id,
  s.post_status AS subscription_status,
  s.post_date AS subscription_start,
  si.order_item_name AS product_name,
  sim_total.meta_value AS recurring_total,
  sim_period.meta_value AS billing_period
FROM wp_users u
JOIN wp_posts s ON s.post_author = u.ID AND s.post_type = 'shop_subscription'
JOIN wp_order_items si ON si.order_id = s.ID AND si.order_item_type = 'line_item'
LEFT JOIN wp_usermeta pm_phone ON pm_phone.user_id = u.ID AND pm_phone.meta_key = 'billing_phone'
LEFT JOIN wp_usermeta pm_stripe ON pm_stripe.user_id = u.ID AND pm_stripe.meta_key = '_stripe_customer_id'  
LEFT JOIN wp_order_itemmeta sim_total ON sim_total.order_item_id = si.order_item_id AND sim_total.meta_key = '_line_total'
LEFT JOIN wp_order_itemmeta sim_period ON sim_period.order_item_id = si.order_item_id AND sim_period.meta_key = '_billing_period'
WHERE s.post_status IN ('wc-active', 'wc-on-hold', 'wc-pending-cancel')
ORDER BY u.user_email;
```

> **Note:** WooCommerce table prefixes and meta keys may vary. Test this query on a staging copy first.

### 2.2 Create Accounts in New Platform

**Password handling:**
- WordPress uses `phpass` hashes -- **cannot be migrated** to bcrypt
- All migrated users get accounts with `password: null`
- On first login, they hit the **password reset flow** (email link)
- Welcome email template: "We've upgraded your account! Click here to set your password."

**Migration script pseudocode:**

```typescript
import { prisma } from '@/lib/prisma';
import csv from 'csv-parser'; // or use JSON export

async function migrateUsers(exportedUsers: WooUser[]) {
  for (const woo of exportedUsers) {
    const user = await prisma.user.create({
      data: {
        email: woo.email,
        name: woo.name,
        phone: woo.phone || null,
        password: null, // Force password reset
        role: 'CUSTOMER',
        stripeCustomerId: woo.stripe_customer_id || null,
        emailVerified: true, // They had a Woo account
        isLegacy: true,
        legacyBillingUrl: `https://webink.solutions/my-account/`,
        legacySource: 'woocommerce',
        legacyMigratedAt: new Date(),
        notes: `Migrated from WooCommerce. Woo Sub ID: ${woo.woo_subscription_id}. Original plan: ${woo.product_name} @ $${woo.recurring_total}/${woo.billing_period}`,
      },
    });

    console.log(`-- Created user: ${user.email} (${user.id})`);
  }
}
```

### 2.3 Legacy User Flags

New fields added to `User` model (see schema changes below):

| Field | Type | Purpose |
|-------|------|---------|
| `isLegacy` | `Boolean` | Marks user as migrated from WooCommerce |
| `legacyBillingUrl` | `String?` | URL to WooCommerce "My Account" for billing management |
| `legacySource` | `String?` | Origin system (e.g., "woocommerce") |
| `legacyMigratedAt` | `DateTime?` | When the migration happened |

### 2.4 "Manage Billing" Button Behavior

```typescript
// In the dashboard billing component
function BillingButton({ user }) {
  if (user.isLegacy && user.legacyBillingUrl) {
    // Legacy user: redirect to WooCommerce
    return (
      <a href={user.legacyBillingUrl} target="_blank" rel="noopener">
        Manage Billing (Legacy Portal)
      </a>
    );
  }

  // New platform user: native billing
  return <StripeBillingPortalButton customerId={user.stripeCustomerId} />;
}
```

---

## 3. Stripe Setup

### 3.1 Same Stripe Account, Both Platforms

**Key principle:** Both WooCommerce and the new platform connect to the **same Stripe account**. This means:

- Existing Stripe Customer IDs carry over (no new customers needed)
- Payment methods already on file stay valid
- Subscription history is preserved in Stripe Dashboard

### 3.2 Create Matching Products in Stripe

For each WooCommerce subscription product, create a corresponding Stripe Product + Price:

```bash
# Example: Create product for "Basic Web Hosting" at grandfathered rate of $31/mo
stripe products create \
  --name="Basic Web Hosting (Legacy)" \
  --metadata[source]=woocommerce_migration \
  --metadata[legacy]=true \
  --metadata[original_woo_product_id]=123

stripe prices create \
  --product=prod_XXXXX \
  --unit-amount=3100 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[legacy]=true \
  --metadata[grandfathered]=true \
  --metadata[original_woo_price]="31.00"
```

**Grandfathered pricing strategy:**
- Create **separate Stripe Prices** for each grandfathered rate
- Mark them with `metadata.grandfathered: true`
- Archive these prices after all legacy users are migrated (so new users can't select them)
- Store the Stripe Price ID in the `ProductVariant.stripePriceId` field

### 3.3 Stripe Metadata Convention

All legacy-migrated subscriptions get these metadata tags:

```json
{
  "source": "woocommerce_migration",
  "legacy": "true",
  "migrated_at": "2026-XX-XX",
  "original_woo_subscription_id": "12345",
  "grandfathered": "true",
  "original_monthly_amount": "31.00"
}
```

### 3.4 Webhook Handling -- Avoiding Conflicts

**Problem:** Both WordPress (via WooCommerce Stripe Gateway) and the new platform listen for Stripe webhooks. If both receive the same events, you get double-processing.

**Solution: Separate webhook endpoints with event filtering**

| Platform | Webhook URL | Events |
|----------|-------------|--------|
| WooCommerce | `webink.solutions/wp-json/wc-stripe/webhook` | `invoice.paid`, `customer.subscription.*` (for Woo-managed subs) |
| New Platform | `app.webink.solutions/api/webhooks/stripe` | `invoice.paid`, `checkout.session.*`, `customer.subscription.*` (for new subs) |

**Critical: Use webhook signing secrets** -- each endpoint has its own secret, so even if both receive the same event, they only process what they signed up for.

**Idempotency check in the new platform:**

```typescript
// api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  
  // Only process subscriptions that belong to the NEW platform
  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object;
    
    // Check if this subscription exists in our DB
    const ourSub = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: sub.id }
    });
    
    if (!ourSub) {
      // This belongs to WooCommerce -- ignore it
      return NextResponse.json({ received: true, skipped: true });
    }
    
    // Process normally...
  }
}
```

---

## 4. Phased Migration Plan

### Phase 1: Parallel Setup (Week 1-2)

**Goal:** Both systems live. New users sign up on the new platform. Legacy users untouched.

**Steps:**
- [ ] Deploy Next.js platform to `app.webink.solutions`
- [ ] Configure Traefik routing for the subdomain
- [ ] Set up SSL certificate
- [ ] Create Stripe Products/Prices matching all current WooCommerce products
- [ ] Create grandfathered Price objects for legacy rates
- [ ] Set up Stripe webhook endpoint for new platform
- [ ] Test full signup -- checkout -- subscription flow on new platform
- [ ] Verify WooCommerce webhooks still work independently
- [ ] Add `isLegacy`, `legacyBillingUrl`, `legacySource`, `legacyMigratedAt` fields to User model
- [ ] Run Prisma migration

**Success criteria:** New user can sign up, subscribe, and manage billing entirely on the new platform. Zero impact to existing WooCommerce customers.

### Phase 2: Invite Legacy Users (Week 3-4)

**Goal:** Legacy users create accounts on new platform. Billing stays on WooCommerce.

**Steps:**
- [ ] Export all WooCommerce customer data (use SQL query from Section 2.1)
- [ ] Run migration script to create User records with `isLegacy: true`
- [ ] Set `legacyBillingUrl` to `https://webink.solutions/my-account/`
- [ ] Send personalized welcome emails with password reset links
- [ ] Template: "We've upgraded your dashboard! Your billing stays the same -- click here to set up your new account."
- [ ] Legacy users can log in, see their dashboard, but "Manage Billing" goes to WooCommerce
- [ ] Monitor: Track how many legacy users have activated their new accounts

**Success criteria:** All legacy users have accounts on the new platform. Billing is still 100% on WooCommerce. No billing disruption.

### Phase 3: One-by-One Subscription Migration (Week 5-8)

**Goal:** Migrate each legacy user's billing from WooCommerce to the new platform's Stripe integration.

**Per-user migration process:**

```
For each legacy user:
  1. Verify they've activated their new platform account
  2. Verify their Stripe Customer ID is linked in both systems
  3. In Stripe Dashboard:
     a. Note current subscription details (amount, interval, next billing date)
     b. Cancel the WooCommerce-managed subscription (at period end)
     c. Create a new subscription using the grandfathered Price object
     d. Set billing anchor to match their existing cycle
     e. Add migration metadata
  4. In new platform DB:
     a. Create Subscription record linked to new Stripe subscription
     b. Update User: isLegacy = true (keep for records), legacyBillingUrl = null
  5. Verify:
     a. New subscription appears in user's dashboard
     b. "Manage Billing" now shows native Stripe portal
     c. Next invoice generates correctly
  6. Send confirmation email: "Your billing has been moved to the new platform"
  7. Log the migration in SubscriptionNote
```

**Important timing note:** Cancel the Woo sub at period end, create new sub to start at the same date. This prevents double-billing or gaps.

**Batch size:** 3-5 users per day max. Watch for issues before scaling up.

**Success criteria:** Each migrated user has an active subscription on the new platform, no billing gap, correct amount.

### Phase 4: Full Cutover (Week 9-10)

**Goal:** All users on new platform. WordPress retired.

**Steps:**
- [ ] Verify ALL legacy users have been migrated (zero active WooCommerce subscriptions)
- [ ] Final audit: Compare Stripe Dashboard against new platform DB
- [ ] Update DNS: `webink.solutions` -- VPS IP (Next.js platform)
- [ ] Set up `old.webink.solutions` -- old WordPress IP (90-day archive)
- [ ] Update all email links, documentation, and support pages
- [ ] Set up 301 redirects from old WordPress URLs to new platform equivalents
- [ ] Archive WooCommerce Stripe webhook (delete or disable)
- [ ] Clean up legacy fields: remove `legacyBillingUrl` values (keep `isLegacy` for records)
- [ ] Monitor for 30 days: watch for any missed subscriptions, failed payments, confused users
- [ ] After 90 days: Decommission WordPress hosting

**Success criteria:** `webink.solutions` serves the Next.js platform. Zero WooCommerce subscriptions active. All users billing through new system.

---

## 5. Technical Checklist

### 5.1 Data to Export from WooCommerce

- [ ] Customer list (email, name, phone, Stripe Customer ID)
- [ ] Active subscriptions (product, amount, interval, status, start date)
- [ ] Subscription metadata (grandfathered status, original sign-up date)
- [ ] Order history (optional -- for reference, not migration)
- [ ] Any custom user meta (notes, special arrangements)

### 5.2 Database Schema Changes for Legacy Users

Add these fields to the `User` model in `prisma/schema.prisma`:

```prisma
model User {
  // ... existing fields ...
  
  // Legacy migration fields
  isLegacy          Boolean   @default(false)
  legacyBillingUrl  String?   // WooCommerce "My Account" URL during transition
  legacySource      String?   // "woocommerce"
  legacyMigratedAt  DateTime? // When they were imported
}
```

**Migration SQL (generated by Prisma):**

```sql
ALTER TABLE `User` ADD COLUMN `isLegacy` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `User` ADD COLUMN `legacyBillingUrl` VARCHAR(191) NULL;
ALTER TABLE `User` ADD COLUMN `legacySource` VARCHAR(191) NULL;
ALTER TABLE `User` ADD COLUMN `legacyMigratedAt` DATETIME(3) NULL;
```

### 5.3 Redirect Routes for Billing Management

```typescript
// middleware.ts or in the billing page component
// Route: /dashboard/billing

if (user.isLegacy && user.legacyBillingUrl) {
  // Show banner: "Your billing is managed on our legacy portal"
  // Button: "Manage Billing" -- opens legacyBillingUrl in new tab
} else {
  // Show native Stripe billing portal
  // Button: "Manage Billing" -- Stripe Customer Portal session
}
```

### 5.4 Webhook Separation

| Concern | Solution |
|---------|----------|
| Same Stripe events hitting both endpoints | Each endpoint checks if subscription exists in its own DB |
| Double-charging | Cancel Woo sub BEFORE creating new sub (or cancel at period end + start new at same date) |
| Missed webhooks | Log all incoming events; alert on unhandled types |
| Signing secrets | Separate webhook signing secrets per endpoint |

### 5.5 Rollback Plan

**If migration fails for a specific user:**
1. Cancel the new platform subscription in Stripe
2. Reactivate their WooCommerce subscription (if cancelled at period end, it's still active)
3. Set `legacyBillingUrl` back to WooCommerce URL
4. Contact user: "We encountered an issue, your billing is unchanged"

**If entire migration needs to roll back:**
1. DNS: Point `webink.solutions` back to WordPress
2. All WooCommerce subscriptions should still be active (Phase 3 cancels at period end)
3. New platform subscriptions: cancel in Stripe
4. Users keep their new platform accounts but billing reverts to Woo
5. Post-mortem: identify what went wrong before retrying

---

## 6. Risks & Mitigations

### Risk 1: Billing Gaps During Migration

| Concern | Mitigation |
|---------|-----------|
| User gets charged twice | Cancel Woo sub at period end, start new sub at same date |
| User misses a payment | Align billing anchors; verify next invoice date before and after |
| Proration issues | Use `proration_behavior: 'none'` on new subscription creation |

**Testing:** Run the full flow with a test Stripe customer first. Verify invoice dates, amounts, and no double-billing.

### Risk 2: Lost Subscription History

| Concern | Mitigation |
|---------|-----------|
| Historical invoices gone | Stripe retains all history -- it's on the same customer object |
| WooCommerce order history | Export and archive as CSV/JSON before retiring WordPress |
| Subscription notes | Log original Woo details in `User.notes` and `SubscriptionNote` |

### Risk 3: User Confusion

| Concern | Mitigation |
|---------|-----------|
| "Where do I log in?" | Clear email with direct login link |
| "Where's my billing?" | Legacy banner + redirect button during transition |
| "Did my subscription change?" | Confirmation email after each migration with amount + next billing date |
| "I can't log in" | Password reset flow is mandatory; make it seamless |

**Communication plan:**
1. **Pre-migration email:** "We're upgrading your account. No action needed yet."
2. **Account created email:** "Your new account is ready. Set your password here."
3. **Post-migration email:** "Your billing has been moved. Same price, same service. Here are the details."

### Risk 4: Stripe Webhook Conflicts

| Concern | Mitigation |
|---------|-----------|
| Both platforms process same event | Check subscription ownership before processing |
| Webhook endpoint goes down | Stripe retries for up to 3 days; monitor webhook failure rate |
| Wrong signing secret | Each endpoint uses its own secret; test in Stripe CLI first |

### Risk 5: Grandfathered Pricing Lost

| Concern | Mitigation |
|---------|-----------|
| Legacy rates not preserved | Create exact Stripe Price objects before migration |
| Someone gets charged wrong amount | Verify amount in migration script; add to checklist |
| Prices get archived too early | Only archive after ALL legacy users are migrated |

**How to test each step:**

| Step | Test Method |
|------|------------|
| User creation | Create test user, verify all fields, test password reset |
| Stripe product creation | Create test product/price, verify in Stripe Dashboard |
| Subscription migration | Use Stripe test mode with a test customer, full flow |
| Webhook separation | Send test events via Stripe CLI, verify only correct endpoint processes |
| DNS cutover | Test with `/etc/hosts` override before changing real DNS |
| Billing portal redirect | Log in as legacy user, verify button goes to WooCommerce |

---

## 7. Rollback Plan

### Per-User Rollback (During Phase 3)

```
1. Cancel new Stripe subscription immediately
2. Verify WooCommerce subscription is still active
   - If cancelled at period end: reactivate via WP admin
   - If already expired: recreate manually
3. Update User record:
   - legacyBillingUrl = "https://webink.solutions/my-account/"
4. Email user: "No changes to your billing -- everything stays as-is"
5. Log incident in SubscriptionNote
```

### Full Rollback (Nuclear Option)

```
1. Stop Phase 3 migrations immediately
2. Cancel ALL new platform subscriptions in Stripe
3. Verify ALL WooCommerce subscriptions are active
4. DNS: Point webink.solutions back to WordPress (if changed)
5. Email all users: "We're postponing the upgrade. No billing changes."
6. Post-mortem -- fix issues -- retry later
```

### Point of No Return

The migration becomes harder to reverse after:
- WooCommerce subscriptions are fully cancelled (not just "cancel at period end")
- DNS has been changed and propagated
- WordPress hosting has been decommissioned

**Recommendation:** Keep WordPress hosting active for **90 days** after full cutover.

---

## Appendix A: Migration Tracking Spreadsheet

Create a spreadsheet to track each user's migration:

| Email | Woo Sub ID | Plan | Amount | Stripe Cust ID | New Account | Password Set | Sub Migrated | Verified | Notes |
|-------|-----------|------|--------|----------------|-------------|-------------|-------------|----------|-------|
| client@example.com | 123 | Basic | $31/mo | cus_XXX | -- | -- | -- | -- | Grandfathered rate |

## Appendix B: Email Templates

### Welcome Email (Phase 2)

```
Subject: Your Webink Solutions account has been upgraded

Hi {name},

We've built a brand new platform for managing your Webink services -- 
faster, more features, better experience.

Your billing stays exactly the same. Nothing changes there.

To get started, set your password:
{password_reset_link}

Once you're in, you'll see your dashboard with all your services.

Questions? Reply to this email.

-- The Webink Solutions Team
```

### Migration Complete Email (Phase 3)

```
Subject: Billing update -- your subscription has been moved

Hi {name},

Your subscription has been migrated to our new billing system.

Here's what to know:
-- Plan: {plan_name}
-- Amount: ${amount}/month (unchanged)
-- Next billing date: {next_billing_date}
-- Manage billing: {dashboard_billing_url}

Nothing else changes -- same great service.

Questions? Reply to this email.

-- The Webink Solutions Team
```

---

*Document last updated: 2026-03-31*
*Next review: Before Phase 1 kickoff*

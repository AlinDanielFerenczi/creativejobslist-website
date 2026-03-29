# CreativeJobsList

## What It Is

A job board specialised for creative roles — designers, illustrators, videographers, and similar.
Companies pay a one-time $299 fee to post a listing (active for 30 days). Job seekers browse,
search, and filter for free. Under Venture Chain, no separate legal entity.

**GitHub:** `AlinDanielFerenczi/creativejobslist-website` (personal account, not VC org)
**Status:** Early development — core UI done, job posting workflow incomplete.

## Stack

| Layer | Tech |
|---|---|
| Framework | Nuxt 4.3.1 + Nuxt UI v4.5.1 |
| Language | TypeScript 5.9.3 |
| Styling | Tailwind CSS 4, Nuxt UI (primary: green, neutral: slate) |
| ORM | Prisma 6.19.2 + PostgreSQL |
| Auth | Supabase (@nuxtjs/supabase) |
| Payments | Stripe 20.4.0 |
| Package manager | pnpm |

## Running Locally

```bash
pnpm install
pnpm dev        # http://localhost:3000

# Stripe webhook testing
pnpm stripe:listen
pnpm stripe:trigger   # in another terminal
```

## Database Schema

Single `jobs` table (Prisma + PostgreSQL):
- `id`, `title`, `company_name`, `company_logo`, `location`, `is_remote`
- `salary_min`, `salary_max`, `salary_currency`
- `tags` (string array), `description`
- `status`: `pending_payment` → `published`
- `user_id`, `created_at`

Users managed via Supabase Auth — no users table in Prisma.

## Current State

**Working:** Job listing UI, search/filter/sort, job detail page, auth UI, Stripe checkout session creation, webhook handler for checkout completion.

**Broken / incomplete:**
- Job posting flow: form calls checkout but never persists the job to DB first — no `jobId` passed to Stripe metadata, webhook can't link payment to job
- TypeScript errors: ref typing in `useJobs.ts`, invalid Nuxt UI color props
- Apply/Save buttons are non-functional
- No success/error pages after payment
- No job management dashboard for posters
- No pagination (loads all jobs at once)
- No email notifications
- Missing Supabase `database.types.ts`

## Critical Fix Needed First

The job posting workflow is the core broken piece:
1. Create job in DB with `status: pending_payment` before redirecting to Stripe
2. Pass `jobId` in Stripe checkout metadata
3. Webhook reads `jobId` from metadata and sets `status: published`

## Environment

`.env.example` documents all required vars:
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_PASSWORD`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `DATABASE_URL` (pooled, for runtime), `DIRECT_URL` (direct, for migrations)
- `SITE_URL`

## Ticket Prefix

`CJL-`

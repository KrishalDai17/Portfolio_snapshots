# DR DSLR — Himal Shrestha Photography

Cinematic photography portfolio + private CMS. Next.js (App Router, TypeScript,
Tailwind) on Vercel, Supabase for the database and auth, Cloudinary for all
photo/video storage and delivery.

## What's built (Phases 1–25 of the original spec)

- **Database schema** — full Postgres schema for every entity in the spec
  (`supabase/migrations/0001_init.sql`): media, categories, albums, photos,
  videos, homepage sections, hero slides, about/services/testimonials/stories,
  social links, inquiries, featured pins.
- **Row Level Security** (`supabase/migrations/0002_rls.sql`) — public can
  only read published/visible rows; the single admin (matched against
  `admin_profile`, not just "any logged-in user") has full read/write;
  visitors can only *insert* into `inquiries`, never read/edit/delete them.
- **Auth** — Supabase email/password, server-verified admin check, protected
  `/admin/**` routes via `src/proxy.ts` (Next's renamed middleware
  convention), login/logout Server Actions.
- **Cloudinary** — signed server-side upload helper (no unsigned uploads, API
  secret never touches the browser) and optimized URL/srcset helpers
  (`f_auto,q_auto,dpr_auto`).
- **Admin shell** — dashboard layout/nav for every CMS section in the spec,
  with a real dashboard pulling live counts from Supabase.
- **Media Library** (`/admin/media`) — direct-to-Cloudinary signed uploads
  (drag-and-drop or picker, multi-file), folder tabs, delete (Cloudinary +
  Supabase together, blocked if the asset is still referenced elsewhere).
- **Categories, Homepage Sections, Hero Slides, Services** — true
  drag-and-drop reordering (native HTML5 drag, persisted to `sort_order` via
  a shared `reorderItems` Server Action), plus create/edit/delete/visibility
  toggles.
- **Albums** (`/admin/albums`) — create with category + cover picker,
  publish/hide/feature toggles, delete.
- **Photos** (`/admin/photos`) — attach full metadata (camera/lens/aperture/
  shutter/ISO, tags, location, date, alt text) to uploaded media, assign
  category + album, feature/visibility toggles.
- **Testimonials, Films, Stories/Journal, Social Media, Settings** — full
  CRUD as detailed in the spec (star ratings, Cloudinary/YouTube/Vimeo film
  sources, rich-text stories with SEO fields, per-placement social links,
  WhatsApp/contact/SEO-default settings).
- **About page CRUD** (`/admin/about`) — profile intro/photo plus all six
  item sections (journey, experience, skills, equipment, awards,
  achievements), each with an explicit "demo content" flag.
- **Inquiries inbox** (`/admin/inquiries`) — mark read/unread, delete,
  unread count.
- **Analytics** (`/admin/analytics`) — real database-backed content stats
  (photo/album counts, inquiries this month, photos per category); visitor
  traffic is tracked via `@vercel/analytics`, wired into the root layout —
  view it in your Vercel project dashboard once deployed.
- **Public site** — homepage (fully CMS-driven section order), `/work`
  (filterable masonry gallery + keyboard/swipe lightbox), `/albums` +
  `/albums/[slug]`, `/films` (Cloudinary/YouTube/Vimeo playback), `/stories`
  + `/stories/[slug]` (editorial layout), `/about`, `/services`, `/contact`.
- **SEO** — dynamic per-page metadata, per-album/story Open Graph images
  (falls back to cover image if no explicit OG image is set),
  `sitemap.xml`, `robots.txt` (blocks `/admin/`), Photographer JSON-LD on
  the homepage, BreadcrumbList JSON-LD + visible breadcrumbs on every
  content page.
- **Custom cursor** — desktop-only (auto-disabled on touch via
  `pointer: coarse`), contextual labels (VIEW/EXPLORE/OPEN) on gallery
  thumbnails, hero CTA, and album cards.
- Design system tokens (Manrope + Playfair Display, near-black/champagne
  palette, Ken Burns hero animation, `prefers-reduced-motion` respected).

## What's genuinely not done

- **Never run against live Supabase/Cloudinary.** Everything here has been
  verified with `tsc --noEmit` and a full `next build` across all 29 routes
  in a sandboxed environment with no network access to Supabase or
  Cloudinary — I don't have real credentials for either service. That means
  the code compiles and the logic is sound, but real auth, real uploads, and
  real RLS behavior against your actual project are untested. Run through
  the verification checklist below once you've deployed with real keys.
- **No automated test suite.** No unit/integration/e2e tests were written —
  verification here was type-checking + build success + manual code review,
  not automated coverage.
- Album/category detail pages don't yet have an admin UI for setting a
  *different* image than the cover as the OG image, even though the
  `og_image_id` column and the public-page code both support it — you'd set
  it via SQL/Supabase's table editor for now.
- No Google Analytics integration (Vercel Analytics is wired in; GA is
  scaffolded as an env var `NEXT_PUBLIC_GA_ID` but not yet read anywhere).

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at supabase.com.
2. In the SQL Editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/migrations/0002_rls.sql`.
3. In **Authentication → Users**, create the one admin user (email +
   password). Copy their UUID.
4. Run in the SQL editor:
   ```sql
   insert into admin_profile (id, full_name) values ('<ADMIN_AUTH_UID>', 'Himal Shrestha');
   ```
5. Optionally run `supabase/seed/seed.sql` for starter categories, homepage
   section rows, etc. (One row is explicitly marked `is_demo = true` — edit
   or delete it from the admin panel once real content exists.)
6. Copy your Project URL, anon key, and service_role key from
   **Settings → API**.

### 3. Create a Cloudinary account

1. Create an account at cloudinary.com.
2. Copy your Cloud Name, API Key, and API Secret from the dashboard.
3. (Optional) Pre-create the folder structure under **Media Library**:
   `dr-dslr/{portfolio,albums,hero,profile,stories,services,testimonials,videos}`.

### 4. Environment variables

Copy `.env.example` to `.env.local` and fill in the Supabase and Cloudinary
values from steps 2–3.

**Never commit `.env.local`. Never expose `SUPABASE_SERVICE_ROLE_KEY` or
`CLOUDINARY_API_SECRET` in client code.**

### 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, `/admin/login` for the CMS.

### 6. Push to GitHub → deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add the same environment variables from `.env.local` in Vercel's project
   settings (Production + Preview).
4. Deploy.
5. Set `NEXT_PUBLIC_SITE_URL` to your real domain once configured.

### 7. Verify

- [ ] Admin login works at `/admin/login`; wrong password is rejected
- [ ] `/admin/dashboard` shows live counts (0s until you add content)
- [ ] Uploading a photo in `/admin/media` actually lands in your Cloudinary
      media library and creates a `media` row in Supabase
- [ ] Adding a category → album → photo in the admin makes it appear on
      `/work`, `/albums`, and the homepage's Selected Works / Albums sections
- [ ] Toggling a homepage section off in `/admin/homepage` actually removes
      it from `/`
- [ ] Drag-reordering categories/services/homepage sections/hero slides
      persists after a page refresh
- [ ] Submitting the public contact form creates a row in `inquiries` and
      appears in `/admin/inquiries`
- [ ] A second Supabase user (not the admin) cannot reach `/admin/**` — gets
      redirected to login
- [ ] `/sitemap.xml` and `/robots.txt` resolve correctly on your deployed
      domain

## Stack

Next.js · TypeScript · Tailwind CSS · Framer Motion / GSAP (installed, not
yet used) · Supabase (Postgres + Auth) · Cloudinary · Vercel · GitHub

## Security notes

- RLS is enabled on every table; policies enforce public-read-published /
  admin-full-access / public-insert-only-on-inquiries.
- `src/lib/supabase/server.ts` exposes `createServiceRoleClient()` separately
  from the normal RLS-bound client — only reach for it inside a Server Action
  that has already confirmed the caller is the admin, never based on a
  client-supplied flag.
- Admin route protection happens in `src/proxy.ts` (server-side, not just a
  client-side redirect) and is double-checked against the `admin_profile`
  table, not merely "is anyone logged in".
#   P o r t f o l i o _ s n a p s h o t s  
 
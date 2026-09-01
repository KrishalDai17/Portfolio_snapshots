-- ============================================================================
-- DR DSLR — Initial schema
-- Photography portfolio + CMS for Himal Shrestha
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- admin profile (mirrors auth.users, one row only, enforced by app logic)
-- ----------------------------------------------------------------------------
create table admin_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Himal Shrestha',
  avatar_media_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_admin_profile_updated_at before update on admin_profile
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- site_settings — singleton row of global config
-- ----------------------------------------------------------------------------
create table site_settings (
  id boolean primary key default true constraint single_row check (id),
  brand_name text not null default 'DR DSLR',
  tagline text not null default 'Capturing Moments Beyond Vision',
  logo_media_id uuid,
  whatsapp_number text,
  whatsapp_message text default 'Hello Himal, I would like to inquire about photography for my event.',
  contact_email text,
  contact_phone text,
  contact_location text,
  ga_id text,
  seo_default_title text default 'DR DSLR — Himal Shrestha Photography',
  seo_default_description text default 'Professional photography by Himal Shrestha (DR DSLR) — weddings, portraits, night & light photography in Nepal.',
  og_default_image_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_settings_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- media — every Cloudinary asset, reusable across the whole site
-- ----------------------------------------------------------------------------
create table media (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  secure_url text not null,
  resource_type text not null check (resource_type in ('image','video')),
  format text,
  width int,
  height int,
  bytes bigint,
  folder text,
  alt_text text,
  caption text,
  created_at timestamptz not null default now()
);
create index idx_media_folder on media(folder);
create index idx_media_resource_type on media(resource_type);

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  cover_media_id uuid references media(id) on delete set null,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  og_image_id uuid references media(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_categories_visible_order on categories(is_visible, sort_order);
create trigger trg_categories_updated_at before update on categories
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- albums
-- ----------------------------------------------------------------------------
create table albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid references categories(id) on delete set null,
  cover_media_id uuid references media(id) on delete set null,
  event_date date,
  is_published boolean not null default false,
  is_hidden boolean not null default false,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  og_image_id uuid references media(id) on delete set null,
  canonical_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_albums_published on albums(is_published, is_hidden, sort_order);
create index idx_albums_category on albums(category_id);
create trigger trg_albums_updated_at before update on albums
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- photos
-- ----------------------------------------------------------------------------
create table photos (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references media(id) on delete cascade,
  title text,
  caption text,
  description text,
  alt_text text,
  tags text[] default '{}',
  location text,
  taken_at date,
  category_id uuid references categories(id) on delete set null,
  album_id uuid references albums(id) on delete set null,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  camera text,
  lens text,
  aperture text,
  shutter_speed text,
  iso text,
  show_metadata_publicly boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_photos_category on photos(category_id);
create index idx_photos_album on photos(album_id);
create index idx_photos_visible_order on photos(is_visible, sort_order);
create index idx_photos_featured on photos(is_featured) where is_featured;
create trigger trg_photos_updated_at before update on photos
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- videos / films
-- ----------------------------------------------------------------------------
create table video_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0
);

create table videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  source_type text not null check (source_type in ('cloudinary','youtube','vimeo')),
  media_id uuid references media(id) on delete set null,   -- when source_type = cloudinary
  external_url text,                                        -- when youtube/vimeo
  thumbnail_media_id uuid references media(id) on delete set null,
  category_id uuid references video_categories(id) on delete set null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_videos_published on videos(is_published, sort_order);
create trigger trg_videos_updated_at before update on videos
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- about page: journey / experience / skills / equipment / awards
-- ----------------------------------------------------------------------------
create table about_profile (
  id boolean primary key default true constraint single_row check (id),
  intro text,
  profile_media_id uuid references media(id) on delete set null,
  updated_at timestamptz not null default now()
);
create trigger trg_about_profile_updated_at before update on about_profile
  for each row execute function set_updated_at();

create table about_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('journey','experience','skill','equipment','award','achievement')),
  title text not null,
  subtitle text,
  description text,
  item_date date,
  media_id uuid references media(id) on delete set null,
  is_demo boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_about_items_section on about_items(section, sort_order);

-- ----------------------------------------------------------------------------
-- services
-- ----------------------------------------------------------------------------
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  media_id uuid references media(id) on delete set null,
  price_label text,
  show_price boolean not null default false,
  cta_label text default 'Request a Quote',
  cta_url text,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_services_visible_order on services(is_visible, sort_order);
create trigger trg_services_updated_at before update on services
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- testimonials
-- ----------------------------------------------------------------------------
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_media_id uuid references media(id) on delete set null,
  review text not null,
  rating smallint check (rating between 1 and 5),
  event_type text,
  event_date date,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_testimonials_published on testimonials(is_published, sort_order);

-- ----------------------------------------------------------------------------
-- stories / journal
-- ----------------------------------------------------------------------------
create table stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_media_id uuid references media(id) on delete set null,
  intro text,
  content_richtext text,   -- stored as HTML/markdown
  location text,
  story_date date,
  tags text[] default '{}',
  is_published boolean not null default false,
  seo_title text,
  seo_description text,
  og_image_id uuid references media(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_stories_published on stories(is_published, story_date desc);
create trigger trg_stories_updated_at before update on stories
  for each row execute function set_updated_at();

create table story_media (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  media_id uuid not null references media(id) on delete cascade,
  caption text,
  sort_order int not null default 0
);
create index idx_story_media_story on story_media(story_id, sort_order);

-- ----------------------------------------------------------------------------
-- social links
-- ----------------------------------------------------------------------------
create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,          -- instagram, facebook, tiktok, youtube, whatsapp, messenger, viber, email, phone
  label text,
  url text not null,
  is_enabled boolean not null default true,
  placements text[] not null default '{}',  -- header, hero, about, contact, footer, floating
  sort_order int not null default 0
);
create index idx_social_links_enabled on social_links(is_enabled, sort_order);

-- ----------------------------------------------------------------------------
-- homepage sections (drag-and-drop ordering, enable/disable)
-- ----------------------------------------------------------------------------
create table homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,  -- hero, selected_works, albums, about, services, films, stories, testimonials, social, contact
  title text,
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  settings jsonb not null default '{}'::jsonb  -- section-specific config (e.g. how many items to show)
);
create index idx_homepage_sections_order on homepage_sections(sort_order);

-- ----------------------------------------------------------------------------
-- hero slides
-- ----------------------------------------------------------------------------
create table hero_slides (
  id uuid primary key default gen_random_uuid(),
  media_id uuid references media(id) on delete set null,
  heading text,
  subtitle text,
  cta_label text,
  cta_url text,
  duration_ms int not null default 6000,
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_hero_slides_order on hero_slides(is_enabled, sort_order);

-- ----------------------------------------------------------------------------
-- inquiries (contact / request a quote)
-- ----------------------------------------------------------------------------
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  whatsapp text,
  event_type text,
  event_date date,
  location text,
  budget text,
  service_id uuid references services(id) on delete set null,
  message text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_inquiries_read on inquiries(is_read, created_at desc);

-- ----------------------------------------------------------------------------
-- featured pins (explicit, orderable "featured work" outside per-row flags)
-- ----------------------------------------------------------------------------
create table featured_photos (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references photos(id) on delete cascade,
  sort_order int not null default 0,
  unique (photo_id)
);

create table featured_albums (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  sort_order int not null default 0,
  unique (album_id)
);

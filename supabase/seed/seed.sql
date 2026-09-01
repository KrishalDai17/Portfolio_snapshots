-- ============================================================================
-- DR DSLR — Seed data
-- Run against a fresh dev database AFTER migrations, and AFTER you've created
-- the one admin user in Supabase Auth (see README "Configure Supabase Auth").
-- Replace <ADMIN_AUTH_UID> below with that user's UUID from auth.users.
-- Demo/placeholder content is marked is_demo = true where the schema supports it.
-- ============================================================================

insert into site_settings (id, brand_name, tagline)
values (true, 'DR DSLR', 'Capturing Moments Beyond Vision')
on conflict (id) do nothing;

insert into about_profile (id, intro)
values (true, 'Himal Shrestha is a photographer based in Nepal. Replace this introduction from the admin panel.')
on conflict (id) do nothing;

insert into homepage_sections (section_key, title, is_enabled, sort_order) values
  ('hero', 'Hero Slider', true, 0),
  ('selected_works', 'Selected Works', true, 1),
  ('albums', 'Featured Albums', true, 2),
  ('about', 'About Himal', true, 3),
  ('services', 'Services', true, 4),
  ('films', 'Featured Films', true, 5),
  ('stories', 'Photography Stories', true, 6),
  ('testimonials', 'Testimonials', true, 7),
  ('social', 'Social Media', true, 8),
  ('contact', 'Contact CTA', true, 9)
on conflict (section_key) do nothing;

insert into categories (name, slug, sort_order) values
  ('Wedding', 'wedding', 0),
  ('Portrait', 'portrait', 1),
  ('Night', 'night', 2),
  ('Light', 'light', 3),
  ('Nature', 'nature', 4),
  ('Travel', 'travel', 5),
  ('Events', 'events', 6)
on conflict (slug) do nothing;

insert into video_categories (name, slug, sort_order) values
  ('Wedding Films', 'wedding-films', 0),
  ('Behind the Scenes', 'behind-the-scenes', 1),
  ('Travel Films', 'travel-films', 2),
  ('Photography Reels', 'photography-reels', 3),
  ('Commercial Work', 'commercial-work', 4)
on conflict (slug) do nothing;

-- Example placeholder award — CLEARLY a demo row, delete or edit from admin panel
insert into about_items (section, title, subtitle, is_demo, sort_order) values
  ('award', 'Sample Award (edit or remove me)', 'Demo content — not a real award', true, 0);

-- After creating your admin auth user, run:
-- insert into admin_profile (id, full_name) values ('<ADMIN_AUTH_UID>', 'Himal Shrestha');

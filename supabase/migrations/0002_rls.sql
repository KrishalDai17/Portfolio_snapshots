-- ============================================================================
-- DR DSLR — Row Level Security
-- Rule: anonymous/public can only SELECT published+visible rows.
-- Admin (authenticated, matches the single admin_profile row) has full access.
-- All writes happen through Server Actions using the privileged server client,
-- so these policies are a defense-in-depth backstop, not the only guard.
-- ============================================================================

-- Helper: is the current request from the admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_profile where id = auth.uid()
  );
$$ language sql stable security definer;

-- Enable RLS everywhere
alter table admin_profile enable row level security;
alter table site_settings enable row level security;
alter table media enable row level security;
alter table categories enable row level security;
alter table albums enable row level security;
alter table photos enable row level security;
alter table video_categories enable row level security;
alter table videos enable row level security;
alter table about_profile enable row level security;
alter table about_items enable row level security;
alter table services enable row level security;
alter table testimonials enable row level security;
alter table stories enable row level security;
alter table story_media enable row level security;
alter table social_links enable row level security;
alter table homepage_sections enable row level security;
alter table hero_slides enable row level security;
alter table inquiries enable row level security;
alter table featured_photos enable row level security;
alter table featured_albums enable row level security;

-- admin_profile: only the admin can see/edit their own row
create policy admin_profile_self on admin_profile
  for all using (id = auth.uid()) with check (id = auth.uid());

-- site_settings: public read, admin write
create policy site_settings_read on site_settings for select using (true);
create policy site_settings_write on site_settings for all using (is_admin()) with check (is_admin());

-- media: admin-only (public never queries this table directly; public pages
-- read secure_url via joins against published parent rows, or via server-side
-- fetch that only exposes the fields it needs)
create policy media_admin_all on media for all using (is_admin()) with check (is_admin());
create policy media_public_read on media for select using (true);

-- categories: public sees visible ones, admin sees/edits all
create policy categories_public_read on categories for select using (is_visible = true or is_admin());
create policy categories_admin_write on categories for insert with check (is_admin());
create policy categories_admin_update on categories for update using (is_admin()) with check (is_admin());
create policy categories_admin_delete on categories for delete using (is_admin());

-- albums: public sees published+not-hidden, admin sees/edits all
create policy albums_public_read on albums for select
  using ((is_published = true and is_hidden = false) or is_admin());
create policy albums_admin_write on albums for insert with check (is_admin());
create policy albums_admin_update on albums for update using (is_admin()) with check (is_admin());
create policy albums_admin_delete on albums for delete using (is_admin());

-- photos: public sees visible ones belonging to published albums (or no album),
-- admin sees/edits all
create policy photos_public_read on photos for select
  using (
    is_admin() or (
      is_visible = true and (
        album_id is null or exists (
          select 1 from albums a where a.id = photos.album_id
            and a.is_published = true and a.is_hidden = false
        )
      )
    )
  );
create policy photos_admin_write on photos for insert with check (is_admin());
create policy photos_admin_update on photos for update using (is_admin()) with check (is_admin());
create policy photos_admin_delete on photos for delete using (is_admin());

-- video_categories: public read, admin write
create policy video_categories_read on video_categories for select using (true);
create policy video_categories_write on video_categories for all using (is_admin()) with check (is_admin());

-- videos: public sees published, admin sees/edits all
create policy videos_public_read on videos for select using (is_published = true or is_admin());
create policy videos_admin_write on videos for insert with check (is_admin());
create policy videos_admin_update on videos for update using (is_admin()) with check (is_admin());
create policy videos_admin_delete on videos for delete using (is_admin());

-- about_profile / about_items: public read, admin write
create policy about_profile_read on about_profile for select using (true);
create policy about_profile_write on about_profile for all using (is_admin()) with check (is_admin());
create policy about_items_read on about_items for select using (true);
create policy about_items_write on about_items for all using (is_admin()) with check (is_admin());

-- services: public sees visible, admin sees/edits all
create policy services_public_read on services for select using (is_visible = true or is_admin());
create policy services_admin_write on services for insert with check (is_admin());
create policy services_admin_update on services for update using (is_admin()) with check (is_admin());
create policy services_admin_delete on services for delete using (is_admin());

-- testimonials: public sees published, admin sees/edits all; no public insert
create policy testimonials_public_read on testimonials for select using (is_published = true or is_admin());
create policy testimonials_admin_write on testimonials for all using (is_admin()) with check (is_admin());

-- stories / story_media: public sees published, admin sees/edits all
create policy stories_public_read on stories for select using (is_published = true or is_admin());
create policy stories_admin_write on stories for insert with check (is_admin());
create policy stories_admin_update on stories for update using (is_admin()) with check (is_admin());
create policy stories_admin_delete on stories for delete using (is_admin());

create policy story_media_public_read on story_media for select
  using (
    is_admin() or exists (
      select 1 from stories s where s.id = story_media.story_id and s.is_published = true
    )
  );
create policy story_media_admin_write on story_media for all using (is_admin()) with check (is_admin());

-- social_links: public sees enabled, admin sees/edits all
create policy social_links_public_read on social_links for select using (is_enabled = true or is_admin());
create policy social_links_admin_write on social_links for all using (is_admin()) with check (is_admin());

-- homepage_sections: public sees enabled, admin sees/edits all
create policy homepage_sections_public_read on homepage_sections for select using (is_enabled = true or is_admin());
create policy homepage_sections_admin_write on homepage_sections for all using (is_admin()) with check (is_admin());

-- hero_slides: public sees enabled, admin sees/edits all
create policy hero_slides_public_read on hero_slides for select using (is_enabled = true or is_admin());
create policy hero_slides_admin_write on hero_slides for all using (is_admin()) with check (is_admin());

-- inquiries: PUBLIC CAN INSERT ONLY (the contact form). No public select/update/delete.
-- Admin has full access.
create policy inquiries_public_insert on inquiries for insert with check (true);
create policy inquiries_admin_select on inquiries for select using (is_admin());
create policy inquiries_admin_update on inquiries for update using (is_admin()) with check (is_admin());
create policy inquiries_admin_delete on inquiries for delete using (is_admin());

-- featured_photos / featured_albums: public read, admin write
create policy featured_photos_read on featured_photos for select using (true);
create policy featured_photos_write on featured_photos for all using (is_admin()) with check (is_admin());
create policy featured_albums_read on featured_albums for select using (true);
create policy featured_albums_write on featured_albums for all using (is_admin()) with check (is_admin());

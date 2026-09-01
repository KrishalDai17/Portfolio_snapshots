/**
 * Hand-written types matching supabase/migrations/0001_init.sql.
 * Once the project is linked to a live Supabase project, replace/regenerate
 * this file with:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 * Kept minimal and hand-written for now so the app compiles before that link
 * exists.
 */

export type Media = {
  id: string;
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  folder: string | null;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_media_id: string | null;
  is_visible: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  cover_media_id: string | null;
  event_date: string | null;
  is_published: boolean;
  is_hidden: boolean;
  is_featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_id: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Photo = {
  id: string;
  media_id: string;
  title: string | null;
  caption: string | null;
  description: string | null;
  alt_text: string | null;
  tags: string[];
  location: string | null;
  taken_at: string | null;
  category_id: string | null;
  album_id: string | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  camera: string | null;
  lens: string | null;
  aperture: string | null;
  shutter_speed: string | null;
  iso: string | null;
  show_metadata_publicly: boolean;
  created_at: string;
  updated_at: string;
};

export type HeroSlide = {
  id: string;
  media_id: string | null;
  heading: string | null;
  subtitle: string | null;
  cta_label: string | null;
  cta_url: string | null;
  duration_ms: number;
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
};

export type HomepageSection = {
  id: string;
  section_key: string;
  title: string | null;
  is_enabled: boolean;
  sort_order: number;
  settings: Record<string, unknown>;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  event_type: string | null;
  event_date: string | null;
  location: string | null;
  budget: string | null;
  service_id: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
};

// Minimal `Database` shape so @supabase/ssr generics compile. Extend table by
// table as each area is built out, or replace with generated types.
export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, unknown> }>;
  };
};

// ---------------------------------------------------------------------------
// Proper Database generic shape for @supabase/supabase-js type inference.
// Extend each table's Insert/Update types as admin CRUD forms are built.
// ---------------------------------------------------------------------------
type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface DatabaseSchema {
  public: {
    Tables: {
      media: TableDef<Media>;
      categories: TableDef<Category>;
      albums: TableDef<Album>;
      photos: TableDef<Photo>;
      hero_slides: TableDef<HeroSlide>;
      homepage_sections: TableDef<HomepageSection>;
      inquiries: TableDef<Inquiry>;
      admin_profile: TableDef<{ id: string; full_name: string; avatar_media_id: string | null; created_at: string; updated_at: string }>;
      site_settings: TableDef<{
        id: boolean;
        brand_name: string;
        tagline: string;
        logo_media_id: string | null;
        whatsapp_number: string | null;
        whatsapp_message: string | null;
        contact_email: string | null;
        contact_phone: string | null;
        contact_location: string | null;
        ga_id: string | null;
        seo_default_title: string | null;
        seo_default_description: string | null;
        og_default_image_id: string | null;
        created_at: string;
        updated_at: string;
      }>;
      about_profile: TableDef<{ id: boolean; intro: string | null; profile_media_id: string | null; updated_at: string }>;
      about_items: TableDef<{
        id: string;
        section: "journey" | "experience" | "skill" | "equipment" | "award" | "achievement";
        title: string;
        subtitle: string | null;
        description: string | null;
        item_date: string | null;
        media_id: string | null;
        is_demo: boolean;
        sort_order: number;
        created_at: string;
      }>;
      services: TableDef<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        media_id: string | null;
        price_label: string | null;
        show_price: boolean;
        cta_label: string | null;
        cta_url: string | null;
        is_visible: boolean;
        sort_order: number;
        created_at: string;
        updated_at: string;
      }>;
      testimonials: TableDef<{
        id: string;
        client_name: string;
        client_media_id: string | null;
        review: string;
        rating: number | null;
        event_type: string | null;
        event_date: string | null;
        is_published: boolean;
        sort_order: number;
        created_at: string;
      }>;
      stories: TableDef<{
        id: string;
        title: string;
        slug: string;
        cover_media_id: string | null;
        intro: string | null;
        content_richtext: string | null;
        location: string | null;
        story_date: string | null;
        tags: string[];
        is_published: boolean;
        seo_title: string | null;
        seo_description: string | null;
        og_image_id: string | null;
        created_at: string;
        updated_at: string;
      }>;
      story_media: TableDef<{ id: string; story_id: string; media_id: string; caption: string | null; sort_order: number }>;
      video_categories: TableDef<{ id: string; name: string; slug: string; sort_order: number }>;
      videos: TableDef<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        source_type: "cloudinary" | "youtube" | "vimeo";
        media_id: string | null;
        external_url: string | null;
        thumbnail_media_id: string | null;
        category_id: string | null;
        is_published: boolean;
        is_featured: boolean;
        sort_order: number;
        seo_title: string | null;
        seo_description: string | null;
        created_at: string;
        updated_at: string;
      }>;
      social_links: TableDef<{
        id: string;
        platform: string;
        label: string | null;
        url: string;
        is_enabled: boolean;
        placements: string[];
        sort_order: number;
      }>;
      featured_photos: TableDef<{ id: string; photo_id: string; sort_order: number }>;
      featured_albums: TableDef<{ id: string; album_id: string; sort_order: number }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

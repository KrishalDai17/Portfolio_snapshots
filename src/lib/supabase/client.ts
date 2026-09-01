import { createBrowserClient } from "@supabase/ssr";
import type { DatabaseSchema } from "@/types/database";

/**
 * Browser-side Supabase client. Uses the public anon key only.
 * Never import the service-role key here.
 */
export function createClient() {
  return createBrowserClient<DatabaseSchema>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

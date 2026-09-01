import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { DatabaseSchema } from "@/types/database";

/**
 * Server-side Supabase client for use inside Server Components, Server
 * Actions, and Route Handlers. Runs under RLS as the current session user
 * (anon or the single admin), read from cookies. Never carries the
 * service-role key.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<DatabaseSchema>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no request context.
            // Safe to ignore when middleware is refreshing sessions.
          }
        },
      },
    }
  );
}

/**
 * Privileged server-only client using the service-role key. Bypasses RLS
 * entirely. Only ever import this inside Server Actions / Route Handlers
 * that have already verified the caller is the authenticated admin — never
 * expose it to a Client Component, and never call it based on client-sent
 * flags alone.
 */
export function createServiceRoleClient() {
  if (typeof window !== "undefined") {
    throw new Error("createServiceRoleClient must never be called in the browser");
  }
  return createSupabaseJsClient<DatabaseSchema>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

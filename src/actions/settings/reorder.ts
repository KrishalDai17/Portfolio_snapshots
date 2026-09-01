"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const REORDERABLE_TABLES = [
  "categories",
  "homepage_sections",
  "hero_slides",
  "services",
  "albums",
  "photos",
] as const;

type ReorderableTable = (typeof REORDERABLE_TABLES)[number];

/**
 * Persists a new drag-and-drop order for any sortable table. `orderedIds`
 * is the full list of row ids in their new top-to-bottom order; each row's
 * sort_order is set to its index. Only tables in REORDERABLE_TABLES are
 * accepted, so this can't be pointed at an arbitrary table from the client.
 */
export async function reorderItems(table: ReorderableTable, orderedIds: string[], revalidate: string[]) {
  if (!REORDERABLE_TABLES.includes(table)) return;

  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from(table).update({ sort_order: index }).eq("id", id))
  );

  for (const path of revalidate) revalidatePath(path);
}

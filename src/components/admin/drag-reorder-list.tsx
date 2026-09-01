"use client";

import { useState, useTransition, type ReactNode } from "react";
import { reorderItems } from "@/actions/settings/reorder";

type ReorderableTable = "categories" | "homepage_sections" | "hero_slides" | "services" | "albums" | "photos";

type Props<T extends { id: string }> = {
  table: ReorderableTable;
  items: T[];
  revalidatePaths: string[];
  renderItem: (item: T, dragHandleProps: { draggable: true; onDragStart: () => void }) => ReactNode;
};

/**
 * Renders `items` as a reorderable list with native HTML5 drag-and-drop.
 * Each row's own onDragStart/onDragOver/onDrop wires the drag; the caller
 * only needs to attach the returned drag handle props to whatever element
 * should act as the grab handle (usually a small ⠿ icon).
 */
export default function DragReorderList<T extends { id: string }>({
  table,
  items,
  revalidatePaths,
  renderItem,
}: Props<T>) {
  const [order, setOrder] = useState(items.map((i) => i.id));
  const [isPending, startTransition] = useTransition();
  const [dragId, setDragId] = useState<string | null>(null);

  const orderedItems = order
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is T => Boolean(i));

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...order];
    const fromIndex = next.indexOf(dragId);
    const toIndex = next.indexOf(targetId);
    next.splice(fromIndex, 1);
    next.splice(toIndex, 0, dragId);
    setOrder(next);
    setDragId(null);
    startTransition(() => {
      reorderItems(table, next, revalidatePaths);
    });
  }

  return (
    <div className={isPending ? "opacity-70 transition-opacity" : ""}>
      {orderedItems.map((item) => (
        <div
          key={item.id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(item.id)}
        >
          {renderItem(item, {
            draggable: true,
            onDragStart: () => setDragId(item.id),
          })}
        </div>
      ))}
    </div>
  );
}

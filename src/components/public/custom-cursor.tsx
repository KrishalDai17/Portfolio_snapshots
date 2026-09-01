"use client";

import { useEffect, useState } from "react";

/**
 * Elegant custom cursor for desktop pointer devices. Reads
 * data-cursor="VIEW" (etc.) off whatever element is under the pointer and
 * shows that as a label. No-ops entirely on touch devices so it never
 * interferes with tap targets or accessibility.
 */
export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    function handleMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      setLabel(target?.dataset.cursor ?? null);
    }
    function handleLeave() {
      setVisible(false);
    }

    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[200] transition-transform duration-150 ease-out"
      style={{
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className={`rounded-full border border-[#c9a24b]/70 flex items-center justify-center transition-all duration-200 ${
          label ? "w-16 h-16 bg-black/60" : "w-3 h-3 bg-[#c9a24b]"
        }`}
      >
        {label && <span className="text-[9px] uppercase tracking-wider text-[#f5f0e6]">{label}</span>}
      </div>
    </div>
  );
}

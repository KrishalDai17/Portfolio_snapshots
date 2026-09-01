"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="text-[#f5f0e6] text-sm uppercase tracking-widest"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-serif text-2xl text-[#f5f0e6]"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setOpen(false)}
            className="mt-8 text-xs uppercase tracking-widest text-neutral-500"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

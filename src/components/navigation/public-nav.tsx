import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MobileNav from "./mobile-nav";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/albums", label: "Albums" },
  { href: "/films", label: "Films" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default async function PublicNav() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("brand_name").maybeSingle();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
      <Link href="/" className="font-serif tracking-widest text-lg text-[#f5f0e6]">
        {settings?.brand_name ?? "DR DSLR"}
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs uppercase tracking-[0.15em] text-neutral-300 hover:text-[#c9a24b] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <MobileNav links={NAV_LINKS} />
    </header>
  );
}

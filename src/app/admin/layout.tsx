import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/albums", label: "Albums" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/films", label: "Films" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/social", label: "Social Media" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e6] flex">
      <aside className="w-60 shrink-0 border-r border-neutral-900 flex flex-col">
        <div className="px-5 py-6 border-b border-neutral-900">
          <p className="font-serif tracking-widest text-sm">DR DSLR</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">CMS</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-2 text-sm text-neutral-400 hover:text-[#f5f0e6] hover:bg-neutral-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="p-4 border-t border-neutral-900">
          <button
            type="submit"
            className="w-full text-left text-sm text-neutral-500 hover:text-red-400 transition-colors"
          >
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

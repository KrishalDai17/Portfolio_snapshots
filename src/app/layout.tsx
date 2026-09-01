import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "DR DSLR — Himal Shrestha Photography",
    template: "%s | DR DSLR",
  },
  description:
    "Professional photography by Himal Shrestha (DR DSLR) — weddings, portraits, night & light photography in Nepal.",
  openGraph: {
    type: "website",
    siteName: "DR DSLR",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="bg-[#0a0a0a] text-[#f5f0e6] antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

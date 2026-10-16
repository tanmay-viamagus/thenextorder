import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Josefin_Sans, Outfit } from "next/font/google";
import "./globals.css";

// Brand faces verified on the live ViaMagus sites — see docs/brand-audit.md.
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-josefin",
  display: "swap",
});
// ViaMagus Select's own face, used only for its wordmark and panel.
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", preload: false });

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

const title = "The NEXT Order | ViaMagus";
const description =
  "A new era of enterprise engineering, intelligent operations and technology talent. Discover The NEXT Order by ViaMagus.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description,
  applicationName: "The NEXT Order",
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "The NEXT Order · ViaMagus",
    locale: "en_IN",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "The NEXT Order — an invitation from ViaMagus" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fonts = [outfit, geistMono, josefin, archivo].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <head>
        {/* Flags JS before first paint so scroll-driven reveals never hide content without JS. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Josefin_Sans, Outfit } from "next/font/google";
import { description } from "@/content/story";
import { siteUrl } from "@/lib/site-url";
import { JsFlag } from "@/components/JsFlag";
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

const title = "The NEXT Order — an invitation for India’s GCC leaders | ViaMagus";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description,
  applicationName: "The NEXT Order",
  alternates: { canonical: "/" },
  authors: [{ name: "ViaMagus", url: "https://viamagus.com/" }],
  keywords: ["GCC", "global capability centre", "GCC leaders India", "The NEXT Order", "ViaMagus", "Velocity AI", "Synthia AI", "ViaMagus Select"],
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    siteName: "The NEXT Order · ViaMagus",
    locale: "en_IN",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The NEXT Order — an invitation from ViaMagus for India’s GCC leaders" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ec",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fonts = [outfit, geistMono, josefin, archivo].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <body>
        <JsFlag />
        {children}
      </body>
    </html>
  );
}

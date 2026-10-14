import type { Metadata } from "next";
import { ViaMagusLogo } from "@/components/Brand";
import { hook } from "@/content/story";

// Internal 1200×630 composition, screenshotted to public/og-image.png (see README).
export const metadata: Metadata = { title: "OG card", robots: { index: false, follow: false } };

export default function OgCard() {
  return (
    <div className="og">
      <div className="ts-wrap">
        <div className="ts is-ready is-sorted">
          <span className="ts-line">The Next</span>
          <span className="ts-line">Order</span>
        </div>
      </div>
      <div className="og__foot">
        <p className="og__line">{hook}</p>
        <ViaMagusLogo />
      </div>
    </div>
  );
}

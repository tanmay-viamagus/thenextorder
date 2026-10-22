import type { Metadata } from "next";
import { ViaMagusLogo } from "@/components/Brand";
import { ShiftRing } from "@/components/clock/ShiftRing";

// Internal 1200×630 composition, screenshotted to public/og-image.jpg (see README).
export const metadata: Metadata = { title: "OG card", robots: { index: false, follow: false } };

export default function OgCard() {
  return (
    <div className="og">
      <div className="og__clock">
        <ShiftRing />
      </div>
      <p className="og__k">An invite-only symposium · 3 December 2026 · T-Hub, Hyderabad</p>
      <div className="og__t" aria-label="The NEXT Order">
        <div className="og__l og__l--below">
          <span>THE NEXT</span>
          <span>ORDER.</span>
        </div>
        <div className="og__l og__l--above" aria-hidden="true">
          <span>THE NEXT</span>
          <span>ORDER.</span>
        </div>
        <span className="og__cut" aria-hidden="true" />
      </div>
      <div className="og__foot">
        <p className="og__q">The next order of talent, technology and leadership.</p>
        <ViaMagusLogo />
      </div>
    </div>
  );
}

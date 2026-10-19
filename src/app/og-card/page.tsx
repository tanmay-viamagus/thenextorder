import type { Metadata } from "next";
import { ViaMagusLogo } from "@/components/Brand";
import { StillClock } from "@/components/clock/Clock";

// Internal 1200×630 composition, screenshotted to public/og-image.jpg (see README).
export const metadata: Metadata = { title: "OG card", robots: { index: false, follow: false } };

export default function OgCard() {
  return (
    <div className="og">
      <div className="og__clock">
        {/* a minute before the hour */}
        <StillClock h={11} m={59} s={8} />
      </div>
      <p className="og__k">An invitation from ViaMagus</p>
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
        <p className="og__q">An invitation for India’s GCC leaders.</p>
        <ViaMagusLogo />
      </div>
    </div>
  );
}

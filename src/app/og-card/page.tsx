import type { Metadata } from "next";
import { ViaMagusLogo } from "@/components/Brand";

// Internal 1200×630 composition, screenshotted to public/og-image.jpg (see README).
export const metadata: Metadata = { title: "OG card", robots: { index: false, follow: false } };

export default function OgCard() {
  return (
    <div className="og">
      <p className="og__k">An invitation from ViaMagus · For India’s GCC leaders</p>
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
        <p className="og__q">Where was your centre, where is it now — and where could it go next?</p>
        <ViaMagusLogo />
      </div>
    </div>
  );
}

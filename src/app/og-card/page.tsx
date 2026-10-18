import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ViaMagusLogo } from "@/components/Brand";

// Internal 1200×630 composition, screenshotted to public/og-image.jpg (see README).
export const metadata: Metadata = { title: "OG card", robots: { index: false, follow: false } };

export default function OgCard() {
  return (
    <div className="og">
      <div className="fld" aria-hidden="true">
        <div className="fld__below" />
        <div className="fld__above">
          <span className="fc" style={{ "--c": 13, "--r": 0, "--w": 2, "--h": 1 } as CSSProperties} />
          <span className="fc" style={{ "--c": 16, "--r": 1, "--w": 1, "--h": 1 } as CSSProperties} />
          <span className="fc" style={{ "--c": 3, "--r": 0, "--w": 1, "--h": 1 } as CSSProperties} />
        </div>
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

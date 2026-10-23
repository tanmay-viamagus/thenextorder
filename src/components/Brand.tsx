import Image from "next/image";

/** Official Viamagus mark (viamagus.com/viamagus-logo.svg), inherits currentColor. */
export function ViaMagusMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30.4941 11.8959" aria-hidden="true" focusable="false">
      <path d="M0,0l6.7765,11.8958l6.7764,-11.8958z" fill="currentColor" />
      <path d="M23.7177,0l-3.3881,5.9479l-3.3882,-5.9479l-6.7764,11.8955h20.3291z" fill="currentColor" />
    </svg>
  );
}

/** Mark + "viamagus" in Josefin Sans 500 — the lockup used across Viamagus sites. */
export function ViaMagusLogo({ href, className = "" }: { href?: string; className?: string }) {
  const inner = (
    <>
      <ViaMagusMark />
      <span>viamagus</span>
    </>
  );
  return href ? (
    <a className={`vm-logo ${className}`} href={href} aria-label="Viamagus">
      {inner}
    </a>
  ) : (
    <span className={`vm-logo ${className}`} role="img" aria-label="Viamagus">
      {inner}
    </span>
  );
}

/** LinkedIn's "in" mark, in currentColor — the link around it carries the name. */
export function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
      />
    </svg>
  );
}

/** Velocity AI has no logo file on the official site; its name is set in Outfit with the official gradient. */
export function VelocityWordmark() {
  return <span className="wm-velocity">Velocity AI</span>;
}

export function SynthiaLogo({ height = 40 }: { height?: number }) {
  return (
    <Image
      className="wm-synthia"
      src="/brand/synthia-ai-logo-white.svg"
      alt="Synthia AI"
      width={Math.round((187 / 33) * height)}
      height={height}
      style={{ height, width: "auto" }}
      unoptimized
    />
  );
}

/** Viamagus Select wordmark, following .wordmark on viamagusselect.ai (Archivo 700 + "select" 400 @ 62%). */
export function SelectWordmark() {
  return (
    <span className="wm-select" role="img" aria-label="Viamagus Select">
      <b>Viamagus</b> <span>select</span>
    </span>
  );
}

/** Hyderabad Mavericks — the partner's own logo (colour, for dark grounds), from the brochure. */
export function MavericksLogo({
  className,
  height = 30,
  tone = "light",
}: {
  className?: string;
  height?: number;
  /** light lettering for dark grounds; ink lettering (teal M kept) for light ones */
  tone?: "light" | "ink";
}) {
  return (
    <Image
      className={className}
      src={tone === "ink" ? "/brand/hyderabad-mavericks-ink.png" : "/brand/hyderabad-mavericks.png"}
      alt="Hyderabad Mavericks"
      width={Math.round((height * 640) / 133)}
      height={height}
    />
  );
}

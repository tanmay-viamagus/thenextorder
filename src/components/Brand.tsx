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

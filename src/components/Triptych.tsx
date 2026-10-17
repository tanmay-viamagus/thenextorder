import type { CSSProperties } from "react";
import { forces, type ForceKey } from "@/content/story";
import { SelectWordmark, SynthiaLogo, VelocityWordmark } from "./Brand";
import { Proof } from "./Proof";

const MARK: Record<ForceKey, React.ReactNode> = {
  velocity: <VelocityWordmark />,
  synthia: <SynthiaLogo height={34} />,
  select: <SelectWordmark />,
};

/**
 * Three shutters on one thread. `--p` (0 → 1) on the root drops them in turn:
 * the site drives it from scroll, the film from its clock. When all three are
 * down the thread lights and each shutter's demo starts (`.is-complete`).
 */
export function Triptych({ mode = "site", style }: { mode?: "site" | "film"; style?: CSSProperties }) {
  return (
    <div className={`tri tri--${mode}`} style={style}>
      <span className="tri__rail" aria-hidden="true" />
      {forces.map((f, k) => (
        <div key={f.key} className={`tri__col tri__col--${f.key}`} style={{ "--k": k } as CSSProperties}>
          <span className="tri__cord" aria-hidden="true" />
          <span className="tri__handle" aria-hidden="true" />
          <article className={`shutter shutter--${f.key}`} aria-label={`${f.verb} — ${f.name}`}>
            <p className="shutter__verb">{f.verb}.</p>
            <div className="shutter__mark">{MARK[f.key]}</div>
            <div className="shutter__visual">
              <Proof f={f} />
            </div>
            <div className="shutter__copy">
              <h3 className="shutter__claim">{f.claim}</h3>
              <p className="shutter__detail">{f.detail}</p>
              {mode === "site" ? (
                <a className="shutter__link" href={f.href} target="_blank" rel="noopener noreferrer">
                  {f.source} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}

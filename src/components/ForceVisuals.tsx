import type { CSSProperties } from "react";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Velocity AI — twelve weeks, two delivery rhythms. */
export function VelocityVisual() {
  const weeks = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="fv fv-velocity" aria-hidden="true">
      <div className="fv-row">
        <span className="fv-rowlabel">Typical quarter</span>
        <div className="fv-weeks">
          {weeks.map((w) => (
            <i key={w} className={w === 11 ? "wk wk--release-old" : "wk"} />
          ))}
        </div>
      </div>
      <div className="fv-row">
        <span className="fv-rowlabel fv-rowlabel--vel">Velocity AI</span>
        <div className="fv-weeks">
          {weeks.map((w) => (
            <i key={w} className="wk wk--ship" style={v({ "--w": w })} />
          ))}
        </div>
      </div>
      <div className="fv-axis">
        <span>Week 1</span>
        <span>Week 12</span>
      </div>
    </div>
  );
}

/** Synthia AI — a governed run: the AI stops at the checkpoint and waits for a person. */
export function SynthiaVisual() {
  const steps = ["Input", "Extract", "Check SOP", "Sign-off", "Act"];
  const log = ["AI · input received", "AI · fields extracted", "AI · checked against SOP", "Reviewer · approved", "AI · action taken"];
  return (
    <div className="fv fv-synthia" aria-hidden="true">
      <div className="fv-track">
        <span className="fv-rail" />
        <span className="fv-token" />
        {steps.map((s, i) => (
          <span key={s} className={`fv-step${i === 3 ? " fv-step--gate" : ""}`} style={v({ "--s": i })}>
            <span className="fv-node">
              {i === 3 ? (
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8.5" r="3.6" />
                  <path d="M5.5 19.5c.8-3.6 3.4-5.3 6.5-5.3s5.7 1.7 6.5 5.3" />
                </svg>
              ) : null}
            </span>
            <span className="fv-steplabel">{s}</span>
          </span>
        ))}
      </div>
      <ol className="fv-log">
        {log.map((l, i) => (
          <li key={l} style={v({ "--l": i })}>
            <b>✓</b> {l}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** ViaMagus Select — fifty CVs in, three people out. */
export function SelectVisual() {
  const picks = new Set([12, 27, 41]);
  return (
    <div className="fv fv-select" aria-hidden="true">
      <div className="fv-cvs">
        {Array.from({ length: 50 }, (_, i) => (
          <i key={i} className={picks.has(i) ? "cv cv--pick" : "cv"} style={v({ "--c": (i * 17) % 50 })} />
        ))}
      </div>
      <div className="fv-count">
        <span className="fv-count__in">50 CVs</span>
        <span className="fv-count__arrow">→</span>
        <span className="fv-count__out">3–5 to hire</span>
        <span className="fv-count__clock">48h</span>
      </div>
    </div>
  );
}

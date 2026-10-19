import type { CSSProperties } from "react";

/**
 * One diagram per practice, each showing how that practice works — drawn from
 * the official page's own claims, never from invented results. Each animates
 * once when it scrolls into view and is complete without motion.
 */
const v = (name: string, value: number | string): CSSProperties => ({ [`--${name}` as string]: value });

/** Velocity AI — "Three-month timelines become three-to-four weeks, with a shippable submodule delivered every single Friday." */
export function VelocityMech() {
  return (
    <figure className="mech mech--velocity" data-reveal>
      <div className="vm" role="img" aria-label="A three-month timeline compared with a three-to-four-week timeline that ships every Friday.">
        <div className="vm__axis" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>W{i + 1}</span>
          ))}
        </div>
        <div className="vm__row" aria-hidden="true">
          <span className="vm__lab">Typical timeline · 3 months</span>
          <span className="vm__bar vm__bar--old" />
        </div>
        <div className="vm__row" aria-hidden="true">
          <span className="vm__lab">Velocity AI · 3–4 weeks</span>
          <span className="vm__bar vm__bar--new" />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="vm__ship" style={v("i", i)}>
              Fri
            </span>
          ))}
        </div>
      </div>
      <figcaption>“A shippable submodule delivered every single Friday.” <cite>viamagus.com/velocity-ai</cite></figcaption>
    </figure>
  );
}

/** Synthia AI — "The AI follows your playbook, not its own." / "Every AI output is a draft until a named officer signs it." */
export function SynthiaMech() {
  const steps = ["Your SOP", "AI drafts", "Named officer signs", "Logged · auditable"];
  return (
    <figure className="mech mech--synthia" data-reveal>
      <ol className="sm" aria-label="Synthia AI workflow: your SOP, the AI drafts, a named officer signs, every action is logged.">
        {steps.map((s, i) => (
          <li key={s} className={`sm__step${i === 2 ? " sm__step--gate" : ""}`} style={v("i", i)}>
            <span className="sm__n">{String(i + 1).padStart(2, "0")}</span>
            <span className="sm__t">{s}</span>
            {i === 1 ? <span className="sm__tag">Draft</span> : null}
            {i === 2 ? <span className="sm__tag sm__tag--ok">Signed ✓</span> : null}
          </li>
        ))}
      </ol>
      <span className="sm__token" aria-hidden="true" />
      <figcaption>“The AI stops where you told it to and waits for a person.” <cite>viamagus.com/synthia-ai</cite></figcaption>
    </figure>
  );
}

/** ViaMagus Select — "A search sends 50 CVs. We bring 4 worth an engineer’s time. 3 pass." */
export function SelectMech() {
  // the 4 brought forward and the 3 that pass, spread through the field
  const brought = [7, 19, 30, 44];
  const pass = [7, 19, 44];
  return (
    <figure className="mech mech--select" data-reveal>
      <div className="xm" role="img" aria-label="Of 50 CVs a search would send, 4 are worth an engineer’s time and 3 pass.">
        <div className="xm__grid" aria-hidden="true">
          {Array.from({ length: 50 }, (_, i) => (
            <span
              key={i}
              className={`xm__c${brought.includes(i) ? " is-brought" : ""}${pass.includes(i) ? " is-pass" : ""}`}
              style={v("i", i)}
            />
          ))}
        </div>
        <ol className="xm__legend" aria-hidden="true">
          <li>
            <b>50</b> CVs a search sends
          </li>
          <li>
            <b>4</b> worth an engineer’s time
          </li>
          <li>
            <b>3</b> pass — each with a written verdict
          </li>
        </ol>
      </div>
      <figcaption>
        “A search sends 50 CVs. We bring 4 worth an engineer’s time. 3 pass.” <cite>viamagusselect.ai</cite>
      </figcaption>
    </figure>
  );
}

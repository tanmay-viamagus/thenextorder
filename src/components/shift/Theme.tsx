"use client";

import { useEffect, useRef, useState } from "react";
import { theme } from "@/content/story";
import { Handoff } from "./Story";

/**
 * Why attend — the headline is the interface. "AI is reshaping how GCCs
 * hire, build and lead": each verb is a button; the active one is cut by the
 * magenta line from the title. All three sets of topics (from the brochure)
 * are always on screen — nothing waits on the animation; the active column
 * is simply brighter. While on screen it moves through the three on its own;
 * pointing at a column or clicking a verb takes over. Reduced motion: no
 * auto-advance.
 */
const HOLD = 2600;

export function Theme() {
  const root = useRef<HTMLElement | null>(null);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || !auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % theme.shifts.length), HOLD);
    return () => window.clearInterval(t);
  }, [seen, auto, i]);

  const pick = (k: number) => {
    setI(k);
    setAuto(false);
  };

  const verb = (k: number) => {
    const s = theme.shifts[k];
    return (
      <button
        type="button"
        className={`why__v${k === i ? " is-on" : ""}`}
        aria-pressed={k === i}
        aria-controls={`why-p-${s.k}`}
        onClick={() => pick(k)}
      >
        {s.verb.toLowerCase()}
      </button>
    );
  };

  return (
    <section
      id="theme"
      ref={root}
      className={`why${auto && seen ? " is-auto" : ""}`}
      data-tone="light"
      data-act="theme"
      aria-labelledby="why-h"
    >
      <div className="why__top" data-reveal>
        <p className="th__k">
          <span className="chap">03</span>
          {theme.kicker}
        </p>
        <p className="why__lede">{theme.lede}</p>
      </div>

      <h2 id="why-h" className="why__h" data-reveal>
        AI is reshaping how GCCs <span className="why__nw">{verb(0)},</span> {verb(1)} and{" "}
        <span className="why__nw">{verb(2)}.</span>
      </h2>

      <div className="why__bar" aria-hidden="true">
        {theme.shifts.map((s, k) => (
          <span key={s.k} className={k === i ? "is-on" : k < i ? "is-done" : ""}>
            {k === i ? <i key={`${i}-${auto}`} /> : null}
          </span>
        ))}
      </div>

      <div className="why__cols">
        {theme.shifts.map((s, k) => (
          <div
            key={s.k}
            id={`why-p-${s.k}`}
            className={`why__col${k === i ? " is-on" : ""}`}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") pick(k);
            }}
          >
            <p className="why__pk">
              <span>0{k + 1}</span>
              {s.word}
            </p>
            <ul className="why__tops">
              {s.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* why it fits: the room, the horizon, the evening — all from the brochure */}
      <dl className="why__fit" data-reveal>
        {theme.fit.map((f) => (
          <div key={f.k}>
            <dt>{f.k}</dt>
            <dd>{f.d}</dd>
          </div>
        ))}
      </dl>

      <Handoff to="request">Places are by invitation. Will you be in the room?</Handoff>
    </section>
  );
}

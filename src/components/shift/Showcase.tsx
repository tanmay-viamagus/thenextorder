"use client";

import { useEffect, useState } from "react";
import { HandsClock } from "@/components/clock/Clock";
import { practices } from "@/content/story";

const HAND = {
  velocity: "Second hand",
  synthia: "Minute hand",
  select: "Hour hand",
};

/**
 * The left side of /register: always moving. A live three-hands clock; the
 * spotlight walks through the practices, lighting each one's hand while its
 * line is shown. Pauses on hover/focus; static under reduced motion.
 */
export function Showcase() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (hold || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % practices.length),
      3800,
    );
    return () => window.clearInterval(t);
  }, [hold]);

  const p = practices[i];
  return (
    <div
      className="sc"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
    >
      <HandsClock
        hl={p.key}
        label="A live clock whose three hands are Velocity AI, Synthia AI and ViaMagus Select, pinned on the ViaMagus mark."
      />
      <div className="sc__side">
        <div
          className="sc__tabs"
          role="tablist"
          aria-label="The three practices"
        >
          {practices.map((x, k) => (
            <button
              key={x.key}
              type="button"
              role="tab"
              aria-selected={k === i}
              className={`sc__tab sc__tab--${x.key}`}
              onClick={() => setI(k)}
              onFocus={() => setHold(true)}
              onBlur={() => setHold(false)}
            >
              {x.verb}
            </button>
          ))}
        </div>
        <div
          key={p.key}
          className={`sc__cap sc__cap--${p.key}`}
          role="tabpanel"
          aria-live="polite"
        >
          <p className="sc__hand">
            {HAND[p.key]} · {p.name}
          </p>
          <p className="sc__line">“{p.line}”</p>
          <p className="sc__src">{p.source}</p>
        </div>
      </div>
    </div>
  );
}

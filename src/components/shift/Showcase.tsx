"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SelectWordmark, SynthiaLogo, VelocityWordmark } from "@/components/Brand";
import { HandsClock } from "@/components/clock/Clock";
import { practices } from "@/content/story";

const HAND = { velocity: "The second hand", synthia: "The minute hand", select: "The hour hand" };
const MARK = { velocity: VelocityWordmark, synthia: () => <SynthiaLogo height={26} />, select: SelectWordmark };

/** Each practice as one transformation — the same beats as the film. */
function Beat({ k }: { k: string }) {
  if (k === "velocity")
    return (
      <div className="bt bt--v" aria-hidden="true">
        <span className="bt__from">3 months</span>
        <span className="bt__to">3–4 weeks</span>
      </div>
    );
  if (k === "synthia")
    return (
      <div className="bt bt--s" aria-hidden="true">
        <span className="bt__doc">
          <span className="bt__dk">AI output</span>
          <span className="bt__ln" />
          <span className="bt__ln bt__ln--s" />
          <span className="bt__draft">Draft</span>
          <span className="bt__stamp">Signed ✓</span>
        </span>
      </div>
    );
  return (
    <div className="bt bt--x" aria-hidden="true">
      <span className="bt__n" />
      <span className="bt__lab">
        <span className="bt__a">CVs a search sends</span>
        <span className="bt__b">pass, each with a written verdict</span>
      </span>
    </div>
  );
}

/**
 * The left side of /register — a story that never stops: progress bars like
 * stories, the live three-hands clock with the active practice's hand lit, and
 * that practice's transformation. Hover or focus pauses; a bar jumps.
 * Reduced motion: no auto-advance and no animation, every state complete.
 */
const RM = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function Showcase() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  // play only while on screen; each time it comes into view, start again at Build
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const box = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setSeen(e.isIntersecting);
        if (e.isIntersecting) {
          setI(0);
          setRun((r) => r + 1);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const still = useSyncExternalStore(subscribeMotion, () => window.matchMedia(RM).matches, () => false);

  const p = practices[i];
  const Mark = MARK[p.key];
  const next = () => setI((n) => (n + 1) % practices.length);

  return (
    <div
      ref={box}
      className={`sc${hold || !seen ? " is-held" : ""}${still ? " is-still" : ""}`}
      data-k={p.key}
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={() => setHold(false)}
    >
      <div className="sc__bars" role="tablist" aria-label="The three practices">
        {practices.map((x, k) => (
          <button
            key={x.key}
            type="button"
            role="tab"
            aria-selected={k === i}
            className={`sc__bar sc__bar--${x.key}${k < i ? " is-done" : ""}`}
            onClick={() => setI(k)}
          >
            <span className="sc__track">
              {k === i ? <span key={`${x.key}-${i}-${run}`} className="sc__fill" onAnimationEnd={still ? undefined : next} /> : null}
            </span>
            <span className="sc__lbl">{x.verb}</span>
          </button>
        ))}
      </div>

      <div className="sc__stage">
        <div className="sc__clock">
          <HandsClock hl={p.key} label="A live clock whose three hands are Velocity AI, Synthia AI and ViaMagus Select, pinned on the ViaMagus mark." />
        </div>
        <div key={`${p.key}-${run}`} className="sc__story" role="tabpanel" aria-live="polite">
          <p className="sc__hand">{HAND[p.key]}</p>
          <p className="sc__verb">{p.verb}.</p>
          <div className="sc__mark">
            <Mark />
          </div>
          <Beat k={p.key} />
          <p className="sc__line">“{p.line}”</p>
          <p className="sc__src">{p.source}</p>
        </div>
      </div>
    </div>
  );
}

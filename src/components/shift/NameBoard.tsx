"use client";

import { useStepScroll } from "./useStepScroll";
import { useEffect, useRef, useState } from "react";

/**
 * GCC → GIC → ? as a split-flap board, driven by scroll (pinned, native scroll).
 * Only the middle letter changes — C, then I, then a question mark: the next
 * name isn't written yet. One clean flip per change.
 */
const STATES = [
  {
    word: ["G", "C", "C"],
    k: "It was",
    name: "Global Capability Centre",
    note: "Built to deliver what headquarters designed.",
  },
  {
    word: ["G", "I", "C"],
    k: "Then",
    name: "Global In‑house Centre — or Innovation Centre, depending on who you ask",
    note: "Same centre, bigger brief. The middle letter changed first.",
  },
  {
    word: ["G", "?", "C"],
    k: "Next",
    name: "Not written yet",
    note: "The name will follow the mandate — and the mandate is what this room is about.",
  },
];

function Flap({ ch }: { ch: string }) {
  const [shown, setShown] = useState(ch);
  const [prev, setPrev] = useState(ch);
  const [flip, setFlip] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (ch === shown) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.clearInterval(timer.current);
    // one clean flip per change — I gives way straight to ?; reduced motion: the letter simply changes
    const seq = [ch];
    let i = 0;
    let cur = shown;
    const step = () => {
      const next = seq[i++];
      setPrev(reduce ? next : cur);
      setShown(next);
      if (!reduce) setFlip((n) => n + 1);
      cur = next;
      if (i >= seq.length) window.clearInterval(timer.current);
    };
    const first = window.setTimeout(step, 0);
    if (seq.length > 1) timer.current = window.setInterval(step, 85);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch]);

  return (
    <span className={`flap${shown === "?" ? " is-q" : ""}`}>
      {/* static halves: the new letter's top, the old letter's bottom; the leaves flip over them */}
      <span className="flap__half flap__top">
        <span>{shown}</span>
      </span>
      <span className="flap__half flap__bot">
        <span>{flip ? prev : shown}</span>
      </span>
      <span
        key={`a${flip}`}
        className={`flap__half flap__top flap__leaf${flip ? " is-flipping" : ""}`}
      >
        <span>{prev}</span>
      </span>
      <span
        key={`b${flip}`}
        className={`flap__half flap__bot flap__leaf2${flip ? " is-flipping" : ""}`}
      >
        <span>{shown}</span>
      </span>
    </span>
  );
}

export function NameBoard() {
  const root = useRef<HTMLElement | null>(null);
  useStepScroll(root, STATES.length);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight)),
      );
      setI(Math.round(p * 2));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const s = STATES[i];
  return (
    <section
      id="name"
      ref={root}
      className="nb"
      data-tone="dark"
      data-act="name"
      data-step={i}
      aria-labelledby="nb-h"
    >
      <h2 id="nb-h" className="sr-only">
        It was the GCC. Then the GIC. What comes next?
      </h2>
      <ol className="sr-only">
        {STATES.map((x) => (
          <li key={x.k}>
            {x.k}:{" "}
            {x.word.join("") === "G?C"
              ? "a name not written yet"
              : x.word.join("")}{" "}
            — {x.name}. {x.note}
          </li>
        ))}
      </ol>
      {/* one snap point per state: one swipe, one flip */}
      {[0, 1, 2].map((k) => (
        <span
          key={k}
          className="nb__snap"
          style={{ top: `${k * 50}vh` }}
          aria-hidden="true"
        />
      ))}
      <div className="nb__stage" aria-hidden="true">
        <div className="nb__top">
          <p className="nb__k">First, a question of names</p>
          <ol className="nb__steps">
            {["GCC", "GIC", "?"].map((w, k) => (
              <li
                key={w}
                className={k === i ? "is-on" : k < i ? "is-done" : ""}
              >
                {w}
              </li>
            ))}
          </ol>
        </div>
        <div className="nb__board">
          <span className="nb__seam" />
          <Flap ch={s.word[0]} />
          <Flap ch={s.word[1]} />
          <Flap ch={s.word[2]} />
        </div>
        <div key={i} className="nb__cap">
          <p className="nb__was">{s.k}</p>
          <p className="nb__name">{s.name}</p>
          <p className="nb__note">{s.note}</p>
        </div>
      </div>
    </section>
  );
}

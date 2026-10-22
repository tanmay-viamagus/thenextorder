"use client";

import { useEffect, useRef, useState } from "react";

/**
 * GIC → GCC → ? as a split-flap board. The order is the documented one: captive
 * centres became Global In-house Centres (GICs), later renamed Global
 * Capability Centres (GCCs). Only the middle letter changes — I, then C, then
 * a question mark: the next name isn't written yet. One clean flip per change.
 *
 * Not pinned: the board plays itself once it is on screen (and again each
 * time it comes back), so it costs no extra swipes.
 */
const STATES = [
  {
    word: ["G", "I", "C"],
    k: "It was",
    name: "Global In‑house Centre",
    note: "The captive centre, renamed. Built to deliver what headquarters designed.",
  },
  {
    word: ["G", "C", "C"],
    k: "Now",
    name: "Global Capability Centre",
    note: "Same centre, bigger brief: capability, not just cost. The middle letter changed.",
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

/** how long each name holds before the next flip (ms) */
const HOLD = [1600, 2600];

export function NameBoard() {
  const root = useRef<HTMLElement | null>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let timers: number[] = [];
    const clear = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.55 && !timers.length) {
          // on screen: GIC, then GCC, then the open question
          timers = [
            window.setTimeout(() => setI(1), HOLD[0]),
            window.setTimeout(() => setI(2), HOLD[0] + HOLD[1]),
          ];
        } else if (!e.isIntersecting) {
          // gone: reset, so it plays again on the way back
          clear();
          setI(0);
        }
      },
      { threshold: [0, 0.55] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
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
        It was the GIC. Now it is the GCC. What comes next?
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
      <div className="nb__stage" aria-hidden="true">
        <div className="nb__top">
          <p className="nb__k">A question of names</p>
          <ol className="nb__steps">
            {["GIC", "GCC", "?"].map((w, k) => (
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

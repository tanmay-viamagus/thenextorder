"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { forces, type ForceKey } from "@/content/story";
import { SelectWordmark, SynthiaLogo, VelocityWordmark } from "./Brand";
import { SelectVisual, SynthiaVisual, VelocityVisual } from "./ForceVisuals";

const MARK: Record<ForceKey, React.ReactNode> = {
  velocity: <VelocityWordmark />,
  synthia: <SynthiaLogo height={34} />,
  select: <SelectWordmark />,
};
const VISUAL: Record<ForceKey, React.ReactNode> = {
  velocity: <VelocityVisual />,
  synthia: <SynthiaVisual />,
  select: <SelectVisual />,
};
const DWELL = 6500;

/**
 * Build. Operate. Scale. — the headline is the control. One force owns the
 * frame at a time, in its own colours; it advances on its own while the frame
 * is in view and stops as soon as the visitor takes over.
 */
export function ForcesStage() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [live, setLive] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = forces[idx];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !live) return;
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % forces.length), DWELL);
    return () => window.clearTimeout(t);
  }, [idx, auto, live]);

  // the header follows the force: dark ink on Select's paper, white elsewhere
  useEffect(() => {
    const frame = root.current?.closest<HTMLElement>("[data-frame]");
    if (!frame) return;
    frame.dataset.tone = f.key === "select" ? "light" : "dark";
    if (live) document.documentElement.dataset.tone = frame.dataset.tone;
  }, [f.key, live]);

  const pick = (i: number) => {
    setAuto(false);
    setIdx(i);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (idx + d + forces.length) % forces.length;
    pick(n);
    tabs.current[n]?.focus();
  };

  return (
    <div ref={root} className={`fs fs--${f.key}${auto && live ? " is-auto" : ""}`}>
      <div className="fs__tabs" role="tablist" aria-label="Three forces">
        {forces.map((x, i) => (
          <button
            key={x.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`fs-tab-${x.key}`}
            aria-selected={i === idx}
            aria-controls="fs-panel"
            tabIndex={i === idx ? 0 : -1}
            className={`fs__tab fs__tab--${x.key}`}
            onClick={() => pick(i)}
            onKeyDown={onKey}
          >
            {x.verb}.
            <span className="fs__progress" aria-hidden="true">
              <i key={`${idx}-${auto}`} />
            </span>
          </button>
        ))}
      </div>

      <div id="fs-panel" role="tabpanel" aria-labelledby={`fs-tab-${f.key}`} className="fs__panel" key={f.key}>
        <div className="fs__copy">
          <div className="fs__mark">{MARK[f.key]}</div>
          <h3 className="fs__claim">{f.claim}</h3>
          <p className="fs__detail">{f.detail}</p>
          <a className="fs__link" href={f.href} target="_blank" rel="noopener noreferrer">
            {f.source} <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="fs__visual is-live">{VISUAL[f.key]}</div>
      </div>
    </div>
  );
}

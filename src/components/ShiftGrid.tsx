"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { forces, shift } from "@/content/story";

export type ShiftState = "last" | "next";

const PEOPLE = 100; // a pyramid of 10 rows: 1, 3, 5 … 19
const AGENTS_PER = 8;
const TIER_AFTER = new Set([0, 2, 5]); // layer gaps: leadership / management / leads / delivery

type Cell = { x: number; y: number; force: number; agent: boolean; tier: number; tone: number };
type Layout = { size: number; last: Cell[]; next: Cell[]; centers: { x: number; y: number; r: number }[] };

/** A 7 × 6 block per force — the next order is tidy, not a blob. */
const COLS = 7;
const ROWS = 6;
const BLOCK = Array.from({ length: COLS * ROWS }, (_, k) => ({ i: (k % COLS) - (COLS - 1) / 2, j: Math.floor(k / COLS) - (ROWS - 1) / 2, k }));
// agents sit inside each block on a loose diagonal, working alongside people
const AGENT_SLOTS = BLOCK.filter((b) => ((b.k % COLS) * 3 + Math.floor(b.k / COLS) * 2) % 5 === 1)
  .slice(0, AGENTS_PER)
  .map((b) => b.k);
const PEOPLE_SLOTS = BLOCK.filter((b) => !AGENT_SLOTS.includes(b.k));

function layout(W: number, H: number): Layout {
  // pyramid
  const p = Math.min(W / 21, H / 12.6);
  const size = p * 0.8;
  const pyrW = 19 * p;
  const pyrH = 10 * p + 3 * p * 0.55;
  const ox = (W - pyrW) / 2;
  const oy = (H - pyrH) / 2;
  const last: Cell[] = [];
  let y = oy;
  let tier = 0;
  for (let r = 0; r < 10; r++) {
    const n = 2 * r + 1;
    const rowX = ox + (19 - n) * p * 0.5;
    for (let c = 0; c < n; c++) last.push({ x: rowX + c * p, y, force: 0, agent: false, tier, tone: 0 });
    y += p;
    if (TIER_AFTER.has(r)) {
      y += p * 0.55;
      tier++;
    }
  }

  // the next order: three blocks in a triangle, linked as one system
  const q = Math.min(p, H / 15.8, W / 17.5);
  const m = q * 0.5;
  const halfW = (COLS / 2) * q;
  const halfH = (ROWS / 2) * q;
  const centers = [
    { x: halfW + m, y: halfH + m },
    { x: W - halfW - m, y: halfH + m },
    { x: W / 2, y: H - halfH - q * 1.6 },
  ].map((c) => ({ ...c, r: halfH }));

  // hand people to the block nearest their pyramid column, so the move reads as a re-ordering
  const order = last.map((c, i) => ({ i, x: c.x, y: c.y })).sort((a, b) => a.x - b.x || a.y - b.y);
  const assign: number[] = new Array(PEOPLE);
  order.forEach((o, k) => {
    // left third → Build, right third → Operate, middle → Scale
    assign[o.i] = k < 33 ? 0 : k < 67 ? 2 : 1;
  });
  const counts = [0, 0, 0];
  const at = (f: number, slot: { i: number; j: number }) => ({
    x: centers[f].x + slot.i * q - size / 2,
    y: centers[f].y + slot.j * q - size / 2,
  });

  const next: Cell[] = last.map((c, i) => {
    const f = assign[i];
    const slot = PEOPLE_SLOTS[counts[f]++];
    return { ...at(f, slot), force: f, agent: false, tier: c.tier, tone: (slot.i + 3) / 6 };
  });
  for (let f = 0; f < 3; f++) {
    // a block with one person fewer gets one more agent, so every block is complete
    const slots = [...AGENT_SLOTS.map((k) => BLOCK[k]), ...PEOPLE_SLOTS.slice(counts[f])];
    slots.forEach((slot, n) => {
      next.push({ ...at(f, slot), force: f, agent: true, tier: 9, tone: n / AGENTS_PER });
    });
  }
  // agents don't fly in — they appear in place once the people have re-ordered
  const lastAll: Cell[] = [...last, ...next.slice(PEOPLE)];
  return { size, last: lastAll, next, centers };
}

const FORCE_LABEL = [forces[0], forces[1], forces[2]];

export function ShiftGrid({
  state,
  onState,
  autoplay = true,
}: {
  state?: ShiftState;
  onState?: (s: ShiftState) => void;
  autoplay?: boolean;
}) {
  const stage = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [inner, setInner] = useState<ShiftState>("last");
  const current = state ?? inner;
  const set = (s: ShiftState) => {
    setInner(s);
    onState?.(s);
  };

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // play the shift once, the first time the grid is properly in view
  useEffect(() => {
    if (!autoplay || state) return;
    const el = stage.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          timer = window.setTimeout(() => {
            setInner("next");
            onState?.("next");
          }, 1500);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [autoplay, state, onState]);

  const L = useMemo(() => (box ? layout(box.w, box.h) : null), [box]);
  const cells = L ? (current === "last" ? L.last : L.next) : [];

  return (
    <div className={`shift shift--${current}`}>
      <div className="shift__stage" ref={stage}>
        {L ? (
          <>
            <svg className="shift__links" width={box!.w} height={box!.h} aria-hidden="true">
              {[
                [0, 1],
                [1, 2],
                [2, 0],
              ].map(([a, b]) => (
                <line key={`${a}${b}`} x1={L.centers[a].x} y1={L.centers[a].y} x2={L.centers[b].x} y2={L.centers[b].y} />
              ))}
            </svg>
            {cells.map((c, i) => (
              <span
                key={i}
                className={`cell${c.agent ? " cell--agent" : ""}`}
                data-force={L.next[i].force}
                data-tier={L.last[i].tier}
                style={
                  {
                    width: L.size,
                    height: L.size,
                    transform: `translate(${c.x}px, ${c.y}px)`,
                    "--d": `${((i * 37) % 23) * 22}ms`,
                    "--tone": L.next[i].tone,
                  } as CSSProperties
                }
              />
            ))}
            {L.centers.map((c, f) => (
              <span
                key={f}
                className={`shift__label shift__label--${FORCE_LABEL[f].key}`}
                style={{ left: c.x, top: c.y + c.r + L.size * 0.4 } as CSSProperties}
              >
                <b>{FORCE_LABEL[f].verb}</b> {FORCE_LABEL[f].name}
              </span>
            ))}
          </>
        ) : null}
      </div>

      <div className="shift__controls">
        <div className="toggle" role="group" aria-label="Compare operating models">
          {(["last", "next"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={current === s} onClick={() => set(s)}>
              {shift[s].name}
            </button>
          ))}
        </div>
        <p className="shift__legend">
          <span className="key key--person" aria-hidden="true" /> {shift.legendPeople}
          <span className="key key--agent" aria-hidden="true" /> {shift.legendAgents}
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {current === "last"
          ? "A pyramid of 100 people in four layers."
          : "The same 100 people re-ordered into three connected clusters — Build, Operate and Scale — with AI agents working inside each."}
      </p>
    </div>
  );
}

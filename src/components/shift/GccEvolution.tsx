"use client";

import { useEffect, useRef, useState } from "react";

/**
 * How a GCC evolves — one organisational form, five stages.
 * The site's block motif: the home market is a solid tower with the decision
 * node on top; India starts empty. Stage by stage the centre arrives, fills
 * with teams and takes in work (01–03); then its blocks fuse into owned
 * volumes, work flows back and a decision node appears in India (04); then it
 * connects out across the global organisation and builds what's next (05).
 * A conceptual maturity journey — not a rule every centre follows.
 * Scroll (pinned, native scroll) or the stage buttons drive it.
 */
export const STAGES = [
  { n: "01", title: "The origin", line: "The business begins at home.", note: "Leadership, core teams and the decisions all sit in the home market." },
  { n: "02", title: "The arrival", line: "India becomes part of the plan.", note: "A centre opens in India — new, small, and connected to headquarters." },
  {
    n: "03",
    title: "The operating centre",
    line: "Teams form. Capabilities take shape.",
    note: "Work flows in from headquarters and delivery flows back. This is where many GCCs are today.",
  },
  {
    n: "04",
    title: "The ownership shift",
    line: "From executing work to owning outcomes.",
    note: "Product, platforms and engineering decisions start to sit in India. The work flows both ways now.",
  },
  {
    n: "05",
    title: "The next order",
    line: "Building what the business becomes next.",
    note: "The centre shapes global products and where the organisation goes next — one of its centres of gravity.",
  },
] as const;

type Pt = [number, number];
type Geo = {
  vb: string;
  ground: [number, number, number][]; // x0, x1, y
  hq: { x: number; y: number }; // bottom-left of the tower
  ind: { x: number; y: number }; // bottom-left of the centre
  bridges: string[]; // HQ → India
  globals: { at: Pt; path: string }[]; // India → the wider organisation
  label: { hq: Pt; ind: Pt };
};

const S = 46; // block
const P = 54; // pitch
const HQ_C = 4;
const HQ_R = 6;
const IN_C = 4;
const IN_R = 4;

const WIDE: Geo = {
  vb: "130 125 1440 545",
  ground: [
    [150, 470, 600],
    [1020, 1350, 600],
  ],
  hq: { x: 200, y: 600 },
  ind: { x: 1080, y: 600 },
  bridges: ["M412 300 C 620 150, 870 230, 1072 396", "M412 380 C 640 300, 860 340, 1072 452", "M412 460 C 660 430, 860 450, 1072 506"],
  globals: [
    { at: [1450, 210], path: "M1296 396 C 1360 330, 1400 260, 1437 223" },
    { at: [1520, 430], path: "M1296 452 C 1380 440, 1460 440, 1507 443" },
    { at: [940, 150], path: "M1130 330 C 1080 230, 1010 180, 966 163" },
  ],
  label: { hq: [304, 640], ind: [1184, 640] },
};

const TALL: Geo = {
  vb: "50 80 720 980",
  ground: [
    [80, 380, 430],
    [400, 720, 990],
  ],
  hq: { x: 120, y: 430 },
  ind: { x: 450, y: 990 },
  bridges: ["M332 150 C 560 200, 600 520, 548 772", "M332 250 C 500 330, 540 560, 600 772", "M332 350 C 430 470, 560 600, 652 772"],
  globals: [
    { at: [720, 640], path: "M666 790 C 700 740, 715 700, 720 666" },
    { at: [90, 760], path: "M442 840 C 300 820, 160 800, 103 773" },
    { at: [700, 520], path: "M610 760 C 640 660, 680 590, 700 546" },
  ],
  label: { hq: [224, 470], ind: [554, 1030] },
};

// India's blocks: rows from the bottom. Row 0 stays operations; the rest fuse at stage 04.
const GROUPS: { name: string; cls: string; c0: number; c1: number; r0: number; r1: number }[] = [
  { name: "Operations", cls: "ops", c0: 0, c1: 3, r0: 0, r1: 0 },
  { name: "Engineering", cls: "eng", c0: 0, c1: 3, r0: 1, r1: 1 },
  { name: "Product", cls: "prod", c0: 0, c1: 1, r0: 2, r1: 3 },
  { name: "Platforms", cls: "plat", c0: 2, c1: 3, r0: 2, r1: 3 },
];

function Blocks({ x, y, cols, rows, cls, arrive }: { x: number; y: number; cols: number; rows: number; cls: string; arrive?: boolean }) {
  const out = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const first = arrive && r === 0 && c === 0;
      out.push(
        <rect
          key={`${r}-${c}`}
          className={`${cls}${first ? " is-first" : ""}`}
          x={x + c * P}
          y={y - (r + 1) * P + (P - S)}
          width={S}
          height={S}
          style={{ ["--k" as string]: r * cols + c }}
        />,
      );
    }
  return <>{out}</>;
}

function Scene({ g, kind }: { g: Geo; kind: "wide" | "tall" }) {
  const hqTop = g.hq.y - HQ_R * P + (P - S);
  const inTop = g.ind.y - IN_R * P + (P - S);
  const hqMid = g.hq.x + (HQ_C * P - (P - S)) / 2;
    const box = (c0: number, c1: number, r0: number, r1: number) => ({
    x: g.ind.x + c0 * P - 3,
    y: g.ind.y - (r1 + 1) * P + (P - S) - 3,
    w: (c1 - c0 + 1) * P - (P - S) + 6,
    h: (r1 - r0 + 1) * P - (P - S) + 6,
  });
  const next = box(2, 3, 4, 4);
  return (
    <svg className={`ev ev--${kind}`} viewBox={g.vb} aria-hidden="true">
      {g.ground.map(([a, b, y], k) => (
        <line key={k} className="ev-ground" x1={a} x2={b} y1={y} y2={y} />
      ))}
      <text className="ev-place" x={g.label.hq[0]} y={g.label.hq[1]} textAnchor="middle">
        HOME MARKET
      </text>
      <text className="ev-place ev-place--in" x={g.label.ind[0]} y={g.label.ind[1]} textAnchor="middle">
        INDIA
      </text>

      {/* the bridges: one at arrival, three once the centre operates */}
      {g.bridges.map((d, k) => (
        <g key={k} className={`ev-br ev-br--${k}`}>
          <path d={d} pathLength={1} />
          <circle r="7" className="ev-dot ev-dot--in">
            <animateMotion dur={`${2.6 + k * 0.4}s`} repeatCount="indefinite" path={d} />
          </circle>
          <circle r="7" className="ev-dot ev-dot--out">
            <animateMotion dur={`${2.8 + k * 0.4}s`} repeatCount="indefinite" path={d} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
          </circle>
        </g>
      ))}

      {/* the wider organisation */}
      {g.globals.map((o, k) => (
        <g key={k} className="ev-gl">
          <path d={o.path} pathLength={1} />
          <rect x={o.at[0] - 13} y={o.at[1] - 13} width="26" height="26" />
          <circle r="5" className="ev-dot ev-dot--out">
            <animateMotion dur={`${2.2 + k * 0.3}s`} repeatCount="indefinite" path={o.path} />
          </circle>
        </g>
      ))}

      {/* home market */}
      <g className="ev-hq">
        <Blocks x={g.hq.x} y={g.hq.y} cols={HQ_C} rows={HQ_R} cls="ev-b" />
      </g>
      <g className="ev-node ev-node--hq">
        <line x1={hqMid} x2={hqMid} y1={hqTop - 6} y2={hqTop - 30} />
        <circle cx={hqMid} cy={hqTop - 42} r="13" />
        <text x={hqMid + 26} y={hqTop - 37}>
          DECISIONS
        </text>
      </g>

      {/* India */}
      <g className="ev-in">
        <Blocks x={g.ind.x} y={g.ind.y} cols={IN_C} rows={IN_R} cls="ev-b" arrive />
      </g>
      <g className="ev-own">
        {GROUPS.map((gr) => {
          const b = box(gr.c0, gr.c1, gr.r0, gr.r1);
          return (
            <g key={gr.cls} className={`ev-v ev-v--${gr.cls}`}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} />
              <text x={b.x + 10} y={b.y + 22}>
                {gr.name.toUpperCase()}
              </text>
            </g>
          );
        })}
      </g>
      <g className="ev-next">
        <rect x={next.x} y={next.y} width={next.w} height={next.h} />
        <text x={next.x + next.w / 2} y={next.y + next.h / 2 + 6} textAnchor="middle">
          NEXT
        </text>
      </g>
      {/* India's decisions: over the first column, clear of what's being built next */}
      <g className="ev-node ev-node--in">
        <line x1={g.ind.x + S / 2} x2={g.ind.x + S / 2} y1={inTop - 6} y2={inTop - 30} />
        <circle cx={g.ind.x + S / 2} cy={inTop - 42} r="13" />
        <text x={g.ind.x + S / 2 - 24} y={inTop - 37} textAnchor="end">
          DECISIONS
        </text>
      </g>
    </svg>
  );
}

export function GccEvolution() {
  const root = useRef<HTMLElement | null>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(0.999, -r.top / Math.max(1, r.height - window.innerHeight)));
      setI(Math.floor(p * STAGES.length));
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

  // the stage buttons scroll the page to that stage (native scroll, never hijacked)
  const go = (k: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((k + 0.5) / STAGES.length) * span, behavior: "instant" });
  };

  const s = STAGES[i];
  return (
    <section id="evolve" ref={root} className="evo" data-stage={i + 1} data-tone="light" data-act="evolve" aria-labelledby="evo-h">
      <div className="evo__stage">
        <div className="evo__hd">
          <div>
            <p className="evo__k">How a GCC evolves</p>
            <h2 id="evo-h" className="evo__h">
              From a presence in India to a force in the business.
            </h2>
          </div>
          <div className="evo__rail" role="group" aria-label="The five stages">
            {STAGES.map((x, k) => (
              <button
                key={x.n}
                type="button"
                className={`evo__r${k === i ? " is-on" : k < i ? " is-done" : ""}${k >= 3 ? " is-next" : ""}`}
                aria-pressed={k === i}
                onClick={() => go(k)}
              >
                <b>{x.n}</b>
                <span>{x.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="evo__art">
          <Scene g={WIDE} kind="wide" />
          <Scene g={TALL} kind="tall" />
        </div>

        <div className="evo__ft">
          <div key={i} className="evo__cap" aria-live="polite">
            <p className="evo__n">
              {s.n} / 05 · {s.title}
            </p>
            <p className="evo__line">{s.line}</p>
            <p className="evo__note">{s.note}</p>
          </div>
          <aside className={`evo__sel${i >= 3 ? " is-on" : ""}`} aria-hidden={i < 3}>
            <p className="evo__selk">The capability gap</p>
            <p className="evo__selp">
              The people who set up a centre aren’t always the people who will own what it builds next. <b>ViaMagus Select</b> brings
              engineer-vetted specialist talent for that next stage.
            </p>
            <div className="evo__sela">
              <a href="https://www.viamagusselect.ai/" target="_blank" rel="noopener noreferrer" tabIndex={i >= 3 ? 0 : -1}>
                Let’s hire ↗<span className="sr-only"> — ViaMagus Select (opens in a new tab)</span>
              </a>
              <a href="/register?interest=select" tabIndex={i >= 3 ? 0 : -1}>
                Bring a hiring brief to the room →
              </a>
            </div>
          </aside>
        </div>
        <p className="evo__fine">A way of seeing it, not a rule — every centre’s path is different.</p>
      </div>
      <ol className="sr-only">
        {STAGES.map((x) => (
          <li key={x.n}>
            {x.n}, {x.title}: {x.line} {x.note}
          </li>
        ))}
      </ol>
    </section>
  );
}

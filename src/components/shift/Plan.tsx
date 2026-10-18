import type { CSSProperties } from "react";

/**
 * The mandate, drawn as a floor plan — the site's one recurring image.
 * THEN: a small room inside someone else's building, laid out as briefed.
 * NOW: the walls move outward; the old outline stays, dashed.
 * NEXT: a larger plan with rooms the centre owns — and one left to draw.
 * Lines draw themselves once when the plan scrolls into view (see shift.css).
 */
type Stage = "then" | "now" | "next";

const W = 800;
const H = 560;
// the room as briefed (THEN) — it reappears dashed in NOW and NEXT
const R0 = { x: 270, y: 290, w: 300, h: 180 };
const R1 = { x: 220, y: 236, w: 400, h: 268 };
const R2 = { x: 100, y: 96, w: 600, h: 424 };

const d = (i: number): CSSProperties => ({ ["--d" as string]: `${i * 0.08}s` });

function Building() {
  return (
    <g className="pl-bldg">
      <rect x="20" y="20" width={W - 40} height={H - 40} pathLength={1} style={d(0)} />
      <path d="M20 180 H190 M190 20 V180 M610 20 V150 H780 M20 430 H120 V540 M690 540 V430 H780" pathLength={1} style={d(1)} />
      <text x="34" y="44" className="pl-cap">GLOBAL ENTERPRISE</text>
      <text x="766" y="530" className="pl-cap" textAnchor="end">
        PLAN — NOT TO SCALE
      </text>
    </g>
  );
}

function Then({ bays }: { bays: string[] }) {
  const cells = [
    [R0.x, R0.y],
    [R0.x + R0.w / 2, R0.y],
    [R0.x, R0.y + R0.h / 2],
    [R0.x + R0.w / 2, R0.y + R0.h / 2],
  ];
  return (
    <g className="pl-room">
      <path
        d={`M${R0.x + 40} ${R0.y} H${R0.x} V${R0.y + R0.h} H${R0.x + R0.w} V${R0.y} H${R0.x + 76}`}
        pathLength={1}
        className="pl-wall"
        style={d(3)}
      />
      <path d={`M${R0.x + R0.w / 2} ${R0.y} V${R0.y + R0.h} M${R0.x} ${R0.y + R0.h / 2} H${R0.x + R0.w}`} pathLength={1} style={d(4)} />
      {cells.map(([x, y], i) => (
        <g key={i} className="pl-bay">
          <text x={x + 10} y={y + 20} className="pl-lab">
            {bays[i]}
          </text>
          {Array.from({ length: 12 }, (_, k) => (
            <rect
              key={k}
              className="pl-desk"
              x={x + 12 + (k % 6) * 16}
              y={y + 36 + Math.floor(k / 6) * 18}
              width="9"
              height="9"
              style={d(5 + (k % 6) * 0.3)}
            />
          ))}
        </g>
      ))}
      <text x={R0.x} y={R0.y - 14} className="pl-cap pl-cap--ink">
        INDIA CENTRE · AS BRIEFED
      </text>
      <g className="pl-dim">
        <path d={`M${R0.x} ${R0.y + R0.h + 24} H${R0.x + R0.w} M${R0.x} ${R0.y + R0.h + 16} v16 M${R0.x + R0.w} ${R0.y + R0.h + 16} v16`} pathLength={1} style={d(6)} />
        <text x={R0.x + R0.w / 2} y={R0.y + R0.h + 46} textAnchor="middle" className="pl-cap">
          THE BRIEF — WRITTEN ELSEWHERE
        </text>
      </g>
    </g>
  );
}

function Now() {
  const arrows = [
    [R0.x, 380, R1.x + 6, 380],
    [R0.x + R0.w, 380, R1.x + R1.w - 6, 380],
    [420, R0.y, 420, R1.y + 6],
    [420, R0.y + R0.h, 420, R1.y + R1.h - 6],
  ];
  return (
    <g className="pl-room">
      <rect x={R0.x} y={R0.y} width={R0.w} height={R0.h} className="pl-ghost" />
      <rect x={R1.x} y={R1.y} width={R1.w} height={R1.h} pathLength={1} className="pl-wall pl-wall--shift" style={d(3)} />
      {arrows.map(([x1, y1, x2, y2], i) => (
        <g key={i} className="pl-arrow" style={d(6 + i)}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1} />
          <circle cx={x2} cy={y2} r="4" />
        </g>
      ))}
      <text x={R0.x + 10} y={R0.y + 22} className="pl-cap">AS BRIEFED</text>
      <text x={R1.x} y={R1.y - 14} className="pl-cap pl-cap--shift">
        THE SAME CENTRE · MANDATE MOVING
      </text>
      <text x={R1.x + R1.w - 10} y={R1.y + R1.h - 14} className="pl-cap" textAnchor="end">
        PRODUCTS · PLATFORMS · DECISIONS?
      </text>
    </g>
  );
}

function Next({ rooms }: { rooms: string[] }) {
  const cw = R2.w / 3;
  const ch = R2.h / 2;
  const cells = [...rooms, "?"].map((label, i) => ({ label, x: R2.x + (i % 3) * cw, y: R2.y + Math.floor(i / 3) * ch }));
  return (
    <g className="pl-room">
      <rect x={R2.x} y={R2.y} width={R2.w} height={R2.h} pathLength={1} className="pl-wall" style={d(2)} />
      <path d={`M${R2.x + cw} ${R2.y} V${R2.y + R2.h} M${R2.x + 2 * cw} ${R2.y} V${R2.y + R2.h} M${R2.x} ${R2.y + ch} H${R2.x + R2.w}`} pathLength={1} style={d(4)} />
      {cells.map((c, i) => (
        <g key={c.label} className={`pl-own${c.label === "?" ? " pl-own--open" : ""}`} style={d(6 + i)}>
          <rect x={c.x + 8} y={c.y + 8} width={cw - 16} height={ch - 16} />
          <text x={c.x + 22} y={c.y + (c.label === "?" ? 86 : 40)} className={c.label === "?" ? "pl-big" : "pl-room-lab"}>
            {c.label}
          </text>
          {c.label === "?" ? (
            <text x={c.x + 22} y={c.y + ch - 26} className="pl-cap pl-cap--shift">
              YOURS TO DRAW
            </text>
          ) : null}
        </g>
      ))}
      <rect x={R0.x} y={R0.y} width={R0.w} height={R0.h} className="pl-ghost" />
      <text x={R0.x + R0.w - 8} y={R0.y + R0.h - 10} className="pl-cap" textAnchor="end">
        WHERE IT STARTED
      </text>
      <text x={R2.x} y={R2.y - 14} className="pl-cap pl-cap--ink">
        INDIA CENTRE · OWNED
      </text>
    </g>
  );
}

export function Plan({ stage, bays = [], rooms = [], label }: { stage: Stage; bays?: string[]; rooms?: string[]; label: string }) {
  return (
    <figure className={`plan plan--${stage}`} data-reveal>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <Building />
        {stage === "then" ? <Then bays={bays} /> : stage === "now" ? <Now /> : <Next rooms={rooms} />}
      </svg>
    </figure>
  );
}

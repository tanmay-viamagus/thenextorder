"use client";

import { useEffect, useRef } from "react";

/**
 * THE SHIFT — one artwork in three states, driven by scroll (site) or by the
 * clock (film). Every cell is the same square; only its position, size and
 * fill change:
 *   A · a strict grid of identical units — the work as it was given;
 *   B · the grid cracks along a threshold and everything above it slides;
 *   C · the cells fuse into owned volumes; the old grid remains as the
 *       foundation, and one volume is left open.
 * Deterministic (no randomness), so server and client render identically.
 */

type Block = { name: string; c0: number; c1: number; r0: number; r1: number; fill: string; ink: string; open?: boolean };
type Layout = { cols: number; rows: number; cut: number; blocks: Block[] };

const P = 100; // pitch
const IN = 14; // inset of a cell in its pitch (state A/B)
const GAP = 7; // inset at a volume's edge (state C)

const PURPLE = "#6608a9";
const INK = "#0e0d12";
const LILAC = "#f2d0ff";
const TINT = "#b784ec";
const DEEP = "#2f0050";
const MAGENTA = "#fc60db";
const STONE = "#dcd8ce";
const SHEET = "#fcfbf8";

const WIDE: Layout = {
  cols: 16,
  rows: 9,
  cut: 5,
  blocks: [
    { name: "Product", c0: 0, c1: 5, r0: 0, r1: 3, fill: PURPLE, ink: SHEET },
    { name: "Efficiency", c0: 0, c1: 5, r0: 4, r1: 6, fill: TINT, ink: INK },
    { name: "Platforms", c0: 6, c1: 10, r0: 0, r1: 2, fill: INK, ink: SHEET },
    { name: "Capability", c0: 6, c1: 10, r0: 3, r1: 6, fill: DEEP, ink: SHEET },
    { name: "Decisions", c0: 11, c1: 15, r0: 0, r1: 1, fill: MAGENTA, ink: INK },
    { name: "Quality", c0: 11, c1: 15, r0: 2, r1: 4, fill: LILAC, ink: INK },
    { name: "?", c0: 11, c1: 15, r0: 5, r1: 8, fill: SHEET, ink: PURPLE, open: true },
    { name: "The work you were given", c0: 0, c1: 10, r0: 7, r1: 8, fill: STONE, ink: INK },
  ],
};

const TALL: Layout = {
  cols: 6,
  rows: 10,
  cut: 6,
  blocks: [
    { name: "Product", c0: 0, c1: 3, r0: 0, r1: 2, fill: PURPLE, ink: SHEET },
    { name: "Decisions", c0: 4, c1: 5, r0: 0, r1: 1, fill: MAGENTA, ink: INK },
    { name: "Platforms", c0: 4, c1: 5, r0: 2, r1: 4, fill: INK, ink: SHEET },
    { name: "Quality", c0: 0, c1: 1, r0: 3, r1: 5, fill: LILAC, ink: INK },
    { name: "Capability", c0: 2, c1: 3, r0: 3, r1: 5, fill: DEEP, ink: SHEET },
    { name: "?", c0: 4, c1: 5, r0: 5, r1: 7, fill: SHEET, ink: PURPLE, open: true },
    { name: "Efficiency", c0: 0, c1: 3, r0: 6, r1: 7, fill: TINT, ink: INK },
    { name: "The work you were given", c0: 0, c1: 5, r0: 8, r1: 9, fill: STONE, ink: INK },
  ],
};

type Cell = { c: number; r: number; b: number; d: number; pick: boolean };

function cellsFor(L: Layout): Cell[] {
  const out: Cell[] = [];
  for (let r = 0; r < L.rows; r++)
    for (let c = 0; c < L.cols; c++) {
      const b = L.blocks.findIndex((k) => c >= k.c0 && c <= k.c1 && r >= k.r0 && r <= k.r1);
      // the wave travels outward from the threshold
      const d = (Math.abs(r - L.cut + 0.5) / L.rows) * 0.55 + (c / L.cols) * 0.45;
      // a fixed handful above the line turn purple at the crack (state B)
      const pick = r < L.cut && (c * 7 + r * 11) % 9 === 0;
      out.push({ c, r, b, d, pick });
    }
  return out;
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp = (x: number) => Math.max(0, Math.min(1, x));

function geom(L: Layout, k: Cell, ab: number, bc: number) {
  // A
  let x = k.c * P + IN;
  let y = k.r * P + IN;
  let w = P - 2 * IN;
  let h = P - 2 * IN;
  // B: above the cut slides right by half a pitch and lifts to open the crack
  if (k.r < L.cut) {
    x += 50 * ab;
    y -= 16 * ab;
  }
  // C: tile the cell's volume edge to edge
  const B = L.blocks[k.b];
  if (bc > 0 && B) {
    // interior edges overlap by a hair so fused cells show no seams
    const o = 0.75;
    const cx0 = k.c * P + (k.c === B.c0 ? GAP : -o);
    const cx1 = (k.c + 1) * P - (k.c === B.c1 ? GAP : -o);
    const cy0 = k.r * P + (k.r === B.r0 ? GAP : -o);
    const cy1 = (k.r + 1) * P - (k.r === B.r1 ? GAP : -o);
    x += (cx0 - x) * bc;
    y += (cy0 - y) * bc;
    w += (cx1 - cx0 - w) * bc;
    h += (cy1 - cy0 - h) * bc;
  }
  return { x, y, w, h };
}

/** Map overall progress (0–1) to the two transitions: A→B, then B→C, with holds between. */
export function phases(p: number) {
  const ab = clamp((p - 0.16) / 0.24);
  const bc = clamp((p - 0.56) / 0.26);
  return { ab, bc, state: p < 0.34 ? "a" : p < 0.7 ? "b" : "c" };
}

export function ShiftArt({ getProgress, label }: { getProgress?: () => number; label: string }) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const svgs = [...el.querySelectorAll<SVGSVGElement>("svg[data-layout]")];
    const scene = el.closest<HTMLElement>("[data-shift-scene]");
    const scrollProgress = () => {
      if (!scene) return 0;
      const r = scene.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    };
    const read = getProgress ?? scrollProgress;
    const data = svgs.map((svg) => {
      const L = svg.dataset.layout === "tall" ? TALL : WIDE;
      return { svg, L, cells: cellsFor(L), rects: [...svg.querySelectorAll<SVGRectElement>("rect.sa-c")] };
    });
    let last = -1;
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      let p = read();
      // reduced motion: no tweening — the artwork snaps between its three states
      if (reduce.matches) p = p < 0.34 ? 0 : p < 0.7 ? 0.5 : 1;
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      const ph = phases(p);
      (scene ?? el).dataset.state = ph.state;
      el.style.setProperty("--ab", ph.ab.toFixed(3));
      el.style.setProperty("--bc", ph.bc.toFixed(3));
      for (const { L, cells, rects } of data) {
        if (!rects.length || rects[0].getBoundingClientRect().width === 0) continue; // hidden layout
        for (let i = 0; i < cells.length; i++) {
          const k = cells[i];
          const spread = 0.5;
          const ab = ease(clamp(ph.ab * (1 + spread) - k.d * spread));
          const bc = ease(clamp(ph.bc * (1 + spread) - k.d * spread));
          const g = geom(L, k, ab, bc);
          const r = rects[i];
          r.setAttribute("x", g.x.toFixed(1));
          r.setAttribute("y", g.y.toFixed(1));
          r.setAttribute("width", g.w.toFixed(1));
          r.setAttribute("height", g.h.toFixed(1));
          const B = L.blocks[k.b];
          // A → B: a handful above the line turn purple; B → C: every cell takes its volume's colour
          const cracked = k.pick ? mix(SHEET, PURPLE, ab) : SHEET;
          const crackedHex = k.pick && ab > 0.5 ? PURPLE : SHEET;
          r.setAttribute("fill", B && bc > 0 ? mix(crackedHex, B.fill, bc) : cracked);
          r.setAttribute("stroke-opacity", (1 - bc).toFixed(3));
        }
      }
    };
    raf = requestAnimationFrame(draw);
    // keyboard: focusing a state's link scrolls the scene to that state, so focus never lands on a hidden caption
    const onFocus = (e: FocusEvent) => {
      if (!scene || getProgress) return;
      const st = (e.target as HTMLElement).closest?.(".sh__st");
      if (!st) return;
      const p = st.classList.contains("sh__st--a") ? 0.06 : st.classList.contains("sh__st--b") ? 0.48 : 0.94;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + p * (scene.offsetHeight - window.innerHeight), behavior: "instant" });
    };
    scene?.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(raf);
      scene?.removeEventListener("focusin", onFocus);
    };
  }, [getProgress]);

  const render = (L: Layout, kind: "wide" | "tall") => {
    const cells = cellsFor(L);
    const W = L.cols * P;
    const H = L.rows * P;
    return (
      <svg className={`sa sa--${kind}`} data-layout={kind} viewBox={`-20 -40 ${W + 40} ${H + 60}`} role="img" aria-label={label}>
        <g className="sa-cells">
          {cells.map((k, i) => {
            const g = geom(L, k, 0, 0);
            return <rect key={i} className="sa-c" x={g.x} y={g.y} width={g.w} height={g.h} fill={SHEET} />;
          })}
        </g>
        {/* the threshold */}
        <line className="sa-cut" x1={-20} x2={W + 20} y1={L.cut * P - 8} y2={L.cut * P - 8} />
        {/* state C: outlines and names of the volumes */}
        <g className="sa-vol" aria-hidden="true">
          {L.blocks.map((b) => {
            const x = b.c0 * P + GAP;
            const y = b.r0 * P + GAP;
            const w = (b.c1 - b.c0 + 1) * P - 2 * GAP;
            const h = (b.r1 - b.r0 + 1) * P - 2 * GAP;
            return (
              <g key={b.name} className={b.open ? "sa-open" : undefined}>
                {/* a solid volume settles over its fused cells, so no seams show */}
                {b.open ? <rect x={x} y={y} width={w} height={h} className="sa-open__r" /> : <rect x={x} y={y} width={w} height={h} fill={b.fill} />}
                {b.open ? (
                  <>
                    <text x={x + w / 2} y={y + h / 2 + 50} textAnchor="middle" className="sa-q" fill={b.ink}>
                      ?
                    </text>
                    {kind === "wide" ? (
                      <text x={x + 22} y={y + h - 24} className="sa-lab" fill={b.ink}>
                        YOURS TO DEFINE
                      </text>
                    ) : null}
                  </>
                ) : (
                  <text x={x + 22} y={y + 44} className="sa-lab" fill={b.ink}>
                    {b.name.toUpperCase()}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <div className="sa-wrap" ref={root}>
      {render(WIDE, "wide")}
      {render(TALL, "tall")}
    </div>
  );
}

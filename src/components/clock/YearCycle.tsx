"use client";

import { useEffect, useRef } from "react";

/**
 * Three eras as a ring of years: 2001 at the top, clockwise to 2030, exactly
 * 12° a year. A marker travels the years as the visitor scrolls (or on the
 * film's clock) and the years it passes change state:
 *   2001–2019 · the old order        — solid, uniform: built to execute
 *   2020–2024 · the inflection point — shifted out of line, in purple
 *   2025–2030 · the next order       — fused into owned blocks, one left open
 * The boundaries are marked on the ring. The era dates are the story's framing,
 * not data; the figures in the captions carry their own sources.
 */
export const FIRST = 2001;
const YEARS = 30;
const STEP = 360 / YEARS; // 12°
export const INFLECTION = 2020;
export const NEXT = 2025;
const yA = (year: number) => (year - FIRST) * STEP; // angle where a year begins

const OWNED: { from: number; to: number; name: string; fill: string; ink: string; open?: boolean }[] = [
  { from: 2025, to: 2026, name: "Product", fill: "#6608a9", ink: "#fcfbf8" },
  { from: 2027, to: 2028, name: "Platforms", fill: "#0e0d12", ink: "#fcfbf8" },
  { from: 2029, to: 2029, name: "Capability", fill: "#2f0050", ink: "#fcfbf8" },
  { from: 2030, to: 2030, name: "?", fill: "#e9c6fb", ink: "#6608a9", open: true },
];

const R = 430; // band radius
const W = 64; // band width
const GAP = 1.2; // degrees between years
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (a: number, r: number) => [Math.sin(rad(a)) * r, -Math.cos(rad(a)) * r];
const f = (n: number) => n.toFixed(2);
const arc = (a0: number, a1: number, r: number, ccw = false) => {
  const [x0, y0] = pt(ccw ? a1 : a0, r);
  const [x1, y1] = pt(ccw ? a0 : a1, r);
  return `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} ${ccw ? 0 : 1} ${f(x1)} ${f(y1)}`;
};

/** A boundary: a line across the band, out past the year names, then a two-line label. */
function Boundary({ year, lines }: { year: number; lines: [string, string] }) {
  const a = yA(year);
  const [x0, y0] = pt(a, R - W / 2 - 10);
  const [x1, y1] = pt(a, R + W / 2 + 92);
  const left = a > 180;
  const x2 = x1 + (left ? -46 : 46);
  return (
    <g className="yc-bound">
      <polyline points={`${f(x0)},${f(y0)} ${f(x1)},${f(y1)} ${f(x2)},${f(y1)}`} />
      <circle cx={f(x1)} cy={f(y1)} r="7" />
      <text x={f(x2 + (left ? -12 : 12))} y={f(y1 - 16)} textAnchor={left ? "end" : "start"}>
        <tspan className="yc-bound__a">{lines[0]}</tspan>
        <tspan className="yc-bound__b" x={f(x2 + (left ? -12 : 12))} dy="34">
          {lines[1]}
        </tspan>
      </text>
    </g>
  );
}

export function YearCycle({ label, getProgress }: { label: string; getProgress?: () => number }) {
  const svg = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const scene = el.closest<HTMLElement>("[data-era-scene]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const marker = el.querySelector<SVGGElement>(".yc-marker")!;
    const sweep = el.querySelector<SVGPathElement>(".yc-sweep")!;
    const years = [...el.querySelectorAll<SVGPathElement>(".yc-m")];
    const owned = [...el.querySelectorAll<SVGGElement>(".yc-own")];
    let last = -1;
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      let p = 0;
      if (getProgress) p = getProgress();
      else if (scene) {
        const r = scene.getBoundingClientRect();
        p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight)));
      }
      // reduced motion: the marker moves era by era, not continuously
      if (reduce.matches) p = p < 0.4 ? 0.62 : p < 0.75 ? 0.8 : 1;
      if (Math.abs(p - last) < 0.0004) return;
      last = p;
      const A = Math.min(359.9, p * 360);
      const year = Math.min(FIRST + YEARS - 1, FIRST + Math.floor(A / STEP));
      marker.setAttribute("transform", `rotate(${f(A)})`);
      sweep.setAttribute("d", A < 0.5 ? "" : `M0 0 ${arc(0, A, R + W / 2 + 6).replace(/^M/, "L")} Z`);
      const host = scene ?? el.parentElement;
      if (host) {
        host.dataset.era = year < INFLECTION ? "a" : year < NEXT ? "b" : "c";
        host.style.setProperty("--yr", String(year));
      }
      years.forEach((m, i) => {
        const yr = FIRST + i;
        const k = Math.max(0, Math.min(1, (A - i * STEP) / STEP));
        m.dataset.state = k <= 0 ? "" : yr < INFLECTION ? "a" : yr < NEXT ? "b" : "c";
        // the inflection years shift out of line, alternately outward and inward
        const off = yr >= INFLECTION && yr < NEXT ? (i % 2 ? 14 : -12) * k : 0;
        const mid = i * STEP + STEP / 2;
        m.style.transform = off ? `translate(${f(Math.sin(rad(mid)) * off)}px, ${f(-Math.cos(rad(mid)) * off)}px)` : "";
      });
      owned.forEach((o, j) => {
        const k = Math.max(0, Math.min(1, (A - yA(OWNED[j].from)) / STEP));
        o.style.opacity = String(k);
      });
    };
    raf = requestAnimationFrame(draw);
    // keyboard: focusing an era's link moves the marker into that era, so focus never lands on a hidden caption
    const onFocus = (e: FocusEvent) => {
      if (!scene || getProgress) return;
      const st = (e.target as HTMLElement).closest?.(".eras__st");
      if (!st) return;
      const p = st.classList.contains("eras__st--a") ? 0.45 : st.classList.contains("eras__st--b") ? 0.72 : 0.97;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + p * (scene.offsetHeight - window.innerHeight), behavior: "instant" });
    };
    scene?.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(raf);
      scene?.removeEventListener("focusin", onFocus);
    };
  }, [getProgress]);

  const eraPath = (id: string, a0: number, a1: number, ccw = false) => <path id={id} d={arc(a0, a1, R - W / 2 - 30, ccw)} fill="none" />;

  return (
    <svg ref={svg} className="yc" viewBox="-900 -620 1800 1240" role="img" aria-label={label}>
      <defs>
        {eraPath("yc-e1", yA(2001) + 3, yA(INFLECTION) - 3)}
        {eraPath("yc-e2", yA(INFLECTION) + 2, yA(NEXT) - 2, true)}
      </defs>
      <circle r={R + W / 2 + 18} className="yc-rim" />
      <path className="yc-sweep" d="" />
      <circle r={R - W / 2 - 104} className="yc-disc" />

      {/* thirty years */}
      {Array.from({ length: YEARS }, (_, i) => (
        <path key={i} className="yc-m" d={arc(i * STEP + GAP / 2, (i + 1) * STEP - GAP / 2, R)} strokeWidth={W} />
      ))}

      {/* 2025 onward: the years fuse into owned blocks once the marker reaches them */}
      {OWNED.map((o) => {
        const a0 = yA(o.from) + (o.from === NEXT ? GAP / 2 : 0);
        const a1 = yA(o.to + 1) - (o.open ? GAP / 2 : 0);
        const mid = (a0 + a1) / 2;
        // labels sit just inside the band, upright, reading in toward the centre
        const [lx, ly] = pt(mid, R - W / 2 - 18);
        const [qx, qy] = pt(mid, R);
        return (
          <g key={o.name} className={`yc-own${o.open ? " yc-own--open" : ""}`} style={{ opacity: 0 }}>
            <path d={arc(a0, a1, R)} strokeWidth={W} stroke={o.fill} fill="none" />
            {o.open ? (
              <text x={f(qx)} y={f(qy)} className="yc-q" fill={o.ink} textAnchor="middle" dominantBaseline="central">
                ?
              </text>
            ) : (
              <text x={f(lx)} y={f(ly)} className="yc-ol" fill={o.fill} textAnchor={mid > 180 ? "start" : "end"} dominantBaseline="central">
                {o.name}
              </text>
            )}
          </g>
        );
      })}

      {/* every year, upright, at its own centre */}
      {Array.from({ length: YEARS }, (_, i) => {
        const yr = FIRST + i;
        const [x, y] = pt(i * STEP + STEP / 2, R + W / 2 + 46);
        const major = yr % 5 === 0 || yr === FIRST || yr === INFLECTION || yr === NEXT;
        return (
          <text key={yr} x={f(x)} y={f(y)} className={`yc-y${major ? " is-major" : ""}`} textAnchor="middle" dominantBaseline="central">
            {yr}
          </text>
        );
      })}

      {/* the two eras before the next, written along the inside of the ring */}
      <text className="yc-era">
        <textPath href="#yc-e1" startOffset="50%" textAnchor="middle">
          The old order · 2001–2019
        </textPath>
      </text>
      <text className="yc-era">
        <textPath href="#yc-e2" startOffset="50%" textAnchor="middle">
          The inflection point
        </textPath>
      </text>

      {/* where one order ends and the next begins */}
      <Boundary year={INFLECTION} lines={["Old order ends · 2019", "Inflection · 2020"]} />
      <Boundary year={NEXT} lines={["The next order", "Begins 2025"]} />

      {/* the marker travelling the years */}
      <g className="yc-marker">
        <line x1="0" y1={-(R - W / 2 - 8)} x2="0" y2={-(R + W / 2 + 8)} />
        <circle cy={-(R + W / 2 + 8)} r="11" />
      </g>
    </svg>
  );
}

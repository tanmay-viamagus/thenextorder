"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * The year as the transition. Twelve months, January at the top, clockwise,
 * exactly 30° each. A marker travels the year as the visitor scrolls (or on
 * the film's clock); the months it passes change state:
 *   Jan–Apr · the old order — solid, uniform: built to execute
 *   May–Aug · the inflection point — shifted out of line, in purple
 *   Sep–Dec · the next order — fused into owned blocks, one left open
 * A small mark shows today's real position in the year.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const OWNED: { m: number; name: string; fill: string; ink: string; open?: boolean }[] = [
  { m: 8, name: "Product", fill: "#6608a9", ink: "#fcfbf8" },
  { m: 9, name: "Platforms", fill: "#0e0d12", ink: "#fcfbf8" },
  { m: 10, name: "Capability", fill: "#2f0050", ink: "#fcfbf8" },
  { m: 11, name: "?", fill: "#f2d0ff", ink: "#6608a9", open: true },
];

const R = 430; // month band radius
const W = 64; // month band width
const GAP = 1.6; // degrees between months
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (a: number, r: number) => [Math.sin(rad(a)) * r, -Math.cos(rad(a)) * r];
const f = (n: number) => n.toFixed(2);
const arc = (a0: number, a1: number, r: number, ccw = false) => {
  const [x0, y0] = pt(ccw ? a1 : a0, r);
  const [x1, y1] = pt(ccw ? a0 : a1, r);
  return `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} ${ccw ? 0 : 1} ${f(x1)} ${f(y1)}`;
};

const noop = () => () => {};
function todaySnapshot() {
  const now = new Date(Date.now() + 5.5 * 3600e3);
  const y = now.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const days = (Date.UTC(y + 1, 0, 1) - start) / 864e5;
  const doy = (Date.UTC(y, now.getUTCMonth(), now.getUTCDate()) - start) / 864e5;
  return `${(((doy + 0.5) / days) * 360).toFixed(2)}|Today · ${now.getUTCDate()} ${MONTHS[now.getUTCMonth()]}`;
}

export function YearCycle({ label, getProgress }: { label: string; getProgress?: () => number }) {
  const svg = useRef<SVGSVGElement | null>(null);
  // today's position in the year (India time) — read on the client only, so it is always current
  const todayKey = useSyncExternalStore(noop, todaySnapshot, () => "");
  const today = todayKey ? { a: Number(todayKey.split("|")[0]), text: todayKey.split("|")[1] } : null;

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const scene = el.closest<HTMLElement>("[data-era-scene]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const marker = el.querySelector<SVGGElement>(".yc-marker")!;
    const sweep = el.querySelector<SVGPathElement>(".yc-sweep")!;
    const months = [...el.querySelectorAll<SVGPathElement>(".yc-m")];
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
      // reduced motion: the marker moves season by season, not continuously
      if (reduce.matches) p = p < 0.34 ? 0.333 : p < 0.67 ? 0.666 : 1;
      if (Math.abs(p - last) < 0.0004) return;
      last = p;
      const A = Math.min(359.9, p * 360);
      marker.setAttribute("transform", `rotate(${f(A)})`);
      sweep.setAttribute("d", A < 0.5 ? "" : `M0 0 ${arc(0, A, R + W / 2 + 6).replace(/^M/, "L")} Z`);
      if (scene) scene.dataset.era = A < 120 ? "a" : A < 240 ? "b" : "c";
      months.forEach((m, i) => {
        const k = Math.max(0, Math.min(1, (A - i * 30) / 30));
        m.dataset.state = k <= 0 ? "" : i < 4 ? "a" : i < 8 ? "b" : "c";
        // the inflection months shift out of line, alternately outward and inward
        const off = i >= 4 && i < 8 ? (i % 2 ? 14 : -12) * k : 0;
        m.style.transform = off ? `translate(${f(Math.sin(rad(i * 30 + 15)) * off)}px, ${f(-Math.cos(rad(i * 30 + 15)) * off)}px)` : "";
      });
      owned.forEach((o, j) => {
        const i = OWNED[j].m;
        const k = Math.max(0, Math.min(1, (A - i * 30) / 30));
        o.style.opacity = String(k);
      });
    };
    raf = requestAnimationFrame(draw);
    // keyboard: focusing an era's link moves the marker to that season, so focus never lands on a hidden caption
    const onFocus = (e: FocusEvent) => {
      if (!scene || getProgress) return;
      const st = (e.target as HTMLElement).closest?.(".eras__st");
      if (!st) return;
      const p = st.classList.contains("eras__st--a") ? 0.2 : st.classList.contains("eras__st--b") ? 0.52 : 0.95;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + p * (scene.offsetHeight - window.innerHeight), behavior: "instant" });
    };
    scene?.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(raf);
      scene?.removeEventListener("focusin", onFocus);
    };
  }, [getProgress]);

  const eraPath = (id: string, a0: number, a1: number, ccw = false) => <path id={id} d={arc(a0, a1, R - W / 2 - 34, ccw)} fill="none" />;

  return (
    <svg ref={svg} className="yc" viewBox="-760 -620 1520 1240" role="img" aria-label={label}>
      <defs>
        {eraPath("yc-e1", 4, 116)}
        {eraPath("yc-e2", 124, 236, true)}
        {eraPath("yc-e3", 244, 356)}
      </defs>
      <circle r={R + W / 2 + 18} className="yc-rim" />
      <path className="yc-sweep" d="" />

      {/* twelve months */}
      {MONTHS.map((m, i) => (
        <path key={m} className="yc-m" d={arc(i * 30 + GAP / 2, (i + 1) * 30 - GAP / 2, R)} strokeWidth={W} />
      ))}

      {/* Sep–Dec fuse into owned blocks once the marker reaches them */}
      {OWNED.map((o) => {
        const a0 = o.m * 30 + (o.m === 8 ? GAP / 2 : 0);
        const a1 = (o.m + 1) * 30 - (o.m === 11 ? GAP / 2 : 0);
        const mid = o.m * 30 + 15;
        const [x, y] = pt(mid, R);
        const rot = mid > 90 && mid < 270 ? mid - 180 : mid;
        return (
          <g key={o.name} className={`yc-own${o.open ? " yc-own--open" : ""}`} style={{ opacity: 0 }}>
            <path d={arc(a0, a1, R)} strokeWidth={W} stroke={o.fill} fill="none" />
            <text
              x={f(x)}
              y={f(y)}
              transform={`rotate(${f(rot)} ${f(x)} ${f(y)})`}
              fill={o.ink}
              textAnchor="middle"
              dominantBaseline="central"
              className={o.open ? "yc-q" : "yc-ol"}
            >
              {o.open ? "?" : o.name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* month names, upright, exactly at each month's centre */}
      {MONTHS.map((m, i) => {
        const [x, y] = pt(i * 30 + 15, R + W / 2 + 54);
        return (
          <text key={m} x={f(x)} y={f(y)} className="yc-ml" textAnchor="middle" dominantBaseline="central">
            {m.toUpperCase()}
          </text>
        );
      })}

      {/* the three seasons, written along the ring */}
      <text className="yc-era">
        <textPath href="#yc-e1" startOffset="50%" textAnchor="middle">
          The old order
        </textPath>
      </text>
      <text className="yc-era">
        <textPath href="#yc-e2" startOffset="50%" textAnchor="middle">
          The inflection point
        </textPath>
      </text>
      <text className="yc-era">
        <textPath href="#yc-e3" startOffset="50%" textAnchor="middle">
          The next order
        </textPath>
      </text>

      {/* today, at its real place in the year */}
      {today ? (
        <g className="yc-today">
          {(() => {
            const [x0, y0] = pt(today.a, R + W / 2 + 4);
            const [x1, y1] = pt(today.a, R + W / 2 + 26);
            // a bent leader, clear of the month names: out past the ring, then along
            const left = today.a > 180;
            const y2 = y1 + (Math.abs(Math.cos(rad(today.a))) < 0.5 ? (y1 < 0 ? -72 : 72) : 0);
            const x2 = x1 + (left ? -56 : 56);
            return (
              <>
                <polyline points={`${f(x0)},${f(y0)} ${f(x1)},${f(y1)} ${f(x1 + (left ? -28 : 28))},${f(y2)} ${f(x2)},${f(y2)}`} />
                <text x={f(x2 + (left ? -12 : 12))} y={f(y2)} textAnchor={left ? "end" : "start"} dominantBaseline="central">
                  {today.text}
                </text>
              </>
            );
          })()}
        </g>
      ) : null}

      {/* the marker travelling the year */}
      <g className="yc-marker">
        <line x1="0" y1={-(R - W / 2 - 8)} x2="0" y2={-(R + W / 2 + 8)} />
        <circle cy={-(R + W / 2 + 8)} r="11" />
      </g>
      <circle r={R - W / 2 - 62} className="yc-disc" />
    </svg>
  );
}

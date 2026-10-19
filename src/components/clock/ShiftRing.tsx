"use client";

import { useEffect, useRef } from "react";
import { OPEN_FILM } from "@/components/film/FilmOverlay";

/**
 * The hero visual: a monumental circular system cut along one line.
 * Below the line, the old order — three rings of identical segments, aligned.
 * Above it, the next order — each ring has rotated out of alignment, turned
 * lilac, and some segments have fused into owned arcs. The shift settles on
 * arrival and follows the pointer, like the title. Its centre plays the film.
 */
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (a: number, r: number) => [Math.sin(rad(a)) * r, -Math.cos(rad(a)) * r];
const f = (n: number) => n.toFixed(2);
const arc = (a0: number, a1: number, r: number) => {
  const [x0, y0] = pt(a0, r);
  const [x1, y1] = pt(a1, r);
  return `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
};

type Ring = { r: number; n: number; w: number; turn: number; owned: [number, number, string][] };

// turn: how far the upper half rotates at full shift (deg); owned: fused arcs [fromSeg, toSeg, colour]
const RINGS: Ring[] = [
  { r: 440, n: 72, w: 26, turn: 7, owned: [[64, 70, "var(--magenta)"]] },
  { r: 362, n: 48, w: 22, turn: -10, owned: [[3, 8, "var(--vel-violet)"], [40, 44, "var(--lilac)"]] },
  { r: 288, n: 24, w: 18, turn: 15, owned: [[20, 23, "var(--vel-violet)"]] },
];

function Segments({ ring }: { ring: Ring }) {
  const step = 360 / ring.n;
  const gap = step * 0.28;
  return (
    <>
      {Array.from({ length: ring.n }, (_, i) => (
        <path key={i} d={arc(i * step + gap / 2, (i + 1) * step - gap / 2, ring.r)} strokeWidth={ring.w} />
      ))}
    </>
  );
}

export function ShiftRing({ still = false }: { still?: boolean }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    let want = 1;
    let cur = reduce.matches ? 1 : 0;
    let raf = 0;
    const loop = () => {
      cur += (want - cur) * 0.06;
      el.style.setProperty("--s", cur.toFixed(4));
      if (Math.abs(want - cur) > 0.001) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    el.style.setProperty("--s", String(cur));
    const t0 = window.setTimeout(() => {
      if (!raf) raf = requestAnimationFrame(loop);
    }, 500);
    const hero = el.closest("section");
    const onMove = (e: PointerEvent) => {
      if (reduce.matches || !fine.matches) return;
      const r = hero?.getBoundingClientRect();
      if (r && (e.clientY < r.top || e.clientY > r.bottom)) return;
      // left edge: the order holds; right edge: it shifts further
      want = 0.1 + (e.clientX / window.innerWidth) * 1.5;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    // two columns: line the ring's cut up with the title's, so one line runs across the hero
    const box = el.parentElement as HTMLElement;
    const align = () => {
      box.style.setProperty("--ring-dy", "0px");
      const cut = hero?.style.getPropertyValue("--cut-y");
      if (!hero || !cut || window.innerWidth <= 1080) return;
      const h = hero.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const centre = r.top - h.top + r.height / 2;
      box.style.setProperty("--ring-dy", `${(parseFloat(cut) - centre).toFixed(1)}px`);
    };
    const ro = new ResizeObserver(() => requestAnimationFrame(align));
    if (hero) ro.observe(hero);
    void document.fonts?.ready.then(() => requestAnimationFrame(align));
    window.setTimeout(align, 300);
    return () => {
      ro.disconnect();
      window.clearTimeout(t0);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [still]);

  return (
    <div className={`ring${still ? " ring--still" : ""}`}>
      <svg ref={ref} className="ring__svg" viewBox="-720 -520 1200 1040" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
        <defs>
          <clipPath id="ring-up">
            <rect x="-720" y="-520" width="1200" height="520" />
          </clipPath>
          <clipPath id="ring-down">
            <rect x="-720" y="0" width="1200" height="520" />
          </clipPath>
        </defs>

        {/* the old order: aligned, identical, held */}
        <g clipPath="url(#ring-down)" className="ring__old">
          {RINGS.map((r) => (
            <g key={r.r}>
              <Segments ring={r} />
            </g>
          ))}
        </g>

        {/* the next order: the same system, turned out of alignment and reorganised */}
        <g clipPath="url(#ring-up)" className="ring__new">
          {RINGS.map((r) => (
            <g key={r.r} className="ring__turn" style={{ ["--turn" as string]: `${r.turn}deg` }}>
              <Segments ring={r} />
              {r.owned.map(([a, b, c]) => (
                <path
                  key={a}
                  className="ring__owned"
                  d={arc(a * (360 / r.n), (b + 1) * (360 / r.n), r.r)}
                  strokeWidth={r.w + 10}
                  stroke={c}
                  pathLength={1}
                />
              ))}
            </g>
          ))}
        </g>

        {/* the line where one order gives way to the next */}
        <line className="ring__cut" x1="-720" x2="480" y1="0" y2="0" />
        <circle className="ring__node" cx="-440" cy="0" r="9" />
        <circle className="ring__node" cx="440" cy="0" r="9" />
        <text className="ring__lab ring__lab--new" x="-472" y="-22" textAnchor="end">
          The next order ↑
        </text>
        <text className="ring__lab" x="-472" y="42" textAnchor="end">
          ↓ The old order
        </text>
      </svg>
      {still ? null : (
        <button type="button" className="ring__play" onClick={() => window.dispatchEvent(new Event(OPEN_FILM))}>
          <span className="ring__tri" aria-hidden="true" />
          <span className="ring__pl">See what’s changing</span>
          <span className="ring__pt">Film · 0:30</span>
        </button>
      )}
    </div>
  );
}

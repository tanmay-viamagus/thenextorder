"use client";

import { useEffect, useRef } from "react";

/**
 * The NEXT Order runs on a clock. Every dial here shares one geometry:
 * centre (0,0), 0° at twelve, clockwise. All live dials keep India time.
 */
const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (deg: number, r: number) => [Math.sin(rad(deg)) * r, -Math.cos(rad(deg)) * r] as const;
const f = (n: number) => n.toFixed(2);

/** SVG arc path from a0 to a1 (degrees, clockwise) at radius r. */
export function arc(a0: number, a1: number, r: number) {
  const [x0, y0] = pt(a0, r);
  const [x1, y1] = pt(a1, r);
  return `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
}

/** India Standard Time, as fractional h/m/s — no dependence on the visitor's zone. */
function ist() {
  const d = new Date(Date.now() + 5.5 * 3600e3);
  const ms = d.getUTCMilliseconds();
  const s = d.getUTCSeconds();
  const m = d.getUTCMinutes();
  const h = d.getUTCHours();
  return { h, m, s, ms };
}

// a mechanical tick: the hand jumps in the first 160 ms of each second, with a slight overshoot
const tick = (ms: number) => {
  const x = Math.min(1, ms / 160);
  return x < 1 ? 1 - Math.pow(1 - x, 3) * Math.cos(x * 5) : 1;
};

function Ticks({ r = 460, major = 46, minor = 18 }: { r?: number; major?: number; minor?: number }) {
  return (
    <g className="ck-ticks">
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0;
        const [x0, y0] = pt(i * 6, r);
        const [x1, y1] = pt(i * 6, r - (big ? major : minor));
        return <line key={i} x1={f(x0)} y1={f(y0)} x2={f(x1)} y2={f(y1)} className={big ? "ck-t ck-t--h" : "ck-t"} />;
      })}
    </g>
  );
}

/* ---------------------------------------------------------------- three hands, one clock */
/**
 * A real clock (IST) whose three hands are the three practices:
 * Velocity AI the second hand, Synthia AI the minute hand, Viamagus Select
 * the hour hand — pinned on the Viamagus mark. [data-hl] on the wrapper
 * highlights one hand (set by hovering its panel).
 */
export function HandsClock({ label, hl }: { label: string; hl?: string }) {
  const svg = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const [hh, mm, ss] = ["h", "m", "s"].map((k) => el.querySelector<SVGGElement>(`[data-hand="${k}"]`)!);
    let raf = 0;
    let visible = false;
    const draw = () => {
      raf = visible ? requestAnimationFrame(draw) : 0;
      const { h, m, s, ms } = ist();
      const sec = reduce.matches ? s : s - 1 + tick(ms);
      ss.setAttribute("transform", `rotate(${f(sec * 6)})`);
      mm.setAttribute("transform", `rotate(${f((m + s / 60) * 6)})`);
      hh.setAttribute("transform", `rotate(${f(((h % 12) + m / 60) * 30)})`);
    };
    draw();
    // only run while the clock is on screen
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(el);
    // hovering or focusing a practice lights its hand (unless a parent drives it)
    const sec = hl === undefined ? el.closest("section") : null;
    const wrap = el.parentElement!;
    const on = (e: Event) => {
      const k = (e.target as HTMLElement).closest?.<HTMLElement>("[data-practice]")?.dataset.practice;
      if (k) wrap.dataset.hl = k;
    };
    const off = (e: Event) => {
      const to = (e as PointerEvent | FocusEvent).relatedTarget as HTMLElement | null;
      if (!to?.closest?.("[data-practice]")) delete wrap.dataset.hl;
    };
    sec?.addEventListener("pointerover", on);
    sec?.addEventListener("focusin", on);
    sec?.addEventListener("pointerout", off);
    sec?.addEventListener("focusout", off);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      sec?.removeEventListener("pointerover", on);
      sec?.removeEventListener("focusin", on);
      sec?.removeEventListener("pointerout", off);
      sec?.removeEventListener("focusout", off);
    };
  }, [hl]);

  return (
    <div className="hc" data-hl={hl}>
      <svg ref={svg} className="hc__dial" viewBox="-500 -500 1000 1000" role="img" aria-label={label}>
        <circle r="498" className="ck-face" />
        <Ticks />
        <g data-hand="h" className="hc-hand hc-hand--select">
          <rect x="-16" y="-250" width="32" height="300" rx="2" />
        </g>
        <g data-hand="m" className="hc-hand hc-hand--synthia">
          <rect x="-8" y="-390" width="16" height="440" rx="2" />
        </g>
        <g data-hand="s" className="hc-hand hc-hand--velocity">
          <rect x="-2.5" y="-455" width="5" height="555" />
          <circle cy="-455" r="11" />
        </g>
        <circle r="74" className="hc-pin" />
        <g transform="translate(-48 -19) scale(3.15)" className="hc-mark">
          <path d="M0,0l6.7765,11.8958l6.7764,-11.8958z" />
          <path d="M23.7177,0l-3.3881,5.9479l-3.3882,-5.9479l-6.7764,11.8955h20.3291z" />
        </g>
      </svg>
    </div>
  );
}

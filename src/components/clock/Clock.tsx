"use client";

import { useEffect, useRef, useState } from "react";

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

const pad = (n: number) => String(n).padStart(2, "0");
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

/**
 * The opening: a live clock (IST). Its seconds also drive --sec on
 * [data-clock-root], which the cut title uses to tick forward each second.
 */
export function LiveClock() {
  const svg = useRef<SVGSVGElement | null>(null);
  const [read, setRead] = useState("IST --:--:--");

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const root = el.closest<HTMLElement>("[data-clock-root]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const [hh, mm, ss] = ["h", "m", "s"].map((k) => el.querySelector<SVGGElement>(`[data-hand="${k}"]`)!);
    let raf = 0;
    let lastS = -1;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const { h, m, s, ms } = ist();
      const sec = reduce.matches ? s : s - 1 + tick(ms);
      ss.setAttribute("transform", `rotate(${f(sec * 6)})`);
      mm.setAttribute("transform", `rotate(${f((m + s / 60) * 6)})`);
      hh.setAttribute("transform", `rotate(${f(((h % 12) + m / 60) * 30)})`);
      if (s !== lastS) {
        lastS = s;
        setRead(`IST ${pad(h)}:${pad(m)}:${pad(s)}`);
        if (root && !reduce.matches) root.style.setProperty("--sec", String(s));
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="lc">
      <svg ref={svg} className="lc__dial" viewBox="-500 -500 1000 1000" aria-hidden="true">
        <circle r="498" className="ck-face" />
        <Ticks />
        <g data-hand="h">
          <rect x="-11" y="-250" width="22" height="290" className="ck-hand" />
        </g>
        <g data-hand="m">
          <rect x="-6" y="-400" width="12" height="440" className="ck-hand" />
        </g>
        <g data-hand="s">
          <rect x="-1.75" y="-455" width="3.5" height="545" className="ck-sec" />
          <circle cy="-455" r="9" className="ck-sec" />
        </g>
        <circle r="16" className="ck-pin" />
      </svg>
      <p className="lc__read" aria-hidden="true">
        {read}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- the eras dial (scroll) */
type EraVol = { name: string; a0: number; a1: number; color: string; ink: string; open?: boolean };
const VOLS: EraVol[] = [
  { name: "Product", a0: 241, a1: 263, color: "#6608a9", ink: "#fcfbf8" },
  { name: "Platforms", a0: 265, a1: 287, color: "#0e0d12", ink: "#fcfbf8" },
  { name: "Decisions", a0: 289, a1: 311, color: "#fc60db", ink: "#0e0d12" },
  { name: "Capability", a0: 313, a1: 335, color: "#2f0050", ink: "#fcfbf8" },
  { name: "?", a0: 337, a1: 359, color: "#f2d0ff", ink: "#6608a9", open: true },
];

/**
 * One hand, one revolution, three eras. The scroll position of
 * [data-era-scene] turns the hand; the ticks it passes change character:
 * 12–4 regular (as given) · 4–8 cracked out of line · 8–12 fused into owned arcs.
 */
export function EraClock({ label, getProgress }: { label: string; getProgress?: () => number }) {
  const svg = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const scene = el.closest<HTMLElement>("[data-era-scene]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hand = el.querySelector<SVGGElement>("[data-hand]")!;
    const sweep = el.querySelector<SVGPathElement>(".ec-sweep")!;
    const ticks = [...el.querySelectorAll<SVGLineElement>(".ec-t")];
    const vols = [...el.querySelectorAll<SVGPathElement>(".ec-vol")];
    const labs = [...el.querySelectorAll<SVGTextElement>(".ec-vlab")];
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
      // reduced motion: the hand moves era by era, not continuously
      if (reduce.matches) p = p < 0.34 ? 0.3 : p < 0.67 ? 0.63 : 1;
      if (Math.abs(p - last) < 0.0004) return;
      last = p;
      const A = p * 360;
      hand.setAttribute("transform", `rotate(${f(A)})`);
      sweep.setAttribute("d", A < 0.5 ? "" : `M0 0 L0 -470 ${arc(0, Math.min(A, 359.9), 470).replace(/^M[^A]+/, "")} Z`);
      if (scene) scene.dataset.era = A < 120 ? "a" : A < 240 ? "b" : "c";
      ticks.forEach((t, i) => {
        const a = i * 6;
        const passed = A >= a;
        const k = passed ? Math.min(1, (A - a) / 18) : 0;
        let r0 = 460;
        let len = i % 5 === 0 ? 46 : 22;
        let rot = 0;
        let cls = "ec-t";
        if (a < 120) cls += passed ? " is-a" : "";
        else if (a < 240) {
          // cracked: alternate ticks jump out of line and lean
          if (passed) {
            r0 += (i % 2 ? 14 : -10) * k;
            rot = (i % 3 === 0 ? 4 : -3) * k;
            len += 4 * k;
            cls += " is-b";
          }
        } else if (passed) cls += " is-c";
        const [x0, y0] = pt(a + rot, r0);
        const [x1, y1] = pt(a - rot * 0.4, r0 - len);
        t.setAttribute("x1", f(x0));
        t.setAttribute("y1", f(y0));
        t.setAttribute("x2", f(x1));
        t.setAttribute("y2", f(y1));
        t.setAttribute("class", cls);
      });
      // owned arcs fill in behind the hand
      vols.forEach((v, i) => {
        const V = VOLS[i];
        const k = Math.max(0, Math.min(1, (A - V.a0) / (V.a1 - V.a0)));
        v.style.strokeDashoffset = String(1 - k);
        labs[i].style.opacity = String(Math.max(0, Math.min(1, (k - 0.6) / 0.4)));
      });
    };
    raf = requestAnimationFrame(draw);
    // keyboard: focusing an era's link turns the hand to that era, so focus never lands on a hidden caption
    const onFocus = (e: FocusEvent) => {
      if (!scene || getProgress) return;
      const st = (e.target as HTMLElement).closest?.(".eras__st");
      if (!st) return;
      const p = st.classList.contains("eras__st--a") ? 0.18 : st.classList.contains("eras__st--b") ? 0.5 : 0.95;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + p * (scene.offsetHeight - window.innerHeight), behavior: "instant" });
    };
    scene?.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(raf);
      scene?.removeEventListener("focusin", onFocus);
    };
  }, [getProgress]);

  const eraLab = (a: number, text: string) => {
    const [x, y] = pt(a + 4, 528);
    return (
      <text x={f(x)} y={f(y)} className="ec-era" textAnchor={a > 180 ? "end" : "start"}>
        {text}
      </text>
    );
  };

  return (
    <svg ref={svg} className="ec" viewBox="-640 -600 1280 1200" role="img" aria-label={label}>
      <circle r="498" className="ec-face" />
      <path className="ec-sweep" d="" />
      {/* era boundaries */}
      {[0, 120, 240].map((a) => {
        const [x0, y0] = pt(a, 498);
        const [x1, y1] = pt(a, 560);
        return <line key={a} x1={f(x0)} y1={f(y0)} x2={f(x1)} y2={f(y1)} className="ec-bound" />;
      })}
      {eraLab(0, "XII · The old order")}
      {eraLab(120, "IV · The inflection point")}
      {eraLab(240, "VIII · The next order")}
      <g>
        {Array.from({ length: 60 }, (_, i) => {
          const [x0, y0] = pt(i * 6, 460);
          const [x1, y1] = pt(i * 6, 460 - (i % 5 === 0 ? 46 : 22));
          return <line key={i} className="ec-t" x1={f(x0)} y1={f(y0)} x2={f(x1)} y2={f(y1)} />;
        })}
      </g>
      {VOLS.map((v) => (
        <path key={v.name} className={`ec-vol${v.open ? " ec-vol--open" : ""}`} d={arc(v.a0, v.a1, 425)} pathLength={1} stroke={v.color} />
      ))}
      {VOLS.map((v) => {
        const mid = (v.a0 + v.a1) / 2;
        const [x, y] = pt(mid, 425);
        // read along the ring, never upside-down
        const rot = mid > 90 && mid < 270 ? mid - 180 : mid;
        return (
          <text
            key={v.name}
            x={f(x)}
            y={f(y)}
            transform={`rotate(${f(rot)} ${f(x)} ${f(y)})`}
            className={`ec-vlab${v.open ? " ec-vlab--q" : ""}`}
            fill={v.ink}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {v.open ? "?" : v.name.toUpperCase()}
          </text>
        );
      })}
      <g data-hand>
        <rect x="-5" y="-470" width="10" height="530" className="ec-hand" />
        <circle cy="-470" r="14" className="ec-hand" />
      </g>
      {/* the inner face carries the words; the hand reads as a sweep around it */}
      <circle r="318" className="ec-disc" />
    </svg>
  );
}

/* ---------------------------------------------------------------- three hands, one clock */
/**
 * A real clock (IST) whose three hands are the three practices:
 * Velocity AI the second hand, Synthia AI the minute hand, ViaMagus Select
 * the hour hand — pinned on the ViaMagus mark. [data-hl] on the wrapper
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
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const { h, m, s, ms } = ist();
      const sec = reduce.matches ? s : s - 1 + tick(ms);
      ss.setAttribute("transform", `rotate(${f(sec * 6)})`);
      mm.setAttribute("transform", `rotate(${f((m + s / 60) * 6)})`);
      hh.setAttribute("transform", `rotate(${f(((h % 12) + m / 60) * 30)})`);
    };
    raf = requestAnimationFrame(draw);
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

/* ---------------------------------------------------------------- countdown */
/** Counts down to the event once its start is confirmed; until then it says so, honestly. */
export function Countdown({ startsAt }: { startsAt: string | null }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!startsAt) return;
    const target = new Date(startsAt).getTime();
    const upd = () => setLeft(Math.max(0, target - Date.now()));
    upd();
    const t = window.setInterval(upd, 1000);
    return () => window.clearInterval(t);
  }, [startsAt]);

  const parts: [string, string][] =
    left === null
      ? [
          ["––", "Days"],
          ["––", "Hours"],
          ["––", "Minutes"],
          ["––", "Seconds"],
        ]
      : [
          [pad(Math.floor(left / 864e5)), "Days"],
          [pad(Math.floor(left / 36e5) % 24), "Hours"],
          [pad(Math.floor(left / 6e4) % 60), "Minutes"],
          [pad(Math.floor(left / 1e3) % 60), "Seconds"],
        ];
  return (
    <div className="cd" role="timer" aria-live="off" aria-label={startsAt ? "Time until The NEXT Order" : "Date to be announced"}>
      {parts.map(([n, l]) => (
        <div key={l} className={`cd__u${left === null ? " is-tba" : ""}`}>
          <span className="cd__n">{n}</span>
          <span className="cd__l">{l}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- the film's timing dial */
/** A dial for the 30 s film: one arc per scene, the hand as the playhead. */
export function FilmDial({ scenes, t, duration }: { scenes: { id: string; start: number; end: number }[]; t: number; duration: number }) {
  const A = (s: number) => (s / duration) * 360;
  return (
    <svg className="fd" viewBox="-130 -130 260 260" aria-hidden="true">
      <circle r="118" className="fd-face" />
      {scenes.map((s) => (
        <path key={s.id} d={arc(A(s.start) + 1.5, A(s.end) - 1.5, 104)} className={`fd-seg${t >= s.start && t < s.end ? " is-on" : ""}`} />
      ))}
      {scenes.map((s) => {
        const [x, y] = pt(A(s.start), 124);
        return <circle key={s.id} cx={f(x)} cy={f(y)} r="3" className="fd-dot" />;
      })}
      <g transform={`rotate(${f(A(t))})`}>
        <rect x="-2" y="-112" width="4" height="122" className="fd-hand" />
      </g>
      <circle r="7" className="fd-pin" />
    </svg>
  );
}

/** A still clock (no motion) — for the social card. */
export function StillClock({ h, m, s }: { h: number; m: number; s: number }) {
  return (
    <svg className="lc__dial" viewBox="-500 -500 1000 1000" aria-hidden="true">
      <circle r="498" className="ck-face" />
      <Ticks />
      <rect x="-11" y="-250" width="22" height="290" className="ck-hand" transform={`rotate(${f(((h % 12) + m / 60) * 30)})`} />
      <rect x="-6" y="-400" width="12" height="440" className="ck-hand" transform={`rotate(${f((m + s / 60) * 6)})`} />
      <g transform={`rotate(${f(s * 6)})`}>
        <rect x="-1.75" y="-455" width="3.5" height="545" className="ck-sec" />
        <circle cy="-455" r="9" className="ck-sec" />
      </g>
      <circle r="16" className="ck-pin" />
    </svg>
  );
}

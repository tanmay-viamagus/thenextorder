"use client";

import { useEffect, useRef } from "react";
import { CLOSE_FILM, OPEN_FILM } from "../film/FilmOverlay";
import { BRAND, createLightField, type RGB } from "../film/shader";

/**
 * The world behind the site: the film's light field, fixed full-screen,
 * driven by where the reader is in the story.
 *
 * Scroll is native (no scroll-jacking). On larger screens each chapter is a
 * sticky stage; its progress `--p` is eased toward the scroll position so the
 * type glides. Each beat is a segment (`data-seg="a b"`): only the active one
 * is interactive, its local progress is `--q`, and its `data-look` sets the
 * light. On small screens and with reduced motion ("flow" mode) chapters are
 * laid out in normal flow and the active beat is whatever sits mid-screen.
 */

type Look = { energy: number; mono: number; c1: RGB; c2: RGB; flash?: number };

const VEL: Pick<Look, "c1" | "c2"> = { c1: [0.58, 0.0, 1.0], c2: [0.0, 0.78, 0.81] };
const SYN: Pick<Look, "c1" | "c2"> = { c1: [0.4, 0.03, 0.66], c2: [0.75, 0.4, 1.0] };
const SEL: Pick<Look, "c1" | "c2"> = { c1: [0.62, 0.36, 0.05], c2: [0.96, 0.72, 0.24] };

const LOOKS: Record<string, Look> = {
  hero: { energy: 0.42, mono: 0, ...BRAND },
  old: { energy: 0.13, mono: 1, ...BRAND },
  rules: { energy: 0.95, mono: 0, ...BRAND, flash: 0.9 },
  signal: { energy: 0.3, mono: 0, ...BRAND, flash: 0.35 },
  closing: { energy: 0.6, mono: 0, ...BRAND, flash: 0.5 },
  "next-intro": { energy: 0.55, mono: 0, ...BRAND, flash: 0.6 },
  velocity: { energy: 0.62, mono: 0, ...VEL, flash: 0.6 },
  synthia: { energy: 0.62, mono: 0, ...SYN, flash: 0.6 },
  select: { energy: 0.62, mono: 0, ...SEL, flash: 0.6 },
  converge: { energy: 0.8, mono: 0, ...BRAND, flash: 0.8 },
  mark: { energy: 0.04, mono: 0, ...BRAND, flash: 0.25 },
  title: { energy: 0.85, mono: 0, ...BRAND, flash: 0.6 },
  invite: { energy: 0.3, mono: 0, ...BRAND },
};

const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

type Seg = { el: HTMLElement; a: number; b: number; look: string };
type Chapter = { el: HTMLElement; p: number; segs: Seg[]; look: string };

export function World() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const cursor = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const flowQuery = window.matchMedia("(max-width: 899px), (prefers-reduced-motion: reduce)");
    const field = canvas.current ? createLightField(canvas.current, window.innerWidth < 900 ? 0.34 : 0.5) : null;

    const chapters: Chapter[] = Array.from(document.querySelectorAll<HTMLElement>("[data-ch]")).map((el) => ({
      el,
      p: 0,
      look: el.dataset.look ?? "hero",
      segs: Array.from(el.querySelectorAll<HTMLElement>("[data-seg]")).map((s) => {
        const [a, b] = (s.dataset.seg ?? "0 1").split(" ").map(Number);
        return { el: s, a, b, look: s.dataset.look ?? el.dataset.look ?? "hero" };
      }),
    }));

    const cur = { energy: 0.42, mono: 0, c1: [...BRAND.c1] as RGB, c2: [...BRAND.c2] as RGB, flash: 0 };
    let look = "";
    let film = false;
    let raf = 0;
    let last = performance.now();
    const t0 = last;

    // chapters no taller than the screen (hero, invite) progress over one screen of scroll
    const span = (el: HTMLElement) => {
      const extra = el.offsetHeight - window.innerHeight;
      return extra > 1 ? extra : window.innerHeight;
    };
    const targetP = (el: HTMLElement) => clamp01(-el.getBoundingClientRect().top / span(el));

    // keyboard: focusing something inside a beat scrolls to where that beat is fully shown
    const onFocus = (e: FocusEvent) => {
      if (flowQuery.matches) return;
      const t = e.target as HTMLElement;
      const segEl = t.closest<HTMLElement>("[data-seg]");
      const ch = chapters.find((c) => c.el.contains(t));
      if (!segEl || !ch) return;
      const seg = ch.segs.find((s) => s.el === segEl);
      if (!seg) return;
      const p = seg.a + (Math.min(seg.b, 1) - seg.a) * 0.6;
      const top = ch.el.getBoundingClientRect().top + window.scrollY + span(ch.el) * p;
      window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
      ch.p = p; // no easing lag for keyboard users
    };
    document.addEventListener("focusin", onFocus);

    // the pointer: bends the light, and drives the cell cursor (mouse/trackpad only, motion allowed)
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const ptr = { x: window.innerWidth / 2, y: window.innerHeight / 2, sx: window.innerWidth / 2, sy: window.innerHeight / 2, pull: 0, moved: 0, hot: false };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.moved = performance.now();
      ptr.hot = !!(e.target as HTMLElement).closest?.("a, button");
      cursor.current?.classList.add("is-on");
    };
    const onLeave = () => cursor.current?.classList.remove("is-on");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    let lastY = window.scrollY;
    let surge = 0;

    const onOpen = () => (film = true);
    const onClose = () => (film = false);
    window.addEventListener(OPEN_FILM, onOpen);
    window.addEventListener(CLOSE_FILM, onClose);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (film || document.hidden) return;

      const flow = flowQuery.matches;
      const vh = window.innerHeight;
      const ease = flow ? 1 : 1 - Math.exp(-dt * 9);
      let active = "hero";

      for (const ch of chapters) {
        const r = ch.el.getBoundingClientRect();
        const near = r.bottom > -vh && r.top < vh * 2;
        if (!near) continue;
        ch.p = flow ? 1 : mix(ch.p, targetP(ch.el), ease);
        if (Math.abs(ch.p - targetP(ch.el)) < 0.0005) ch.p = targetP(ch.el);
        ch.el.style.setProperty("--p", ch.p.toFixed(4));
        const inMid = r.top <= vh * 0.5 && r.bottom > vh * 0.5;
        if (inMid) active = ch.look;

        for (const s of ch.segs) {
          let on: boolean;
          let q: number;
          if (flow) {
            const sr = s.el.getBoundingClientRect();
            on = sr.top <= vh * 0.6 && sr.bottom > vh * 0.4;
            q = clamp01((vh * 0.85 - sr.top) / Math.max(1, sr.height * 0.8));
          } else {
            on = ch.p >= s.a && (ch.p < s.b || s.b >= 1);
            q = clamp01((ch.p - s.a) / (s.b - s.a));
          }
          s.el.style.setProperty("--q", q.toFixed(4));
          if (s.el.classList.contains("is-active") !== on) {
            s.el.classList.toggle("is-active", on);
            s.el.classList.toggle("is-playing", on);
          }
          if (on && inMid) active = s.look;
        }
      }

      const target = LOOKS[active] ?? LOOKS.hero;
      if (active !== look) {
        if (look) cur.flash = Math.max(cur.flash, target.flash ?? 0.3);
        look = active;
        root.dataset.look = active;
      }
      const k = Math.min(1, dt * 3.2);
      cur.energy = mix(cur.energy, target.energy, k);
      cur.mono = mix(cur.mono, target.mono, k);
      for (let i = 0; i < 3; i++) {
        cur.c1[i] = mix(cur.c1[i], target.c1[i], k);
        cur.c2[i] = mix(cur.c2[i], target.c2[i], k);
      }
      cur.flash *= Math.exp(-dt * 5);

      // a fast scroll surges the light a little
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      surge = Math.max(surge * Math.exp(-dt * 3), Math.min(0.28, (dy / vh) * 2.2));

      // the pointer eases toward the cursor; pull fades when the mouse rests
      const kp = 1 - Math.exp(-dt * 7);
      ptr.sx = mix(ptr.sx, ptr.x, kp);
      ptr.sy = mix(ptr.sy, ptr.y, kp);
      const wantPull = fine.matches && !flow && now - ptr.moved < 2600 ? 1 : 0;
      ptr.pull = mix(ptr.pull, wantPull, 1 - Math.exp(-dt * 2.5));
      const c = cursor.current;
      if (c) {
        c.style.transform = `translate3d(${ptr.sx.toFixed(1)}px, ${ptr.sy.toFixed(1)}px, 0)`;
        c.classList.toggle("is-hot", ptr.hot);
      }

      const max = root.scrollHeight - vh;
      root.style.setProperty("--progress", (max > 0 ? window.scrollY / max : 0).toFixed(4));
      root.style.setProperty("--flash", (cur.flash * cur.flash).toFixed(3));
      field?.render({
        time: (now - t0) / 1000,
        energy: Math.min(1, cur.energy + (flow ? 0 : surge)),
        flash: flow ? 0 : cur.flash * 0.8,
        mouse: [(ptr.sx - window.innerWidth / 2) / vh, -(ptr.sy - vh / 2) / vh],
        pull: ptr.pull,
        mono: cur.mono,
        c1: cur.c1,
        c2: cur.c2,
      });
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      field?.dispose();
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener(OPEN_FILM, onOpen);
      window.removeEventListener(CLOSE_FILM, onClose);
    };
  }, []);

  return (
    <>
      <canvas className="world" ref={canvas} aria-hidden="true" />
      <div className="world-flash" aria-hidden="true" />
      <div className="cell-cursor" ref={cursor} aria-hidden="true">
        <i />
      </div>
      <div className="thread" aria-hidden="true">
        <i />
      </div>
    </>
  );
}

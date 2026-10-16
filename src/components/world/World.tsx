"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { OPEN_FILM, CLOSE_FILM } from "../film/FilmOverlay";
import { BRAND, createLightField, type RGB } from "../film/shader";

/**
 * The world behind the site: the film's light field, fixed full-screen,
 * scrubbed by scroll. One loop does everything — smooth scroll (Lenis),
 * each chapter's `--p`, the light's colour/energy per chapter, the flash on
 * every turn of the story, and the progress thread.
 */

type Look = { energy: number; mono: number; c1: RGB; c2: RGB; phase: string };

const VEL = { c1: [0.58, 0.0, 1.0] as RGB, c2: [0.0, 0.78, 0.81] as RGB };
const SYN = { c1: [0.4, 0.03, 0.66] as RGB, c2: [0.75, 0.4, 1.0] as RGB };
const SEL = { c1: [0.62, 0.36, 0.05] as RGB, c2: [0.96, 0.72, 0.24] as RGB };

function look(id: string, p: number): Look {
  switch (id) {
    case "order":
      return p < 0.55
        ? { energy: 0.12, mono: 1, ...BRAND, phase: "order:old" }
        : { energy: 0.95, mono: 0, ...BRAND, phase: "order:shift" };
    case "forces": {
      const k = Math.min(2, Math.floor(p * 3));
      return { energy: 0.62, mono: 0, ...[VEL, SYN, SEL][k], phase: `forces:${k}` };
    }
    case "signal":
      return { energy: 0.28, mono: 0, ...BRAND, phase: "signal" };
    case "finale":
      return p < 0.5
        ? { energy: 0.04, mono: 0, ...BRAND, phase: "finale:logo" }
        : { energy: 0.8, mono: 0, ...BRAND, phase: "finale:title" };
    case "invite":
      return { energy: 0.32, mono: 0, ...BRAND, phase: "invite" };
    default:
      return { energy: 0.42, mono: 0, ...BRAND, phase: "hero" };
  }
}

const mix = (a: number, b: number, k: number) => a + (b - a) * k;

export function World() {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 900;
    const field = canvas.current ? createLightField(canvas.current, small ? 0.34 : 0.5) : null;
    const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-ch]"));
    const forces = document.querySelector<HTMLElement>("[data-ch='forces']");
    const lenis = reduce ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: true });

    const cur = { energy: 0.42, mono: 0, c1: [...BRAND.c1] as RGB, c2: [...BRAND.c2] as RGB, flash: 0 };
    let phase = "";
    let film = false;
    let raf = 0;
    let last = performance.now();
    const t0 = last;

    const onOpen = () => {
      film = true;
      lenis?.stop();
    };
    const onClose = () => {
      film = false;
      lenis?.start();
    };
    window.addEventListener(OPEN_FILM, onOpen);
    window.addEventListener(CLOSE_FILM, onClose);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      lenis?.raf(now);
      if (film || document.hidden) return;

      const vh = window.innerHeight;
      let active = "hero";
      let activeP = 0;
      for (const el of chapters) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const span = r.height - vh > 1 ? r.height - vh : vh;
        const p = Math.min(1, Math.max(0, -r.top / span));
        el.style.setProperty("--p", p.toFixed(4));
        if (r.top <= vh * 0.5 && r.bottom > vh * 0.5) {
          active = el.dataset.ch ?? "hero";
          activeP = p;
        }
      }

      // the forces chapter: which force is on, and its demo plays only while it's on
      if (forces) {
        const p = Number(forces.style.getPropertyValue("--p") || 0);
        const k = Math.min(2, Math.floor(p * 3));
        if (forces.dataset.k !== String(k)) {
          forces.dataset.k = String(k);
          forces.querySelectorAll<HTMLElement>(".force").forEach((f, i) => f.classList.toggle("is-playing", i === k));
        }
      }

      const target = look(active, activeP);
      if (target.phase !== phase) {
        if (phase) cur.flash = Math.max(cur.flash, target.phase.startsWith("finale:logo") ? 0.3 : 0.75);
        phase = target.phase;
        root.dataset.phase = phase;
      }
      const k = Math.min(1, dt * 3.2);
      cur.energy = mix(cur.energy, target.energy, k);
      cur.mono = mix(cur.mono, target.mono, k);
      for (let i = 0; i < 3; i++) {
        cur.c1[i] = mix(cur.c1[i], target.c1[i], k);
        cur.c2[i] = mix(cur.c2[i], target.c2[i], k);
      }
      cur.flash *= Math.exp(-dt * 5);

      const max = document.documentElement.scrollHeight - vh;
      root.style.setProperty("--progress", (max > 0 ? window.scrollY / max : 0).toFixed(4));
      root.style.setProperty("--flash", (cur.flash * cur.flash).toFixed(3));
      field?.render({ time: (now - t0) / 1000, energy: cur.energy, flash: cur.flash * 0.8, mono: cur.mono, c1: cur.c1, c2: cur.c2 });
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      field?.dispose();
      window.removeEventListener(OPEN_FILM, onOpen);
      window.removeEventListener(CLOSE_FILM, onClose);
    };
  }, []);

  return (
    <>
      <canvas className="world" ref={canvas} aria-hidden="true" />
      <div className="world-flash" aria-hidden="true" />
      <div className="thread" aria-hidden="true">
        <i />
      </div>
    </>
  );
}

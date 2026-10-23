"use client";

import { useEffect } from "react";

/**
 * One gesture, one page — for the whole site.
 *
 * Every snap point on the page (each part of the story, each stage of the
 * GCC evolution, and on a phone the second half of a part that can't fit one
 * screen) is a page. A wheel notch, a trackpad gesture or a swipe moves
 * exactly one page, and the momentum that follows is absorbed. Inside a page
 * taller than the screen (the form) scrolling is left alone, so it reads
 * normally. Keyboard and programmatic scrolling are never intercepted; with
 * reduced motion the jump is instant.
 */
const SNAPS = ".hero2, .evo__snap, .sy, .sy__agenda-col, .sy__r, .wa, .wa__pair, .close, .ftr";

export function Pager() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(SNAPS)];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const positions = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const out: number[] = [];
      for (const el of els) {
        const cs = getComputedStyle(el);
        const align = cs.scrollSnapAlign.split(" ").pop();
        if (!align || align === "none") continue;
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        const p = align === "end" ? top + r.height - window.innerHeight : top - (parseFloat(cs.scrollMarginTop) || 0);
        out.push(Math.round(Math.min(max, Math.max(0, p))));
      }
      return [...new Set(out)].sort((a, b) => a - b);
    };

    /** the page one step away, or null when the next one is more than a screen off (read on normally) */
    const target = (dir: 1 | -1): number | null => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const ps = positions();
      const p = dir > 0 ? ps.find((q) => q > y + 2) : [...ps].reverse().find((q) => q < y - 2);
      if (p === undefined || Math.abs(p - y) > vh + 4) return null;
      return p;
    };

    let busyUntil = 0;
    let quietTimer = 0;
    const markBusy = () => {
      busyUntil = Math.max(busyUntil, performance.now() + 700);
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(() => (busyUntil = 0), 240);
    };
    const go = (p: number) => {
      window.scrollTo({ top: p, behavior: reduce.matches ? "instant" : "smooth" });
      markBusy();
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (performance.now() < busyUntil) {
        // the gesture that just turned a page, or its momentum: absorb all of it
        e.preventDefault();
        markBusy();
        return;
      }
      if (Math.abs(e.deltaY) < 4) return;
      const p = target(dir);
      if (p === null) return;
      e.preventDefault();
      go(p);
    };

    // touch: one swipe = one page
    let startY = 0;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = startY - e.touches[0].clientY;
      const dx = startX - e.touches[0].clientX;
      if (Math.abs(dy) < 6 || Math.abs(dx) > Math.abs(dy)) return;
      if (target(dy > 0 ? 1 : -1) !== null) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 28 || performance.now() < busyUntil) return;
      const p = target(dy > 0 ? 1 : -1);
      if (p !== null) go(p);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.clearTimeout(quietTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
  return null;
}

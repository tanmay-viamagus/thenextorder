"use client";

import { useEffect } from "react";

/**
 * One gesture, one page — and every page change is a slow, eased glide.
 *
 * Every snap point on the page (each part of the story, each stage of the
 * GCC evolution, and on a phone the second half of a part that can't fit one
 * screen) is a page. A wheel notch, a trackpad gesture, a swipe, Page
 * Up/Down, Space or an arrow key moves exactly one page; the header's
 * chapter links and the hand-offs glide the same way. The glide is ours
 * (about two-thirds of a second, cubic in-out); the browser's snapping is paused while it
 * runs. Momentum after a gesture is absorbed, but a fresh swipe always turns
 * the next page. Inside a
 * page taller than the screen (the form) scrolling is left alone. With
 * reduced motion every move is instant.
 */
const SNAPS = ".hero2, .evo__snap, .sy, .sy__agenda-col, .sy__r, .wa, .wa__pair, .close, .ftr";

/** cubic in-out: answers at once, travels, and lands softly */
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export function Pager() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(SNAPS)];
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const positions = () => {
      const max = root.scrollHeight - window.innerHeight;
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

    // after a glide, the rest of that gesture's momentum is absorbed — but only
    // while it is dying away: a fresh swipe (a bigger delta) turns the next page
    let busyUntil = 0;
    let lastDelta = 0;
    const markBusy = () => {
      busyUntil = performance.now() + 380;
    };

    // the glide
    let raf = 0;
    let gliding = false;
    const glide = (to: number) => {
      cancelAnimationFrame(raf);
      const from = window.scrollY;
      const d = to - from;
      if (reduce.matches || Math.abs(d) < 2) {
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, to);
        root.style.scrollBehavior = "";
        markBusy();
        return;
      }
      const dur = Math.min(820, 560 + Math.abs(d) * 0.08);
      const t0 = performance.now();
      gliding = true;
      // every step is placed exactly: no CSS smooth-scrolling on top of ours
      root.style.scrollBehavior = "auto";
      const done = () => {
        gliding = false;
        root.style.scrollBehavior = "";
        markBusy();
      };
      const step = (now: number) => {
        try {
          const t = Math.min(1, (now - t0) / dur);
          window.scrollTo(0, from + d * ease(t));
          if (t < 1) raf = requestAnimationFrame(step);
          else done();
        } catch {
          done();
        }
      };
      raf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const mag = Math.abs(e.deltaY);
      const fresh = mag > lastDelta * 1.6 + 6;
      lastDelta = mag;
      if (gliding || (performance.now() < busyUntil && !fresh)) {
        // the gesture that turned the page, or its dying momentum: absorb it
        e.preventDefault();
        if (!gliding) markBusy();
        return;
      }
      if (mag < 4) return;
      const p = target(e.deltaY > 0 ? 1 : -1);
      if (p === null) return;
      e.preventDefault();
      glide(p);
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
      if (gliding || target(dy > 0 ? 1 : -1) !== null) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 28 || gliding || performance.now() < busyUntil) return;
      const p = target(dy > 0 ? 1 : -1);
      if (p !== null) glide(p);
    };

    // the keyboard pages the same way — never while typing or on a control
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.closest("input, textarea, select, button, [contenteditable], .rf, .film-overlay") || el.isContentEditable)) return;
      const down = ["PageDown", "ArrowDown", " "].includes(e.key) && !e.shiftKey;
      const up = ["PageUp", "ArrowUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      if (gliding) {
        e.preventDefault();
        return;
      }
      const p = target(down ? 1 : -1);
      if (p === null) return;
      e.preventDefault();
      glide(p);
    };

    // in-page links (the header's chapters, the hand-offs) glide to their page
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      const cs = getComputedStyle(el);
      const top = el.getBoundingClientRect().top + window.scrollY - (parseFloat(cs.scrollMarginTop) || 0);
      glide(Math.max(0, Math.min(root.scrollHeight - window.innerHeight, Math.round(top))));
      history.replaceState(history.state, "", `#${id}`);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}

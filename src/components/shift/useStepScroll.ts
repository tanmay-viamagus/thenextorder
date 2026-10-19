"use client";

import { useEffect, type RefObject } from "react";

/**
 * One gesture, one step — for the pinned scenes only.
 *
 * While a pinned section fills the screen, each wheel/trackpad/touch gesture
 * moves exactly one step (to the next snap point), and the momentum that
 * follows the gesture is absorbed. At the first or last step the gesture is
 * left alone, so the page scrolls on normally. Keyboard and programmatic
 * scrolling are never intercepted.
 */
export function useStepScroll(ref: RefObject<HTMLElement | null>, steps: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el || steps < 2) return;

    const geom = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight;
      return { top, span };
    };
    /** the current step, or null when the section isn't pinned on screen */
    const current = () => {
      const { top, span } = geom();
      const y = window.scrollY;
      if (y < top - 2 || y > top + span + 2) return null;
      return Math.round(((y - top) / Math.max(1, span)) * (steps - 1));
    };
    const goTo = (k: number) => {
      const { top, span } = geom();
      window.scrollTo({ top: top + (k / (steps - 1)) * span, behavior: "instant" });
    };

    // a gesture is "busy" until its momentum has died away
    let busyUntil = 0;
    let quietTimer = 0;
    const markBusy = () => {
      busyUntil = Math.max(busyUntil, performance.now() + 650);
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(() => (busyUntil = 0), 220);
    };

    const step = (dir: 1 | -1): boolean => {
      const k = current();
      if (k === null) return false;
      const next = k + dir;
      if (next < 0 || next > steps - 1) return false; // let the page move on
      goTo(next);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const k = current();
      if (k === null) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const now = performance.now();
      if (now < busyUntil) {
        // still the gesture that just moved a step (or its momentum): absorb all of it,
        // even at the last step — only a fresh gesture leaves the scene
        e.preventDefault();
        markBusy();
        return;
      }
      if (Math.abs(e.deltaY) < 4) return;
      if (step(dir)) {
        e.preventDefault();
        markBusy();
      }
    };

    // touch: one swipe = one step
    let startY = 0;
    let tracking = false;
    const onTouchStart = (e: TouchEvent) => {
      tracking = current() !== null;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!tracking) return;
      const k = current();
      if (k === null) return;
      const dir = startY - e.touches[0].clientY > 0 ? 1 : -1;
      const edge = (dir === 1 && k === steps - 1) || (dir === -1 && k === 0);
      if (!edge) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 28) return;
      step(dy > 0 ? 1 : -1);
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
  }, [ref, steps]);
}

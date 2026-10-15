"use client";

import { useEffect, useRef } from "react";
import { Triptych } from "./Triptych";

/**
 * Scroll pulls the thread: the frame is a little taller than the screen, the
 * stage sticks, and scroll progress through it becomes `--p` on the triptych.
 * Below 900px the shutters stack and each drops as it enters.
 */
export function ForcesShutters() {
  const frame = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = frame.current;
    const tri = el?.querySelector<HTMLElement>(".tri");
    if (!el || !tri) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 899px)");
    let raf = 0;
    let last = -1;

    const update = () => {
      raf = 0;
      let p = 1;
      if (!reduce.matches && !small.matches) {
        const r = el.getBoundingClientRect();
        const span = Math.max(1, r.height - window.innerHeight);
        p = Math.min(1, Math.max(0, -r.top / span) / 0.78);
      }
      p = Math.round(p * 1000) / 1000;
      if (p === last) return;
      last = p;
      tri.style.setProperty("--p", String(p));
      const done = p >= 0.999;
      tri.classList.toggle("is-complete", done);
      tri.classList.toggle("is-playing", done);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // small screens: each shutter drops as it scrolls in
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-down")),
      { threshold: 0.25 },
    );
    tri.querySelectorAll(".tri__col").forEach((c) => io.observe(c));

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="pull" ref={frame}>
      <div className="pull__stage">
        <div className="pull__behind" aria-hidden="true">
          <p className="pull__big">Three forces.</p>
          <p className="pull__hint">Scroll to pull the thread</p>
        </div>
        <h2 className="sr-only">Build. Operate. Scale. — three forces, one operating model.</h2>
        <Triptych mode="site" />
      </div>
    </div>
  );
}

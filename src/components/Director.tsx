"use client";

import { useEffect } from "react";

/**
 * Marks the frame in view (header tone, counter, dots) and toggles `is-live`
 * so each frame's animations play when you arrive — and replay if you return.
 */
export function Director() {
  useEffect(() => {
    const root = document.documentElement;
    const frames = Array.from(document.querySelectorAll<HTMLElement>("[data-frame]"));
    const counter = document.getElementById("frame-no");
    const dots = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-dot]"));

    const live = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("is-live", e.isIntersecting);
      },
      { threshold: 0.3 },
    );

    const active = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const i = frames.indexOf(el);
          root.dataset.tone = el.dataset.tone ?? "dark";
          if (counter) counter.textContent = String(i + 1).padStart(2, "0");
          dots.forEach((d) => (d.dataset.dot === el.id ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current")));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    frames.forEach((f) => {
      live.observe(f);
      active.observe(f);
    });
    return () => {
      live.disconnect();
      active.disconnect();
    };
  }, []);
  return null;
}

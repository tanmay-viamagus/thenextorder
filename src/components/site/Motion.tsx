"use client";

import { useEffect, useRef } from "react";

/**
 * All site motion, none of it pinned or scroll-jacking:
 *  - `[data-r]` elements get `.in` when they enter (CSS does the reveal),
 *  - `[data-count]` figures count up once,
 *  - `[data-par]` giant verbs drift with their section's position (`--t`),
 *  - the header picks its ink from the field under it (`data-ink`),
 *  - a small cell cursor follows a mouse (never on touch or reduced motion).
 */
export function Motion() {
  const cursor = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const count = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? "";
      const comma = el.dataset.comma !== undefined;
      const fmt = (n: number) => (comma ? n.toLocaleString("en-IN") : String(n)) + suffix;
      if (reduce.matches) return void (el.textContent = fmt(to));
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1100);
        el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-r]").forEach((el) => io.observe(el));

    // header ink follows the field beneath it
    const hdr = document.querySelector<HTMLElement>(".hdr");
    const fields = Array.from(document.querySelectorAll<HTMLElement>("[data-ink]"));
    const pars = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"));

    // stacked fields: desktop with motion only
    const stackQuery = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    const layoutStack = () => {
      const on = stackQuery.matches;
      root.classList.toggle("stack", on);
      sections.forEach((sec, i) => {
        sec.style.zIndex = on ? String(i + 1) : "";
        sec.style.top = on ? `${Math.min(0, window.innerHeight - sec.offsetHeight)}px` : "";
      });
    };
    layoutStack();
    window.addEventListener("resize", layoutStack);

    // keyboard: a focused element is always revealed, and with stacked fields we scroll to
    // where its field is fully uncovered (the next field hasn't started sliding over it yet)
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      t.closest<HTMLElement>("[data-r]")?.classList.add("in");
      if (!stackQuery.matches) return;
      const sec = t.closest<HTMLElement>("main > section");
      const i = sec ? sections.indexOf(sec) : -1;
      if (!sec || i < 0) return;
      const naturalTop = sections.slice(0, i).reduce((a, s2) => a + s2.offsetHeight, 0);
      const vh = window.innerHeight;
      const within = t.getBoundingClientRect().top - sec.getBoundingClientRect().top;
      const max = naturalTop + Math.max(0, sec.offsetHeight - vh);
      const y = Math.min(max, Math.max(naturalTop, naturalTop + within - vh * 0.5));
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    };
    document.addEventListener("focusin", onFocus);
    stackQuery.addEventListener("change", layoutStack);

    // cursor
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const ptr = { x: -100, y: -100, sx: -100, sy: -100, hot: false };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.hot = !!(e.target as HTMLElement).closest?.("a, button");
      cursor.current?.classList.add("is-on");
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const vh = window.innerHeight;

      const probe = 34; // just under the header
      const under = [...fields].reverse().find((f) => {
        const r = f.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe;
      });
      const ink = under?.dataset.ink ?? "light";
      if (hdr && hdr.dataset.ink !== ink) {
        hdr.dataset.ink = ink;
        root.dataset.ink = ink;
      }
      // the header takes the colour of the field under it, so it never sits on top of text
      if (hdr && under) {
        const bg = getComputedStyle(under).backgroundColor;
        if (hdr.style.backgroundColor !== bg) hdr.style.backgroundColor = bg;
      }

      if (!reduce.matches) {
        for (const el of pars) {
          const r = el.getBoundingClientRect();
          if (r.bottom < -vh || r.top > vh * 2) continue;
          const t = (r.top + r.height / 2 - vh / 2) / vh; // 0 when centred
          el.style.setProperty("--t", Math.max(-1.5, Math.min(1.5, t)).toFixed(3));
        }
      }

      // how far the next field has slid over each one
      if (stackQuery.matches) {
        for (let i = 0; i < sections.length - 1; i++) {
          // dim only by the amount the next field actually overlaps this one
          const overlap = sections[i].getBoundingClientRect().bottom - sections[i + 1].getBoundingClientRect().top;
          const cover = Math.max(0, Math.min(1, overlap / vh));
          sections[i].style.setProperty("--cover", cover.toFixed(3));
        }
      }

      const max = root.scrollHeight - vh;
      root.style.setProperty("--progress", (max > 0 ? window.scrollY / max : 0).toFixed(4));

      if (fine.matches && cursor.current) {
        const k = 1 - Math.exp(-dt * 16);
        ptr.sx += (ptr.x - ptr.sx) * k;
        ptr.sy += (ptr.y - ptr.sy) * k;
        cursor.current.style.transform = `translate3d(${ptr.sx.toFixed(1)}px, ${ptr.sy.toFixed(1)}px, 0)`;
        cursor.current.classList.toggle("is-hot", ptr.hot);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", layoutStack);
      document.removeEventListener("focusin", onFocus);
      stackQuery.removeEventListener("change", layoutStack);
    };
  }, []);

  return (
    <>
      <div className="cell-cursor" ref={cursor} aria-hidden="true">
        <i />
      </div>
      <div className="progress" aria-hidden="true">
        <i />
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * The signature: monumental type cut along one threshold. Everything above
 * the line shifts — the type and, in the hero, the whole field of cells
 * behind it (it shares --s and --cut-y with [data-shift-root]). The shift
 * settles once on arrival, then follows the pointer. The copies are
 * decorative; the real heading is an sr-only h1 beside it.
 */
export function ShiftTitle({
  lines,
  cutLine,
  edges,
  still = false,
  tick = false,
}: {
  lines: string[];
  cutLine: number;
  edges?: [string, string];
  /** no pointer response (closing / register) */
  still?: boolean;
  /** driven by the live clock's seconds (--sec on [data-clock-root]) instead of the pointer */
  tick?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = el.closest<HTMLElement>("[data-shift-root]") ?? el;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    // the threshold: through the middle of the cut line's letters
    const place = () => {
      const line = el.querySelectorAll<HTMLElement>(".st__l")[cutLine];
      if (!line) return;
      const top = line.offsetTop + line.offsetHeight * 0.56;
      el.style.setProperty("--cut", `${top}px`);
      if (root !== el) {
        const y = el.getBoundingClientRect().top - root.getBoundingClientRect().top + top;
        root.style.setProperty("--cut-y", `${y}px`);
      }
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(root);
    void document.fonts?.ready.then(place);
    if (still || tick) return () => ro.disconnect();

    let raf = 0;
    let want = 1;
    let cur = reduce.matches ? 1 : 0;
    const set = (v: number) => {
      el.style.setProperty("--s", v.toFixed(4));
      if (root !== el) root.style.setProperty("--s", v.toFixed(4));
    };
    const loop = () => {
      cur += (want - cur) * 0.08;
      set(cur);
      if (Math.abs(want - cur) > 0.001) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (reduce.matches || !fine.matches) return;
      const r = root.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      // left edge → the shift undone; right edge → pushed further
      want = -0.15 + (e.clientX / window.innerWidth) * 2.1;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    set(cur);
    const t0 = window.setTimeout(() => {
      if (!raf) raf = requestAnimationFrame(loop);
    }, 650);
    return () => {
      window.clearTimeout(t0);
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [cutLine, still, tick]);

  const block = (cls: string) => (
    <div className={`st__layer ${cls}`} aria-hidden="true">
      {lines.map((l, i) => (
        <span key={i} className="st__l">
          {l}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`st${still ? " st--still" : ""}${tick ? " st--tick" : ""}`} ref={ref} data-reveal={still ? "" : undefined}>
      {block("st__below")}
      {block("st__above")}
      <span className="st__cut" aria-hidden="true" />
      {edges ? (
        <>
          <span className="st__edge st__edge--a" aria-hidden="true">
            {edges[0]}
          </span>
          <span className="st__edge st__edge--b" aria-hidden="true">
            {edges[1]}
          </span>
        </>
      ) : null}
    </div>
  );
}

/** Adds .is-in to every [data-reveal] once it enters the viewport — once only, never tied to scroll position. */
export function Reveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -15% 0px", threshold: 0.05 },
    );
    els.forEach((e) => io.observe(e));
    // keyboard focus never lands on content that hasn't faded in yet
    const onFocus = (e: FocusEvent) => (e.target as HTMLElement).closest?.("[data-reveal]")?.classList.add("is-in");
    document.addEventListener("focusin", onFocus);
    // the practice diagrams replay when a panel is entered
    const panels = [...document.querySelectorAll<HTMLElement>(".pnl")];
    const replay = (e: Event) => {
      const m = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(".mech.is-in");
      if (!m || m.dataset.busy) return;
      m.dataset.busy = "1";
      m.classList.remove("is-in");
      void m.offsetWidth;
      m.classList.add("is-in");
      window.setTimeout(() => delete m.dataset.busy, 3200);
    };
    panels.forEach((p) => p.addEventListener("pointerenter", replay));
    // a scene whose light comes on as you arrive (the doorway): lit while in
    // view, dark again once it has left — so it plays from the start each visit
    const lights = [...document.querySelectorAll<HTMLElement>("[data-light]")];
    const lio =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => entries.forEach((en) => en.target.classList.toggle("is-lit", en.isIntersecting)),
            { rootMargin: "-18% 0px -18% 0px" },
          )
        : null;
    lights.forEach((e) => (lio ? lio.observe(e) : e.classList.add("is-lit")));
    return () => {
      io.disconnect();
      lio?.disconnect();
      document.removeEventListener("focusin", onFocus);
      panels.forEach((p) => p.removeEventListener("pointerenter", replay));
    };
  }, []);
  return null;
}

/** Header ink follows the scene beneath it; the story line follows the chapter you are in. */
export function Chrome() {
  useEffect(() => {
    const root = document.documentElement;
    const scenes = [...document.querySelectorAll<HTMLElement>("[data-tone]")];
    const hero = document.getElementById("top");
    const chapters = [...document.querySelectorAll<HTMLElement>(".story li[data-for]")].map((li) => ({
      li,
      a: li.querySelector("a"),
      el: document.getElementById(li.dataset.for ?? ""),
    }));
    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = 30;
      const under = scenes.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe;
      });
      root.dataset.hdr = under?.dataset.tone ?? "light";
      // the header's call to action waits until the hero's own has scrolled away — never two at once
      root.classList.toggle("past-hero", hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.25 : true);
      let act = "";
      for (const a of document.querySelectorAll<HTMLElement>("[data-act]")) if (a.getBoundingClientRect().top < window.innerHeight * 0.5) act = a.dataset.act ?? "";
      root.dataset.act = act;
      // the story line: which chapter you're in, and how far into it
      const mark = window.innerHeight * 0.5;
      const tops = chapters.map((c) => c.el?.getBoundingClientRect().top ?? Infinity);
      let ch = -1;
      tops.forEach((t, k) => {
        if (t < mark) ch = k;
      });
      // --sp: 0 at the first stop, 1 at the last — each stop an equal step along the line
      const into = ch >= 0 && ch < tops.length - 1 ? Math.min(1, Math.max(0, (mark - tops[ch]) / (tops[ch + 1] - tops[ch]))) : 0;
      root.style.setProperty("--sp", ch < 0 ? "0" : Math.min(1, (ch + into) / (tops.length - 1)).toFixed(3));
      chapters.forEach((c, k) => {
        c.li?.classList.toggle("is-on", k === ch);
        c.li?.classList.toggle("is-done", k < ch);
        if (k === ch) c.a?.setAttribute("aria-current", "location");
        else c.a?.removeAttribute("aria-current");
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    // a link to a section: the browser jumped before the pinned scenes took their
    // full height, so it landed short — aim again now the page is laid out
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const aim = target
      ? requestAnimationFrame(() => {
          // a jump, not a glide: smooth scrolling is for links clicked on the page
          const root = document.documentElement;
          root.style.scrollBehavior = "auto";
          target.scrollIntoView({ block: "start" });
          root.style.scrollBehavior = "";
        })
      : 0;
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(aim);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return null;
}

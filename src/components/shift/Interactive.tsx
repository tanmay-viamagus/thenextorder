"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * The signature: monumental type cut along one threshold. Everything above
 * the line is shifted. The shift settles once on load and then follows the
 * pointer across the hero. Copies are decorative; the real heading is the sr-only h1.
 */
export function ShiftTitle({ lines, cutLine, edges }: { lines: string[]; cutLine: number; edges?: [string, string] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    // measure where the threshold falls: the middle of the cut line's x-height
    const place = () => {
      const line = el.querySelectorAll<HTMLElement>(".st__l")[cutLine];
      if (!line) return;
      const top = line.offsetTop + line.offsetHeight * 0.56;
      el.style.setProperty("--cut", `${top}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    void document.fonts?.ready.then(place);
    el.classList.add("is-set");

    let raf = 0;
    let want = 1;
    // the shift settles once on arrival (skipped for reduced motion)
    let cur = reduce.matches ? 1 : 0;
    const loop = () => {
      cur += (want - cur) * 0.08;
      el.style.setProperty("--s", cur.toFixed(4));
      if (Math.abs(want - cur) > 0.001) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (reduce.matches || !fine.matches) return;
      const r = el.getBoundingClientRect();
      if (e.clientY > r.bottom + 200) return;
      // left edge → the shift undone; right edge → pushed further
      want = -0.15 + (e.clientX / window.innerWidth) * 2.1;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.style.setProperty("--s", String(cur));
    const t0 = window.setTimeout(() => {
      if (!raf) raf = requestAnimationFrame(loop);
    }, 650);
    return () => {
      window.clearTimeout(t0);
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [cutLine]);

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
    <div className="st" ref={ref}>
      {block("st__below")}
      {block("st__above")}
      <span className="st__cut" aria-hidden="true" />
      {edges ? (
        <>
          <span className="st__edge st__edge--l" aria-hidden="true">
            {edges[0]}
          </span>
          <span className="st__edge st__edge--r" aria-hidden="true">
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
      { rootMargin: "0px 0px -18% 0px", threshold: 0.05 },
    );
    els.forEach((e) => io.observe(e));
    // keyboard focus never lands on content that hasn't faded in yet
    const onFocus = (e: FocusEvent) => (e.target as HTMLElement).closest?.("[data-reveal]")?.classList.add("is-in");
    document.addEventListener("focusin", onFocus);
    return () => {
      io.disconnect();
      document.removeEventListener("focusin", onFocus);
    };
  }, []);
  return null;
}

/** Header ink follows the scene under it; the mobile CTA bar appears after the hero and steps aside at the form. */
export function Chrome() {
  useEffect(() => {
    const root = document.documentElement;
    const scenes = [...document.querySelectorAll<HTMLElement>("[data-tone]")];
    const hero = document.getElementById("top");
    const form = document.getElementById("attend");
    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = 32;
      const under = scenes.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe;
      });
      root.dataset.hdr = under?.dataset.tone ?? "light";
      const pastHero = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.4 : true;
      const atForm = form ? form.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      root.classList.toggle("show-bar", pastHero && !atForm);
      // act progress for the header index
      const acts = [...document.querySelectorAll<HTMLElement>("[data-act]")];
      let act = "";
      for (const a of acts) if (a.getBoundingClientRect().top < window.innerHeight * 0.5) act = a.dataset.act ?? "";
      root.dataset.act = act;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return null;
}

/** GCC → GIC → ? — the visitor builds a label from what their centre owns. Exploratory, and says so. */
export function NameTheCentre({ owns, note }: { owns: string[]; note: string }) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (o: string) => setPicked((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o].slice(-2)));
  const word = picked.length === 0 ? null : picked.length === 1 ? picked[0] : `${picked[0]} & ${picked[1]}`;
  const initials = picked.length ? `G${picked.map((p) => p[0]).join("")}C` : "?";
  return (
    <div className="ntc">
      <p className="ntc__ask" id="ntc-ask">
        What does your centre own — or want to? <span>Pick up to two.</span>
      </p>
      <div className="ntc__chips" role="group" aria-labelledby="ntc-ask">
        {owns.map((o) => (
          <button key={o} type="button" className="chip" aria-pressed={picked.includes(o)} onClick={() => toggle(o)}>
            {o}
          </button>
        ))}
      </div>
      <div className="ntc__out" aria-live="polite">
        <span className="ntc__abbr">{initials}</span>
        <span className="ntc__full">{word ? `Global ${word} Centre` : "Your centre’s name, from its mandate"}</span>
      </div>
      <p className="ntc__note">{note}</p>
    </div>
  );
}

/** One framing question per seat at the table. */
export function Seats({ seats }: { seats: { seat: string; q: string }[] }) {
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, k: number) => {
    const n = seats.length;
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (k + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (k - 1 + n) % n : -1;
    if (to < 0) return;
    e.preventDefault();
    setI(to);
    refs.current[to]?.focus();
  };
  return (
    <div className="seats">
      <p className="seats__k" id="seats-k">
        Questions for the room — choose your seat
      </p>
      <div className="seats__tabs" role="radiogroup" aria-labelledby="seats-k">
        {seats.map((s, k) => (
          <button
            key={s.seat}
            ref={(el) => {
              refs.current[k] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === k}
            tabIndex={i === k ? 0 : -1}
            className="chip chip--seat"
            onClick={() => setI(k)}
            onKeyDown={(e) => onKey(e, k)}
          >
            {s.seat}
          </button>
        ))}
      </div>
      <p key={i} className="seats__q" aria-live="polite" style={{ ["--n" as string]: i } as CSSProperties}>
        {seats[i].q}
      </p>
      <p className="seats__note">These frame the conversation. They are not the agenda.</p>
    </div>
  );
}

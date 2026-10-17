"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { event, interestUrl, officialLinks, whenWhere } from "@/content/event";
import { forces, inflection, nextOrder, oldOrder, questions, theme } from "@/content/story";
import { ViaMagusLogo } from "../Brand";
import { FilmButton } from "../film/FilmOverlay";
import { Engine } from "./engine";
import { buildStory, F, highlighter, type Story } from "./story";

/* the seven chapters and the formation each one holds */
const CH = [
  { id: "arrive", f: F.title, ink: "light" },
  { id: "old", f: F.pyramid, ink: "dark" },
  { id: "break", f: F.shatter, ink: "dark" },
  { id: "stake", f: F.eight, ink: "light" },
  { id: "forces", f: F.forces, ink: "light" },
  { id: "mark", f: F.mark, ink: "light" },
  { id: "move", f: F.cell, ink: "light" },
] as const;

const HOLD = 0.58; // share of each chapter where its formation holds still
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const cta = event.registrationUrl ?? interestUrl;
const ctaExternal = !event.registrationUrl;
const stake = inflection.signals[3]; // BCG 8%
const invest = inflection.signals[0]; // EY 58%

/* kinetic type: words rise from behind a mask when their chapter is on */
function K({ as: Tag = "p", text, className = "" }: { as?: "p" | "h2" | "h1"; text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <Tag className={`k ${className}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="k__w">
            <span className="k__i" style={{ "--i": i } as CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

function Cta({ children = "Request an invitation", className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <a className={`btn btn--hot mag ${className}`} href={cta} target={ctaExternal ? "_blank" : undefined} rel="noopener noreferrer">
      <span>{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        →
      </span>
      {ctaExternal ? <span className="sr-only"> (opens viamagus.com in a new tab)</span> : null}
    </a>
  );
}

function ProofLine({ k }: { k: number }) {
  const p = forces[k].proof;
  if (p.kind === "swap")
    return (
      <p className="proof">
        <s>{p.from}</s> <b>{p.to}</b>
      </p>
    );
  if (p.kind === "ledger")
    return (
      <p className="proof">
        <s>Draft</s> <b>Signed ✓</b>
      </p>
    );
  return (
    <p className="proof">
      <b>{p.value}</b>
    </p>
  );
}

export function OrderSite() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(0);
  const [k, setK] = useState<number | null>(null);
  const [geo, setGeo] = useState<Story["geo"] | null>(null);
  const [seat, setSeat] = useState(0);
  const kRef = useRef<number | null>(null);
  const userPicked = useRef(false);
  const line = whenWhere();

  useEffect(() => {
    kRef.current = k;
  }, [k]);

  /* the engine */
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.innerWidth < 760;
    let engine: Engine;
    try {
      engine = new Engine(cv, small ? 2600 : 5600);
    } catch {
      root.classList.add("no-gl", "ready");
      return;
    }
    engine.rigid = reduce.matches;
    const secs = CH.map((c) => document.getElementById(c.id)!);
    let story: Story | null = null;
    let hl: ReturnType<typeof highlighter> | null = null;
    let assembled = false;
    let holding = false;
    let raf = 0;
    let last = performance.now();
    const t0 = last;
    let currentActive = -1;
    let forcesAmount = 0;
    let dtNow = 0.016;

    const family = getComputedStyle(document.body).fontFamily.split(",")[0].trim();
    const build = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      engine.resize(w, h, Math.min(2, window.devicePixelRatio || 1));
      story = buildStory(w, h, engine.n, family);
      engine.formations = story.formations;
      hl = highlighter(story);
      setGeo(story.geo);
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      build();
      engine.snap(F.chaos);
      root.classList.add("ready");
      // the order assembles itself shortly after arrival
      window.setTimeout(() => (assembled = true), reduce.matches ? 0 : 650);
      raf = requestAnimationFrame(tick);
    };

    engine.shape = (tx, n) => hl?.(tx, n, kRef.current, forcesAmount, dtNow);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      dtNow = dt;
      if (document.hidden || root.classList.contains("film-open")) return;
      const vh = window.innerHeight;
      const mid = window.scrollY + vh * 0.5;
      let i = 0;
      for (let s = 0; s < secs.length; s++) if (secs[s].offsetTop <= mid) i = s;
      const sec = secs[i];
      const u = (mid - sec.offsetTop) / Math.max(1, sec.offsetHeight);
      const fOf = (s: number) => (s === 0 && !assembled ? F.chaos : CH[s].f);
      const a = fOf(i);
      let b = a;
      let t = 0;
      if (i < CH.length - 1 && u > HOLD) {
        b = fOf(i + 1);
        t = ease(Math.min(1, (u - HOLD) / (1 - HOLD)));
      }
      engine.a = a;
      engine.b = b;
      engine.t = t;
      forcesAmount = (a === F.forces ? 1 - t : 0) + (b === F.forces ? t : 0);

      const want = holding && !reduce.matches ? 1 : 0;
      engine.scatter += (want - engine.scatter) * Math.min(1, dt * (want ? 3 : 5));

      const act = t > 0.5 ? i + 1 : i;
      if (act !== currentActive) {
        currentActive = act;
        setActive(act);
        root.dataset.ink = CH[act].ink;
      }
      engine.step(dt, (now - t0) / 1000);
      engine.render();
    };

    // pointer: cells part around the cursor / finger
    const onMove = (e: PointerEvent) => {
      engine.pointer.x = e.clientX;
      engine.pointer.y = e.clientY;
      engine.pointer.on = !reduce.matches && (e.pointerType === "mouse" || e.buttons > 0);
      engine.pointer.r = e.pointerType === "mouse" ? 130 : 90;
    };
    const onLeave = () => (engine.pointer.on = false);
    // keyboard: focusing into a chapter that isn't live yet brings it in, so focus never lands on faded content
    const onFocusIn = (e: FocusEvent) => {
      const sec = (e.target as HTMLElement).closest?.<HTMLElement>(".ch");
      const idx = sec ? secs.indexOf(sec) : -1;
      if (!sec || idx < 0 || idx === currentActive) return;
      window.scrollTo({ top: sec.offsetTop + Math.max(0, 0.15 * (sec.offsetHeight - window.innerHeight)), behavior: "instant" });
    };
    // press & hold (anywhere in the arrival, not on a control) breaks the order
    const onDown = (e: PointerEvent) => {
      onMove(e);
      const tgt = e.target as HTMLElement;
      if (tgt.closest("a, button, input")) return;
      if (currentActive === 0) holding = true;
    };
    const onUp = (e: PointerEvent) => {
      holding = false;
      if (e.pointerType !== "mouse") engine.pointer.on = false;
    };

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(build, 180);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("focusin", onFocusIn);

    // fonts first (the title is sampled from Outfit), but never wait long
    const failsafe = window.setTimeout(start, 1200);
    document.fonts.ready.then(() => {
      window.clearTimeout(failsafe);
      start();
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("focusin", onFocusIn);
      engine.dispose();
    };
  }, []);

  /* forces: cycle on their own until the visitor picks one */
  useEffect(() => {
    if (active !== 4 || userPicked.current) return;
    const t = window.setTimeout(() => setK((x) => (x === null ? 0 : (x + 1) % 3)), k === null ? 900 : 2600);
    return () => window.clearTimeout(t);
  }, [active, k]);

  /* magnetic controls */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".mag"));
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const move = (e: PointerEvent) => {
      if (!fine.matches) return;
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = (e: PointerEvent) => ((e.currentTarget as HTMLElement).style.transform = "");
    els.forEach((el) => {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
    });
    return () =>
      els.forEach((el) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
  }, []);

  const pick = (i: number) => {
    userPicked.current = true;
    setK(i);
  };
  const on = (i: number) => (active === i ? " is-on" : "");
  const f = k === null ? null : forces[k];

  return (
    <>
      <canvas className="order-canvas" ref={canvas} aria-hidden="true" />

      <div className="pre" aria-hidden="true">
        <span className="pre__n" />
        <span className="pre__l">Putting things in order</span>
      </div>

      <header className="hdr">
        <ViaMagusLogo href={officialLinks.viamagus} />
        <nav className="hdr__nav" aria-label="Site">
          <FilmButton className="hdr__link mag">
            <span className="play" aria-hidden="true" /> Film
          </FilmButton>
          <a className="hdr__cta mag" href={cta} target={ctaExternal ? "_blank" : undefined} rel="noopener noreferrer">
            Request an invitation
          </a>
        </nav>
      </header>

      <main className="order">
        {/* 01 — arrival */}
        <section id="arrive" className={`ch ch--arrive${on(0)}`} aria-labelledby="arrive-h">
          <div className="stage">
            <h1 id="arrive-h" className="sr-only">
              The Next Order — an invitation from ViaMagus for GCC leaders. {theme}.
            </h1>
            <p className="corner corner--tl">An invitation from ViaMagus</p>
            <p className="corner corner--tr">For GCC leaders · {line ?? "Date to be announced"}</p>
            <div className="arrive__base">
              <K className="arrive__theme" text={`${theme}.`} />
              <div className="arrive__cta">
                <Cta />
                <FilmButton className="btn btn--ghost mag">
                  <span className="btn__play" aria-hidden="true">
                    <span className="play" />
                  </span>
                  Watch the film <span className="btn__dim">30s</span>
                </FilmButton>
              </div>
            </div>
            <p className="hint" aria-hidden="true">
              <span className="hint__dot" /> Press &amp; hold to break the order
            </p>
          </div>
        </section>

        {/* 02 — the old order */}
        <section id="old" className={`ch ch--old${on(1)}`} aria-labelledby="old-h">
          <div className="stage">
            <p className="era">01 — The old order</p>
            <div className="old__copy">
              <K as="h2" className="big" text="Efficiency used to mean more people." />
              <p className="fact fade">
                <b>{oldOrder.evidence.figure}</b> GCCs in India, over 1.9 million people.{" "}
                <a href={oldOrder.evidence.url} target="_blank" rel="noopener noreferrer">
                  nasscom &amp; Zinnov, FY2024
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 03 — the break */}
        <section id="break" className={`ch ch--break${on(2)}`} aria-labelledby="break-h">
          <div className="stage stage--center">
            <p className="era">02 — The inflection point</p>
            <K as="h2" className="huge" text={inflection.headline} />
            <p className="sub fade">{inflection.body.replace(" The signals:", "")}</p>
          </div>
        </section>

        {/* 04 — the stake */}
        <section id="stake" className={`ch ch--stake${on(3)}`} aria-labelledby="stake-h">
          <div className="stage">
            <h2 id="stake-h" className="sr-only">
              Only 8% of GCCs lead.
            </h2>
            <div className="stake__copy">
              <K className="stake__line" text="of GCCs lead." />
              <p className="src fade">
                <a href={stake.url} target="_blank" rel="noopener noreferrer">
                  {stake.source}, {stake.date}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                · {stake.population}
              </p>
              <p className="src fade">
                Meanwhile, 58% of India-based GCCs already invest in agentic AI.{" "}
                <a href={invest.url} target="_blank" rel="noopener noreferrer">
                  EY, {invest.date}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              <div className="fade stake__cta">
                <Cta>Be in the room</Cta>
              </div>
            </div>
          </div>
        </section>

        {/* 05 — three forces: interactive */}
        <section id="forces" className={`ch ch--forces${on(4)}`} aria-labelledby="forces-h">
          <div className="stage">
            <p className="era">03 — The next order</p>
            <K as="h2" className="forces__h" text={nextOrder.headline} />
            <div className="hot" role="group" aria-label="Three forces — choose one">
              {forces.map((x, i) => (
                <button
                  key={x.key}
                  type="button"
                  className={`hot__b hot__b--${x.key}`}
                  aria-pressed={k === i}
                  style={geo ? ({ "--x": `${geo[i].x}px`, "--y": `${geo[i].y}px` } as CSSProperties) : undefined}
                  onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                >
                  <span className="hot__l">{x.verb}.</span>
                </button>
              ))}
            </div>
            <div className="panel" aria-live="polite">
              {f ? (
                <div key={f.key} className={`panel__in panel__in--${f.key}`}>
                  <p className="panel__who">
                    {f.role} · <b>{f.name}</b>
                  </p>
                  <ProofLine k={k!} />
                  <p className="panel__claim">{f.claim}</p>
                  <a className="panel__link" href={f.href} target="_blank" rel="noopener noreferrer">
                    {f.source} ↗<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              ) : (
                <p className="panel__hint">Tap or hover a force to open it</p>
              )}
            </div>
          </div>
        </section>

        {/* 06 — the mark */}
        <section id="mark" className={`ch ch--mark${on(5)}`} aria-labelledby="mark-h">
          <div className="stage">
            <div className="mark__copy">
              <K as="h2" className="mark__line" text={nextOrder.closing} />
              <p className="fade mark__by">Velocity AI · Synthia AI · ViaMagus Select — by ViaMagus</p>
            </div>
          </div>
        </section>

        {/* 07 — your move */}
        <section id="move" className={`ch ch--move${on(6)}`} aria-labelledby="move-h">
          <div className="stage">
            <K as="h2" className="move__h" text="Your next move." />
            <div className="seats fade" role="radiogroup" aria-label="Which seat are you in?">
              <span className="seats__q">Which seat are you in?</span>
              {questions.map((q, i) => (
                <button key={q.seat} type="button" role="radio" aria-checked={seat === i} className="seat" onClick={() => setSeat(i)}>
                  {q.seat.replace("For the ", "").replace(/^\w/, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
            <p key={seat} className="move__q" aria-live="polite">
              {questions[seat].q}
            </p>
            <div className="move__cta">
              <Cta />
            </div>
            <p className="move__meta fade">
              {line ?? "Date & venue to be announced"} · Hosted by ViaMagus
            </p>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee__t">
              {Array.from({ length: 2 }, (_, j) => (
                <span key={j}>
                  THE NEXT ORDER <i /> THE FUTURE OF GCC EFFICIENCY <i /> AN INVITATION FROM VIAMAGUS <i /> THE NEXT ORDER <i /> THE FUTURE
                  OF GCC EFFICIENCY <i /> AN INVITATION FROM VIAMAGUS <i />
                </span>
              ))}
            </div>
          </div>
          <footer className="foot">
            <ul>
              {forces.map((x) => (
                <li key={x.key}>
                  <a href={x.href} target="_blank" rel="noopener noreferrer">
                    {x.name}
                  </a>
                </li>
              ))}
            </ul>
            <p>© {new Date().getFullYear()} ViaMagus Technologies Pvt. Ltd.</p>
          </footer>
        </section>
      </main>

      {/* the floating CTA: thumb zone, mid-story only */}
      <div className={`pill${[1, 2, 4, 5].includes(active) ? " is-on" : ""}`}>
        <Cta />
      </div>
    </>
  );
}

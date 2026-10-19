"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { SelectWordmark, SynthiaLogo, VelocityWordmark } from "@/components/Brand";
import { FilmDial } from "@/components/clock/Clock";
import { ShiftRing } from "@/components/clock/ShiftRing";
import { YearCycle } from "@/components/clock/YearCycle";
import { FILM_DURATION, filmScenes, sceneAtTime, type FilmSceneId } from "@/content/film";
import { convergence, cta, shift } from "@/content/story";
import { Score } from "./score";

const LABEL: Record<FilmSceneId, string> = {
  title: "The NEXT Order",
  old: "The old order",
  inflection: "The inflection point",
  build: "Velocity AI · Build",
  operate: "Synthia AI · Operate",
  scale: "ViaMagus Select · Scale",
  converge: "Three hands, one clock",
  close: "The invitation",
};

function readStart() {
  const q = new URLSearchParams(window.location.search);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = Number(q.get("t"));
  if (q.has("t") && Number.isFinite(t)) return { t: Math.min(FILM_DURATION - 0.01, Math.max(0, t)), paused: true };
  // reduced motion: open paused on the closing line
  return { t: reduce ? 27 : 0, paused: reduce };
}

const rad = (a: number) => (a * Math.PI) / 180;
const tickLines = (n: number, r: number, major: number, minor: number) =>
  Array.from({ length: n }, (_, i) => {
    const big = i % 5 === 0;
    const a = (i * 360) / n;
    const x0 = Math.sin(rad(a)) * r;
    const y0 = -Math.cos(rad(a)) * r;
    const x1 = Math.sin(rad(a)) * (r - (big ? major : minor));
    const y1 = -Math.cos(rad(a)) * (r - (big ? major : minor));
    return <line key={i} x1={x0.toFixed(1)} y1={y0.toFixed(1)} x2={x1.toFixed(1)} y2={y1.toFixed(1)} className={big ? "mt mt--h" : "mt"} />;
  });

/**
 * The film — 30 s, 16:9, silent-first, loops. Directed for a room:
 * one idea per beat, never more than a few words on screen, every product as
 * one big legible transformation, and a payoff — three hands locking at twelve.
 * The clock decides which scene is on; each scene's motion is CSS that starts
 * when the scene does (--into lets the clock join a scene part-way).
 */
export function FilmPlayer({ mode = "page", onClose }: { mode?: "page" | "overlay"; onClose?: () => void }) {
  const root = useRef<HTMLDivElement | null>(null);
  const clock = useRef({ t: 0 });
  const score = useRef<Score | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [scene, setScene] = useState<FilmSceneId | "">("");
  const [idle, setIdle] = useState(false);
  const [host, setHost] = useState("");
  const [hudT, setHudT] = useState(0);
  const playingRef = useRef(false);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // stage scale
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--k", String(Math.min(window.innerWidth / 1920, window.innerHeight / 1080)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // the clock
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setHost(window.location.host);
    const s = readStart();
    clock.current.t = s.t;
    let cur = "";
    const enter = (id: FilmSceneId, into: number) => {
      el.querySelectorAll<HTMLElement>(".fs").forEach((sc) => {
        const on = sc.dataset.id === id;
        sc.classList.toggle("is-on", on);
        if (on) sc.style.setProperty("--into", `${into.toFixed(3)}s`);
      });
      setScene(id);
    };
    let raf = 0;
    let hudLast = -1;
    let last = performance.now();
    const tick = (nowMs: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (nowMs - last) / 1000);
      last = nowMs;
      const c = clock.current;
      if (playingRef.current) {
        c.t += dt;
        if (c.t >= FILM_DURATION) {
          c.t -= FILM_DURATION;
          cur = "";
          score.current?.scheduleLoop(score.current.ctx.currentTime - c.t, 0);
        }
      }
      if (Math.floor(c.t * 10) !== hudLast) {
        hudLast = Math.floor(c.t * 10);
        setHudT(c.t);
      }
      const sc = sceneAtTime(c.t);
      if (sc.id !== cur) {
        cur = sc.id;
        enter(sc.id, c.t - sc.start);
      }
    };
    setPlaying(!s.paused);
    raf = requestAnimationFrame(tick);
    const onRestart = () => {
      cur = "";
    };
    el.addEventListener("fp-restart", onRestart);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("fp-restart", onRestart);
      score.current?.close();
      score.current = null;
    };
  }, []);

  useEffect(() => {
    if (!score.current) return;
    if (playing) void score.current.ctx.resume();
    else void score.current.ctx.suspend();
  }, [playing]);

  const toggleSound = useCallback(() => {
    if (score.current) {
      score.current.close();
      score.current = null;
      setSound(false);
      return;
    }
    const sc = new Score();
    score.current = sc;
    const t = clock.current.t;
    sc.scheduleLoop(sc.ctx.currentTime - t, t);
    if (!playingRef.current) void sc.ctx.suspend();
    setSound(true);
  }, []);

  const restart = useCallback(() => {
    clock.current.t = 0;
    root.current?.dispatchEvent(new Event("fp-restart"));
    if (score.current) {
      score.current.stopAll();
      score.current.scheduleLoop(score.current.ctx.currentTime, 0);
    }
    setPlaying(true);
  }, []);

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), 2200);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), 2200);
    };
    const onKey = (e: KeyboardEvent) => {
      wake();
      if (e.code === "Space" && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLAnchorElement)) {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "m" || e.key === "M") toggleSound();
      else if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", onKey);
    };
  }, [toggleSound, onClose]);

  // the ring of years on the film clock: the marker runs 2019 → 2030 during 06–09.4, crossing both boundaries
  const inflP = useCallback(() => {
    const t = clock.current.t;
    return t < 6 ? 0.2 : Math.min(1, 0.2 + ((t - 6) / 3.4) * 0.8);
  }, []);

  const d = (s: number): CSSProperties => ({ ["--d" as string]: `${s}s` });

  return (
    <div ref={root} className={`fp fp--${mode}${idle ? " is-idle" : ""}${playing ? "" : " is-paused"}`} data-scene={scene}>
      <div className="fp__stage" aria-hidden="true">
        {/* 00–03 · HOOK: a giant dial sweeps; the title lands on the third second */}
        <section className="fs fs--title" data-id="title">
          <div className="fs__shiftring">
            <ShiftRing still />
          </div>
          <p className="fs__mono fs__tl k-in" style={d(0.3)}>
            An invitation from ViaMagus
          </p>
          <div className="fs__title">
            <div className="ft ft--below">
              <span>THE NEXT</span>
              <span>ORDER.</span>
            </div>
            <div className="ft ft--above">
              <span>THE NEXT</span>
              <span>ORDER.</span>
            </div>
            <span className="ft__cut" />
          </div>
          <p className="fs__mono fs__bl k-in" style={d(2.2)}>
            For India’s GCC leaders
          </p>
        </section>

        {/* 03–06 · THE OLD ORDER: identical units, in lockstep */}
        <section className="fs fs--old" data-id="old">
          <div className="march">
            {[0, 1, 2].map((r) => (
              <div key={r} className="march__row" style={{ ["--r" as string]: r } as CSSProperties}>
                {Array.from({ length: 40 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
            ))}
          </div>
          <p className="fs__yrs" />
          <div className="fs__copy">
            <p className="fs__mono fs__era k-in" style={d(0)}>
              {shift[0].years} · {shift[0].era}
            </p>
            <p className="fs__h k-up" style={d(0.15)}>
              {shift[0].headline}
            </p>
            <p className="fs__stat k-up" style={d(1.2)}>
              <b>{shift[0].evidence!.figure}</b> {shift[0].evidence!.finding} · {shift[0].evidence!.source}, {shift[0].evidence!.date}
            </p>
          </div>
        </section>

        {/* 06–10 · THE INFLECTION POINT: the dial cracks, then the number */}
        <section className="fs fs--inflection" data-id="inflection">
          <div className="fs__dial">
            <YearCycle getProgress={inflP} label="" />
          </div>
          <div className="fs__copy">
            <p className="fs__mono fs__era k-in" style={d(0)}>
              {shift[1].years} · {shift[1].era}
            </p>
            <div className="swap">
              <p className="fs__h swap__a">{shift[1].headline}</p>
              <div className="swap__b">
                <p className="fs__big">{shift[1].evidence!.figure}</p>
                <p className="fs__under">
                  {shift[1].evidence!.finding}.
                  <span>
                    {shift[1].evidence!.source}, {shift[1].evidence!.date}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 10–14 · BUILD: three months becomes three-to-four weeks */}
        <section className="fs fs--build fs--p" data-id="build">
          <svg className="fs__ring" viewBox="-500 -500 1000 1000">
            {tickLines(60, 480, 40, 18)}
            <g className="ring__hand ring__hand--fast">
              <rect x="-3" y="-470" width="6" height="520" />
            </g>
          </svg>
          <p className="fs__mono fs__era k-in" style={d(0)}>
            The second hand
          </p>
          <p className="fs__verb k-up" style={d(0.1)}>
            Build.
          </p>
          <div className="xform">
            <p className="xform__from">3 months</p>
            <p className="xform__to">3–4 weeks</p>
          </div>
          <div className="fs__sign k-up" style={d(2.5)}>
            <VelocityWordmark />
            <span>A shippable submodule, every Friday.</span>
          </div>
        </section>

        {/* 14–18 · OPERATE: the draft gets signed */}
        <section className="fs fs--operate fs--p" data-id="operate">
          <svg className="fs__ring" viewBox="-500 -500 1000 1000">
            {tickLines(60, 480, 40, 18)}
            <g className="ring__hand ring__hand--mid">
              <rect x="-7" y="-420" width="14" height="470" />
            </g>
          </svg>
          <p className="fs__mono fs__era k-in" style={d(0)}>
            The minute hand
          </p>
          <p className="fs__verb k-up" style={d(0.1)}>
            Operate.
          </p>
          <div className="doc">
            <p className="doc__k">AI output</p>
            <span className="doc__line" />
            <span className="doc__line doc__line--s" />
            <span className="doc__line" />
            <p className="doc__draft">Draft</p>
            <p className="doc__stamp">
              Signed ✓<small>Named officer</small>
            </p>
          </div>
          <div className="fs__sign k-up" style={d(2.5)}>
            <SynthiaLogo height={46} />
            <span>Every AI output is a draft until a named officer signs it.</span>
          </div>
        </section>

        {/* 18–22 · SCALE: fifty CVs become three verdicts */}
        <section className="fs fs--scale fs--p" data-id="scale">
          <svg className="fs__ring" viewBox="-500 -500 1000 1000">
            {tickLines(60, 480, 40, 18)}
            <g className="ring__hand ring__hand--slow">
              <rect x="-12" y="-300" width="24" height="350" />
            </g>
          </svg>
          <p className="fs__mono fs__era k-in" style={d(0)}>
            The hour hand
          </p>
          <p className="fs__verb k-up" style={d(0.1)}>
            Scale.
          </p>
          <div className="count">
            <p className="count__n" />
            <p className="count__l">
              <span className="count__a">CVs a search sends</span>
              <span className="count__b">pass — each with a written verdict</span>
            </p>
          </div>
          <div className="fs__sign k-up" style={d(2.5)}>
            <SelectWordmark />
            <span>The mandate is yours. So is the team.</span>
          </div>
        </section>

        {/* 22–26 · PAYOFF: three hands lock at twelve */}
        <section className="fs fs--converge" data-id="converge">
          <svg className="lock" viewBox="-500 -500 1000 1000">
            <circle r="497" className="lock__face" />
            {tickLines(60, 480, 46, 20)}
            <circle r="497" className="lock__pulse" />
            <g className="lock__h lock__h--select">
              <rect x="-16" y="-260" width="32" height="300" rx="2" />
            </g>
            <g className="lock__h lock__h--synthia">
              <rect x="-8" y="-400" width="16" height="440" rx="2" />
            </g>
            <g className="lock__h lock__h--velocity">
              <rect x="-3" y="-462" width="6" height="540" />
              <circle cy="-462" r="12" />
            </g>
            <circle r="78" className="lock__pin" />
            <g transform="translate(-50 -20) scale(3.3)" className="lock__mark">
              <path d="M0,0l6.7765,11.8958l6.7764,-11.8958z" />
              <path d="M23.7177,0l-3.3881,5.9479l-3.3882,-5.9479l-6.7764,11.8955h20.3291z" />
            </g>
          </svg>
          <p className="fs__trio k-up" style={d(2.75)}>
            Three hands. One clock.
          </p>
          <p className="fs__mono fs__begins k-in" style={d(2.6)}>
            2025 onward · The next order
          </p>
          <p className="fs__mono fs__names k-in" style={d(3.05)}>
            <span className="k-v">Velocity AI</span> · <span className="k-s">Synthia AI</span> · <span className="k-x">ViaMagus Select</span>
          </p>
        </section>

        {/* 26–30 · the line, then the invitation; a hard cut back to the hook */}
        <section className="fs fs--close" data-id="close">
          <p className="fs__close">{convergence}</p>
          <div className="fs__end">
            <p className="fs__mono fs__endk">An invitation from ViaMagus</p>
            <p className="fs__endt">
              <span>The NEXT</span> Order.
            </p>
            <p className="fs__endu">
              <span>{cta.primary}</span>
              <span className="fs__endurl">{host ? `${host}/register` : ""}</span>
            </p>
          </div>
        </section>
      </div>

      <div className="fp__hud" aria-hidden="true">
        <FilmDial scenes={filmScenes} t={hudT} duration={FILM_DURATION} />
        <p className="fp__tc">
          <b>00:{String(Math.floor(hudT)).padStart(2, "0")}</b> / 00:30
          <span>{LABEL[sceneAtTime(hudT).id]}</span>
        </p>
      </div>

      <div className="fp__controls">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={toggleSound} aria-pressed={sound}>
          {sound ? "Sound on" : "Sound off"}
        </button>
        <button type="button" onClick={restart}>
          Replay
        </button>
        {mode === "overlay" ? (
          <button type="button" onClick={onClose} className="fp__close" autoFocus>
            Close <span aria-hidden="true">✕</span>
          </button>
        ) : (
          <Link href="/">Back to the site</Link>
        )}
      </div>
      <p className="sr-only">
        A 30-second film. A ring of identical segments is cut by a magenta line and its upper half twists out of
        alignment: The NEXT Order, for India’s GCC leaders. The old order, 2016 to 2019: the years count up over rows of
        identical units in lockstep — built to execute; 1,700+ GCCs in India today (nasscom and Zinnov, FY2024). The
        inflection point: on a ring of years the marker crosses 2020 and 2025, the years crack and then fuse — then the
        mandate grew; 92% of India-based GCCs now aim beyond cost arbitrage (EY GCC Pulse Survey 2025). Build: Velocity AI — three months becomes three to four weeks, a shippable
        submodule every Friday. Operate: Synthia AI — a draft is stamped signed by a named officer. Scale: ViaMagus Select
        — fifty CVs count down to three verdicts; the mandate is yours, so is the team. Three hands — cyan, violet and
        amber — spin and lock together at twelve on the ViaMagus mark: three hands, one clock. Everything an enterprise
        needs to become AI-native. The NEXT Order: request your place.
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ViaMagusMark, SelectWordmark, SynthiaLogo, VelocityWordmark } from "@/components/Brand";
import { SelectMech, SynthiaMech, VelocityMech } from "@/components/shift/Mechanisms";
import { Plan } from "@/components/shift/Plan";
import { FILM_DURATION, sceneAtTime, type FilmSceneId } from "@/content/film";
import { convergence, next, now, then } from "@/content/story";
import { Score } from "./score";

function readStart() {
  const q = new URLSearchParams(window.location.search);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = Number(q.get("t"));
  if (q.has("t") && Number.isFinite(t)) return { t: Math.min(FILM_DURATION - 0.01, Math.max(0, t)), paused: true };
  // reduced motion: open paused on the closing line
  return { t: reduce ? 27 : 0, paused: reduce };
}

/**
 * The film: the site's drawings on a 30-second clock, on a 1920×1080 stage
 * scaled to any screen. Full-page at /film (event screens) or as an overlay.
 * The clock decides which scene is on; each scene's motion is CSS that starts
 * when the scene does (its drawings reuse the site's own reveal states).
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
        sc.querySelectorAll("[data-reveal]").forEach((r) => r.classList.toggle("is-in", on));
      });
      setScene(id);
    };
    let raf = 0;
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

  const d = (s: number): CSSProperties => ({ ["--d" as string]: `${s}s` });

  return (
    <div ref={root} className={`fp fp--${mode}${idle ? " is-idle" : ""}${playing ? "" : " is-paused"}`} data-scene={scene}>
      <div className="fp__stage" aria-hidden="true">
        {/* 00–03 · The NEXT Order */}
        <section className="fs fs--title" data-id="title">
          <p className="fs__mono fs__tl">An invitation from ViaMagus</p>
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
          <p className="fs__mono fs__bl">For India’s GCC leaders</p>
        </section>

        {/* 03–06 · The Old Order */}
        <section className="fs fs--old" data-id="old">
          <div className="fs__copy">
            <p className="fs__mono fs__era">Then · The old order</p>
            <p className="fs__h a-up" style={d(0.2)}>
              {then.headline}
            </p>
          </div>
          <div className="fs__plan">
            <Plan stage="then" bays={then.bays} label="" />
          </div>
        </section>

        {/* 06–10 · The Inflection Point */}
        <section className="fs fs--inflection" data-id="inflection">
          <div className="fs__copy">
            <p className="fs__mono fs__era">Now · The inflection point</p>
            <p className="fs__h a-up" style={d(0.2)}>
              {now.headline}
            </p>
            <p className="fs__fig a-up" style={d(1.6)}>
              <b>{now.evidence[0].figure}</b> of India-based GCCs {now.evidence[0].finding}
            </p>
            <p className="fs__src a-up" style={d(1.9)}>
              EY GCC Pulse Survey 2025
            </p>
          </div>
          <div className="fs__plan">
            <Plan stage="now" label="" />
          </div>
        </section>

        {/* 10–14 · BUILD */}
        <section className="fs fs--build fs--practice" data-id="build">
          <div className="fs__copy">
            <p className="fs__mono fs__era">Velocity AI</p>
            <p className="fs__verb a-up" style={d(0.1)}>
              Build.
            </p>
            <div className="fs__mark a-up" style={d(0.5)}>
              <VelocityWordmark />
            </div>
            <p className="fs__line a-up" style={d(0.8)}>
              Three-month timelines become three-to-four weeks.
            </p>
          </div>
          <div className="fs__mech">
            <VelocityMech />
          </div>
        </section>

        {/* 14–18 · OPERATE */}
        <section className="fs fs--operate fs--practice" data-id="operate">
          <div className="fs__copy">
            <p className="fs__mono fs__era">Synthia AI</p>
            <p className="fs__verb a-up" style={d(0.1)}>
              Operate.
            </p>
            <div className="fs__mark a-up" style={d(0.5)}>
              <SynthiaLogo height={44} />
            </div>
            <p className="fs__line a-up" style={d(0.8)}>
              Every AI output is a draft until a named officer signs it.
            </p>
          </div>
          <div className="fs__mech">
            <SynthiaMech />
          </div>
        </section>

        {/* 18–22 · SCALE */}
        <section className="fs fs--scale fs--practice" data-id="scale">
          <div className="fs__copy">
            <p className="fs__mono fs__era">ViaMagus Select</p>
            <p className="fs__verb a-up" style={d(0.1)}>
              Scale.
            </p>
            <div className="fs__mark a-up" style={d(0.5)}>
              <SelectWordmark />
            </div>
            <p className="fs__line a-up" style={d(0.8)}>
              The mandate is yours. So is the team.
            </p>
          </div>
          <div className="fs__mech">
            <SelectMech />
          </div>
        </section>

        {/* 22–26 · convergence */}
        <section className="fs fs--converge" data-id="converge">
          <svg viewBox="0 0 1920 1080" className="fs__lines">
            <path className="cl cl--v" d="M260 -10 C 260 520, 960 420, 960 640" pathLength={1} />
            <path className="cl cl--s" d="M960 -10 V 640" pathLength={1} />
            <path className="cl cl--x" d="M1660 -10 C 1660 520, 960 420, 960 640" pathLength={1} />
          </svg>
          <ViaMagusMark className="fs__vm" />
          <p className="fs__trio a-up" style={d(1.6)}>
            Build. Operate. Scale.
          </p>
          <p className="fs__mono fs__names a-up" style={d(2)}>
            Velocity AI · Synthia AI · ViaMagus Select
          </p>
        </section>

        {/* 26–30 · close, wiping back to paper for the loop */}
        <section className="fs fs--close" data-id="close">
          <p className="fs__close a-up" style={d(0.2)}>
            {convergence.line}
          </p>
          <p className="fs__mono fs__cta a-up" style={d(1.2)}>
            The NEXT Order · {next.question.replace("your GCC", "your centre")}
          </p>
          {host ? (
            <p className="fs__mono fs__url a-up" style={d(1.6)}>
              Register · {host}/register
            </p>
          ) : null}
          <span className="fs__wipe" />
        </section>
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
        A 30-second film. The NEXT Order. The old order: a small room inside a global enterprise, laid out as briefed — the
        room you were given. The inflection point: its walls move outward; 92% of India-based GCCs aim to deliver value
        beyond cost arbitrage (EY GCC Pulse Survey 2025). Build: Velocity AI — three-month timelines become three-to-four
        weeks. Operate: Synthia AI — every AI output is a draft until a named officer signs it. Scale: ViaMagus Select — the
        mandate is yours, so is the team. Three lines converge into the ViaMagus mark: build, operate, scale. Everything an
        enterprise needs to become AI-native.
      </p>
    </div>
  );
}

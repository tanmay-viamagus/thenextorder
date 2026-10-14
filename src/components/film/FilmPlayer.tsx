"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { whenWhere as eventLine } from "@/content/event";
import { FILM_DURATION, RUSH_STEP, rushWords, sceneAt, scenes, type SceneId } from "@/content/film";
import { invite, title } from "@/content/story";
import { SelectWordmark, SynthiaLogo, VelocityWordmark } from "../Brand";
import { TitleSort } from "../TitleSort";
import { Score } from "./score";
import { createLightField } from "./shader";

const v = (o: Record<string, string | number>) => o as CSSProperties;
const RUSH_START = scenes.find((s) => s.id === "rush")!.start;

function readStart() {
  const q = new URLSearchParams(window.location.search);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = Number(q.get("t"));
  if (q.has("t") && Number.isFinite(t)) return { t: Math.min(FILM_DURATION - 0.01, Math.max(0, t)), paused: true };
  return { t: reduce ? 23.6 : 0, paused: reduce };
}

/**
 * The film: a 30-second crescendo on a fixed 1920×1080 stage, scaled to any
 * screen, over a live WebGL light field. Used full-page at /film (event
 * screens) and as an overlay on the site.
 */
export function FilmPlayer({ mode = "page", onClose }: { mode?: "page" | "overlay"; onClose?: () => void }) {
  const root = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const sceneEls = useRef(new Map<SceneId, HTMLDivElement>());
  const clock = useRef({ t: 0, last: 0, scene: "" as SceneId | "", word: -1, energy: 0, mono: 0, flash: 0 });
  const field = useRef<ReturnType<typeof createLightField>>(null);
  const score = useRef<Score | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [loop, setLoop] = useState(0);
  const [titleKey, setTitleKey] = useState(0);
  const [scale, setScale] = useState(0);
  const [idle, setIdle] = useState(false);
  const line = eventLine();

  /* -- one frame of the film at time t -- */
  const frame = useCallback((t: number, dt: number) => {
    const c = clock.current;
    const s = sceneAt(t);
    if (s.id !== c.scene) {
      const prev = c.scene ? sceneEls.current.get(c.scene) : null;
      prev?.classList.remove("is-on");
      const el = sceneEls.current.get(s.id);
      if (el) {
        el.classList.remove("is-on");
        void el.offsetWidth; // restart this scene's CSS animations
        el.classList.add("is-on");
      }
      if (s.flash) c.flash = Math.max(c.flash, s.flash);
      if (s.id === "title") setTitleKey((k) => k + 1);
      c.scene = s.id;
      c.word = -1;
    }
    if (s.id === "rush") {
      const w = Math.floor((t - RUSH_START) / RUSH_STEP);
      if (w !== c.word && w < rushWords.length) {
        c.word = w;
        c.flash = Math.max(c.flash, 0.55 + (w / rushWords.length) * 0.45);
      }
    }
    c.energy += (s.energy - c.energy) * Math.min(1, dt * (s.id === "silence" ? 30 : 5));
    c.mono += ((s.mono ?? 0) - c.mono) * Math.min(1, dt * 4);
    c.flash *= Math.exp(-dt * 6.5);
    field.current?.render({ time: t + loop * FILM_DURATION, energy: c.energy, flash: c.flash, mono: c.mono });
    const r = root.current;
    if (r) {
      const k = c.flash * c.flash;
      r.style.setProperty("--flash", k.toFixed(3));
      r.style.setProperty("--sx", ((Math.random() - 0.5) * 18 * k).toFixed(2));
      r.style.setProperty("--sy", ((Math.random() - 0.5) * 12 * k).toFixed(2));
    }
  }, [loop]);

  /* -- setup: stage scale, light field, start time -- */
  useEffect(() => {
    const fit = () => {
      const r = root.current?.getBoundingClientRect();
      if (r) setScale(Math.min(r.width / 1920, r.height / 1080));
    };
    window.addEventListener("resize", fit);
    if (canvas.current) field.current = createLightField(canvas.current);
    const s = readStart();
    clock.current.t = s.t;
    // first frame on the next paint: sizes the stage, lights the first scene, then starts the clock
    const first = requestAnimationFrame(() => {
      fit();
      frame(s.t, 1);
      setPlaying(!s.paused);
    });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("resize", fit);
      field.current?.dispose();
      score.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -- the clock -- */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const c = clock.current;
    c.last = performance.now();
    void score.current?.ctx.resume();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - c.last) / 1000);
      c.last = now;
      let t = c.t + dt;
      if (t >= FILM_DURATION) {
        t -= FILM_DURATION;
        setLoop((l) => l + 1);
        if (score.current) score.current.scheduleLoop(score.current.ctx.currentTime - t, 0);
      }
      c.t = t;
      frame(t, dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      void score.current?.ctx.suspend();
    };
  }, [playing, frame]);

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
    if (!playing) void sc.ctx.suspend();
    setSound(true);
  }, [playing]);

  const restart = useCallback(() => {
    clock.current.t = 0;
    clock.current.scene = "";
    if (score.current) {
      score.current.stopAll();
      score.current.scheduleLoop(score.current.ctx.currentTime, 0);
    }
    frame(0, 1);
    setPlaying(true);
  }, [frame]);

  /* -- keys + idle cursor -- */
  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), 2200);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), 2200);
    };
    const onKey = (e: KeyboardEvent) => {
      wake();
      if (e.code === "Space" && !(e.target instanceof HTMLButtonElement)) {
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

  const sc = (id: SceneId, children: ReactNode) => (
    <div
      className={`fx fx--${id}`}
      ref={(el) => {
        if (el) sceneEls.current.set(id, el);
      }}
    >
      {children}
    </div>
  );

  const weeks = Array.from({ length: 12 }, (_, i) => i);
  const tiles = Array.from({ length: 50 }, (_, i) => i);
  const picks = new Set([13, 26, 38]);

  return (
    <div className={`fp fp--${mode}${idle ? " is-idle" : ""}`} ref={root}>
      <canvas className="fp__bg" ref={canvas} aria-hidden="true" />
      <div className="fp__flash" aria-hidden="true" />
      <div
        className="fp__stage"
        aria-hidden="true"
        style={{ transform: `translate(-50%, -50%) scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        <div className="fp__cam">
          {sc(
            "cursor",
            <>
              <i className="fx-cell fx-cell--blink" />
              <p className="fx-typer">Every enterprise runs on an order.</p>
            </>,
          )}
          {sc(
            "grid",
            <>
              <div className="fx-grid">
                {Array.from({ length: 96 }, (_, i) => (
                  <i key={i} style={v({ "--i": i, "--r": (i * 37) % 96 })} />
                ))}
              </div>
              <p className="fx-outline">
                The old
                <br />
                order.
              </p>
            </>,
          )}
          {sc(
            "crack",
            <>
              <div className="fx-grid fx-grid--fall">
                {Array.from({ length: 96 }, (_, i) => (
                  <i
                    key={i}
                    style={v({
                      "--fx": (((i * 53) % 21) - 10) * 60,
                      "--fy": 400 + ((i * 29) % 13) * 70,
                      "--fr": (((i * 71) % 17) - 8) * 22,
                      "--r": (i * 37) % 96,
                    })}
                  />
                ))}
              </div>
              <p className="fx-big">
                Built to scale
                <br />
                people.
              </p>
            </>,
          )}
          {sc(
            "rules",
            <p className="fx-glitch">
              {["AI changed", "the rules."].map((l) => (
                <span key={l} data-t={l}>
                  {l}
                </span>
              ))}
            </p>,
          )}
          {sc(
            "eight",
            <>
              <p className="fx-eight">
                <b>8</b>%
              </p>
              <div className="fx-eight__copy">
                <p className="fx-eight__line">of GCCs are top performers.</p>
                <p className="fx-src">BCG · GCC Survey 2024, N = 150 · June 2025</p>
              </div>
            </>,
          )}
          {sc(
            "build",
            <>
              <span className="fx-ghost">Build</span>
              <div className="fx-force">
                <p className="fx-kicker">01 · Build</p>
                <div className="fx-mark">
                  <VelocityWordmark />
                </div>
                <p className="fx-claim">
                  A shippable release
                  <br />
                  every Friday.
                </p>
              </div>
              <div className="fx-weeks">
                {weeks.map((w) => (
                  <i key={w} style={v({ "--w": w })} />
                ))}
                <span>12 weeks · 12 releases</span>
              </div>
            </>,
          )}
          {sc(
            "operate",
            <>
              <span className="fx-ghost">Operate</span>
              <div className="fx-force">
                <p className="fx-kicker">02 · Operate</p>
                <div className="fx-mark">
                  <SynthiaLogo height={60} />
                </div>
                <p className="fx-claim">AI that follows your SOP — and stops for your sign-off.</p>
              </div>
              <div className="fx-flow">
                <span className="fx-flow__line" />
                <span className="fx-flow__dot" />
                <span className="fx-flow__gate">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8.5" r="3.6" />
                    <path d="M5.5 19.5c.8-3.6 3.4-5.3 6.5-5.3s5.7 1.7 6.5 5.3" />
                  </svg>
                </span>
                <span className="fx-stamp">Signed off ✓</span>
              </div>
            </>,
          )}
          {sc(
            "scale",
            <>
              <span className="fx-ghost">Scale</span>
              <div className="fx-force">
                <p className="fx-kicker">03 · Scale</p>
                <div className="fx-mark">
                  <SelectWordmark />
                </div>
                <p className="fx-claim">
                  Not 50 CVs.
                  <br />
                  3–5 people you can hire.
                </p>
              </div>
              <div className="fx-tiles">
                {tiles.map((i) => (
                  <i key={i} className={picks.has(i) ? "is-pick" : ""} style={v({ "--i": i, "--r": (i * 23) % 50 })} />
                ))}
                <span>Shortlisted in 48 hours</span>
              </div>
            </>,
          )}
          {sc(
            "rush",
            rushWords.map((w, i) => (
              <p key={w} className={`fx-rush${i === rushWords.length - 1 ? " fx-rush--last" : ""}`} style={v({ "--i": i })}>
                {w}
              </p>
            )),
          )}
          {sc("silence", <i className="fx-cell fx-cell--still" />)}
          {sc(
            "logo",
            <>
              <span className="fx-ring" />
              <span className="fx-ring fx-ring--2" />
              <svg className="fx-logo" viewBox="0 0 30.4941 11.8959">
                <path className="fx-logo__l" d="M0,0l6.7765,11.8958l6.7764,-11.8958z" />
                <path className="fx-logo__r" d="M23.7177,0l-3.3881,5.9479l-3.3882,-5.9479l-6.7764,11.8955h20.3291z" />
              </svg>
              <p className="fx-word">viamagus</p>
            </>,
          )}
          {sc(
            "title",
            <>
              <TitleSort key={titleKey} as="div" lines={title} speed="fast" className="fx-title" />
              <p className="fx-pos">{invite.positioning}</p>
            </>,
          )}
          {sc(
            "invite",
            <>
              <p className="fx-invite">{invite.from}</p>
              <p className="fx-for">For GCC leaders{line ? ` · ${line}` : ""}</p>
              <i className="fx-cell fx-cell--end" />
            </>,
          )}
        </div>
      </div>

      <p className="fp__rotate" aria-hidden="true">
        <span>⟳</span> Turn your phone for the full film
      </p>
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
        A 30-second film. A single cell on black; the old order — a rigid grid — falls apart; AI changed the rules;
        only 8% of GCCs are top performers; Velocity AI, a shippable release every Friday; Synthia AI, AI that stops
        for your sign-off; ViaMagus Select, 3–5 people you can hire; a rush of words — build, operate, scale, one
        order; silence; the ViaMagus logo; The Next Order — everything an enterprise needs to become AI-native.
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { beats, FILM_DURATION, SHIFT_AT, type BeatId } from "@/content/film";
import { forces, hook, invite, shift, signal, title } from "@/content/story";
import { SelectWordmark, SynthiaLogo, VelocityWordmark, ViaMagusLogo } from "./Brand";
import { SelectVisual, SynthiaVisual, VelocityVisual } from "./ForceVisuals";
import { ShiftGrid } from "./ShiftGrid";
import { TitleSort } from "./TitleSort";

const beatAt = (t: number) => beats.find((b) => t >= b.start && t < b.end) ?? beats[beats.length - 1];

const MARK = { velocity: <VelocityWordmark />, synthia: <SynthiaLogo height={64} />, select: <SelectWordmark /> };
const VISUAL = { velocity: <VelocityVisual />, synthia: <SynthiaVisual />, select: <SelectVisual /> };

function readStart() {
  const q = new URLSearchParams(window.location.search);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = Number(q.get("t"));
  return {
    t: q.has("t") && Number.isFinite(t) ? Math.min(FILM_DURATION - 0.01, Math.max(0, t)) : reduce ? 28 : 0,
    paused: q.has("t") || reduce,
    debug: q.has("debug"),
  };
}

/** Same frames as the site, played by a clock instead of a scroll — for the event screens. */
export function Film() {
  const clock = useRef({ t: 0, last: 0 });
  const [t, setT] = useState(0);
  const [loop, setLoop] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [debug, setDebug] = useState(false);
  const [idle, setIdle] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const s = readStart();
    clock.current.t = s.t;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after mount
    setT(s.t);
    setPlaying(!s.paused);
    setDebug(s.debug);
    const fit = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    clock.current.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - clock.current.last) / 1000);
      clock.current.last = now;
      let next = clock.current.t + dt;
      if (next >= FILM_DURATION) {
        next -= FILM_DURATION;
        setLoop((l) => l + 1);
      }
      clock.current.t = next;
      setT(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = useCallback(() => setPlaying((p) => !p), []);

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), 2500);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), 2500);
    };
    const onKey = (e: KeyboardEvent) => {
      wake();
      if (e.code === "Space" && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", onKey);
    };
  }, [toggle]);

  const active: BeatId = beatAt(t).id;
  const on = (id: BeatId) => `fb fb--${id}${active === id ? " is-on is-live" : ""}`;
  const shiftState = active === "shift" && t >= SHIFT_AT ? "next" : "last";

  return (
    <main className={`film${idle ? " is-idle" : ""}`}>
      <h1 className="sr-only">The NEXT Order — 30-second event film</h1>
      <div className="film__frame" aria-hidden="true" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <section className={on("hook")}>
          <TitleSort as="div" lines={title} className="fb-title" playKey={`${loop}-${active === "hook"}`} />
          <p className="fb-hookline">{hook}</p>
        </section>

        <section className={on("shift")}>
          <div className="fb-shift__copy">
            <p className="fb-label">{shift.label}</p>
            <p key={shiftState} className="fb-shift__h swap">
              {shift[shiftState].headline}
            </p>
          </div>
          <div className="fb-shift__grid">
            <ShiftGrid state={shiftState} autoplay={false} />
          </div>
        </section>

        {forces.map((f, i) => (
          <section key={f.key} className={on(f.key)}>
            <div className="fb-force__copy">
              <p className="fb-label">
                0{i + 1} · {f.verb}
              </p>
              <div className="fb-force__mark">{MARK[f.key]}</div>
              <p className="fb-force__claim">{f.claim}</p>
            </div>
            <div className="fb-force__visual">{VISUAL[f.key]}</div>
          </section>
        ))}

        <section className={on("signal")}>
          <p className="fb-signal__num">
            <span>{signal.figure}</span>%
          </p>
          <div className="fb-signal__copy">
            <p className="fb-signal__finding">of GCCs are top performers.</p>
            <p className="fb-signal__src">BCG · GCC Survey 2024 · June 2025</p>
          </div>
        </section>

        <section className={on("reveal")}>
          <div className="ts-wrap fb-title">
            <div className="ts is-ready is-sorted">
              <span className="ts-line">The Next</span>
              <span className="ts-line">Order</span>
            </div>
          </div>
          <p className="fb-hookline">{invite.positioning}</p>
          <div className="fb-sign">
            <ViaMagusLogo />
          </div>
        </section>
      </div>

      <div className="film__controls">
        <button type="button" onClick={toggle} aria-pressed={!playing}>
          {playing ? "Pause" : "Play"}
        </button>
        <Link href="/">Back to the site</Link>
        {debug ? <span className="film__tc">{`${t.toFixed(2)}s · ${beatAt(t).label}`}</span> : null}
      </div>
      <p className="sr-only">
        A silent 30-second loop: the title sorts itself into The Next Order; a pyramid of people re-orders into
        three forces; Velocity AI, Synthia AI and ViaMagus Select; only 8% of GCCs are top performers; The Next
        Order — everything an enterprise needs to become AI-native.
      </p>
    </main>
  );
}

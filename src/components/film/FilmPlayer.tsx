"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { whenWhere } from "@/content/event";
import { BLEND, CHAOS_FROM, CHAOS_UNTIL, FILM_DURATION, FORCE_BEATS, filmScenes, sceneAtTime } from "@/content/film";
import { forces, inflection, nextOrder } from "@/content/story";
import { Engine } from "../order/engine";
import { buildStory, F, highlighter } from "../order/story";
import { Score } from "./score";

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function readStart() {
  const q = new URLSearchParams(window.location.search);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = Number(q.get("t"));
  if (q.has("t") && Number.isFinite(t)) return { t: Math.min(FILM_DURATION - 0.01, Math.max(0, t)), paused: true };
  return { t: reduce ? 23 : 0, paused: reduce };
}

/** which formation the film shows at time t, and the blend from the previous one */
function blendAt(t: number) {
  if (t < CHAOS_UNTIL) return { a: F.chaos, b: F.chaos, t: 0 };
  if (t >= CHAOS_FROM) return { a: F.title, b: F.chaos, t: ease(Math.min(1, (t - CHAOS_FROM) / 0.9)) };
  const s = sceneAtTime(t);
  const i = filmScenes.indexOf(s);
  const prev = i === 0 ? F.chaos : filmScenes[i - 1].f;
  const from = i === 0 ? CHAOS_UNTIL : s.start;
  return { a: prev, b: s.f, t: ease(Math.min(1, (t - from) / BLEND)) };
}

function proofLine(k: number) {
  const p = forces[k].proof;
  if (p.kind === "swap") return `${p.from} → ${p.to}`;
  if (p.kind === "ledger") return `${p.rows[0][1]} → ${p.rows[1][1]}`;
  return p.value;
}

/**
 * The film: the site's living system of cells on a 30-second clock.
 * Full-page at /film (event screens) or as an overlay on the site.
 */
export function FilmPlayer({ mode = "page", onClose }: { mode?: "page" | "overlay"; onClose?: () => void }) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const clock = useRef({ t: 0 });
  const score = useRef<Score | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [scene, setScene] = useState<string>("");
  const [force, setForce] = useState<number | null>(null);
  const [idle, setIdle] = useState(false);
  const [noGl, setNoGl] = useState(false);
  const playingRef = useRef(false);
  const line = whenWhere();

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const s = readStart();
    clock.current.t = s.t;
    let engine: Engine | null = null;
    try {
      engine = new Engine(cv, window.innerWidth < 760 ? 2600 : 6000);
      engine.rigid = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      engine = null;
    }
    let hl: ReturnType<typeof highlighter> | null = null;
    let fk: number | null = null;
    let amount = 0;
    let dtNow = 0.016;
    let curScene = "";
    let curForce: number | null = -1;
    const family = getComputedStyle(document.body).fontFamily.split(",")[0].trim();
    const build = () => {
      if (!engine) return;
      engine.resize(window.innerWidth, window.innerHeight, Math.min(2, window.devicePixelRatio || 1));
      const story = buildStory(window.innerWidth, window.innerHeight, engine.n, family, true);
      engine.formations = story.formations;
      hl = highlighter(story);
    };
    if (engine) engine.shape = (tx, n) => hl?.(tx, n, fk, amount, dtNow);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      dtNow = dt;
      const c = clock.current;
      if (playingRef.current) {
        c.t += dt;
        if (c.t >= FILM_DURATION) {
          c.t -= FILM_DURATION;
          score.current?.scheduleLoop(score.current.ctx.currentTime - c.t, 0);
        }
      }
      const t = c.t;
      const sc = sceneAtTime(t);
      const k = sc.id === "forces" ? FORCE_BEATS.reduce<number | null>((acc, b, i) => (t >= b ? i : acc), null) : null;
      fk = k;
      amount = sc.id === "forces" ? Math.min(1, (t - sc.start) / BLEND) : 0;
      if (sc.id !== curScene) {
        curScene = sc.id;
        setScene(sc.id);
      }
      if (k !== curForce) {
        curForce = k;
        setForce(k);
      }
      if (!engine) return;
      const bl = blendAt(t);
      engine.a = bl.a;
      engine.b = bl.b;
      engine.t = bl.t;
      engine.step(dt, now / 1000);
      engine.render();
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      build();
      engine?.snap(F.chaos);
      setNoGl(!engine);
      setPlaying(!s.paused);
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const failsafe = window.setTimeout(start, 1000);
    void document.fonts.ready.then(start);

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(build, 180);
    };
    window.addEventListener("resize", onResize);
    return () => {
      started = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      engine?.dispose();
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

  const on = (id: string) => (scene === id ? " is-on" : "");

  return (
    <div className={`fp fp--${mode}${idle ? " is-idle" : ""}${noGl ? " no-gl" : ""}`} data-scene={scene}>
      <canvas className="fp__canvas" ref={canvas} aria-hidden="true" />
      <div className="fp__cap" aria-hidden="true">
        <p className={`cap cap--arrive${on("arrive")}`}>An invitation from ViaMagus</p>
        <p className={`cap cap--old${on("old")}`}>{"Efficiency used to mean more people."}</p>
        <p className={`cap cap--break${on("break")}`}>{inflection.headline}</p>
        <p className={`cap cap--stake${on("stake")}`}>of GCCs lead.</p>
        <div className={`cap cap--forces${on("forces")}`}>
          <p className="cap__h">Build. Operate. Scale.</p>
          {force !== null ? (
            <p key={forces[force].key} className={`cap__proof cap__proof--${forces[force].key}`}>
              <span>{forces[force].name}</span>
              {proofLine(force)}
            </p>
          ) : null}
        </div>
        <p className={`cap cap--mark${on("mark")}`}>{nextOrder.closing}</p>
        <div className={`cap cap--end${on("end")}`}>
          <p>For GCC leaders</p>
          <p className="cap__small">{line ?? "An invitation from ViaMagus"}</p>
        </div>
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
        A 30-second film. Thousands of cells assemble into The Next Order. They form a rigid pyramid: efficiency used to
        mean more people. They shatter: AI changed the rules. They form 8%: of GCCs lead. They become three turning
        forces, Velocity AI, Synthia AI and ViaMagus Select: build, operate, scale. They become the ViaMagus mark:
        everything an enterprise needs to become AI-native. They return to The Next Order, for GCC leaders.
      </p>
    </div>
  );
}

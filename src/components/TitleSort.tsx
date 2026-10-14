"use client";

import { useRef, type CSSProperties, type ElementType } from "react";

/**
 * The event name arrives out of order and sorts itself.
 *
 * Start positions are computed at render time from Outfit's uppercase
 * advance widths, so the animation is pure CSS and starts on first paint —
 * no measuring, no waiting for JavaScript. Letters travel vertically, then
 * horizontally, back to their slots.
 */

// Outfit 500, uppercase advance widths in em (tracking applied separately)
const ADV: Record<string, number> = { T: 0.6, H: 0.74, E: 0.6, N: 0.76, X: 0.66, O: 0.82, R: 0.66, D: 0.76 };
const TRACK = -0.05;
const SPACE = 0.24;
const LINE = 0.84;

// a fixed single-cycle shuffle (every letter leaves its slot); stable across server and client
const PERM = [6, 9, 3, 11, 0, 8, 1, 10, 4, 2, 7, 5];

type Slot = { ch: string; x: number; y: number; k: number };

function slots(lines: readonly string[]) {
  const out: (Slot | { space: true; key: string })[][] = [];
  let k = 0;
  lines.forEach((line, li) => {
    let x = 0;
    const row: (Slot | { space: true; key: string })[] = [];
    for (const ch of line) {
      if (ch === " ") {
        row.push({ space: true, key: `s${li}-${x}` });
        x += SPACE;
        continue;
      }
      row.push({ ch, x, y: li * LINE, k: k++ });
      x += (ADV[ch] ?? 0.66) + TRACK;
    }
    out.push(row);
  });
  return out;
}

type Props = {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /** "fast" is used by the film */
  speed?: "site" | "fast";
  showReplay?: boolean;
};

export function TitleSort({ lines, as: Tag = "h1", className = "", speed = "site", showReplay = false }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const rows = slots(lines);
  const flat = rows.flat().filter((s): s is Slot => !("space" in s));
  const n = flat.length;

  const replay = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-play");
    void el.offsetWidth;
    el.classList.add("is-play");
  };

  return (
    <div className={`ts-wrap ${className}`}>
      <Tag ref={ref} className={`ts ts--${speed} is-play`} aria-label={lines.join(" ")}>
        {rows.map((row, li) => (
          <span key={li} className="ts-line" aria-hidden="true">
            {row.map((s) => {
              if ("space" in s) return <span key={s.key} className="ts-sp" />;
              const from = flat[PERM[s.k % PERM.length] % n];
              const style = {
                "--dx": (from.x - s.x).toFixed(3),
                "--dy": (from.y - s.y).toFixed(3),
                "--i": s.k,
              } as CSSProperties;
              return (
                <span key={s.k} className="ts-ch" style={style}>
                  {s.ch}
                </span>
              );
            })}
          </span>
        ))}
      </Tag>
      {showReplay ? (
        <button type="button" className="ts-replay" onClick={replay}>
          <span aria-hidden="true">↻</span> Re-order
        </button>
      ) : null}
    </div>
  );
}

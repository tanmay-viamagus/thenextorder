"use client";

import { useCallback, useEffect, useRef, type ElementType } from "react";

type Props = {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /** ms the scrambled state holds before the letters sort themselves */
  hold?: number;
  /** change this value to replay (used by the film) */
  playKey?: number | string;
  showReplay?: boolean;
};

/** Sattolo's shuffle: a single cycle, so every letter leaves its slot. */
function derange(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * The event name arrives out of order and sorts itself — each letter travels
 * on the grid (vertical, then horizontal) back to its place.
 */
export function TitleSort({ lines, as: Tag = "h1", className = "", hold = 650, playKey, showReplay = false }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  const play = useCallback(() => {
    const root = ref.current;
    if (!root) return;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>(".ts-ch"));
    tiles.forEach((t) => t.getAnimations().forEach((a) => a.cancel()));
    root.classList.remove("is-sorted");
    root.classList.add("is-ready");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("is-sorted");
      return;
    }
    const slots = tiles.map((t) => ({ x: t.offsetLeft, y: t.offsetTop }));
    const perm = derange(tiles.length);
    const travel = 1150;
    let last: Animation | undefined;
    let longest = 0;
    tiles.forEach((t, i) => {
      const from = slots[perm[i]];
      const dx = from.x - slots[i].x;
      const dy = from.y - slots[i].y;
      const stagger = (i % 7) * 55 + Math.floor(i / 7) * 30;
      const total = hold + stagger + travel;
      const a = t.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)`, offset: 0 },
          { transform: `translate(${dx}px, ${dy}px)`, offset: (hold + stagger) / total },
          { transform: `translate(${dx}px, 0px)`, offset: (hold + stagger + travel * 0.42) / total },
          { transform: "translate(0px, 0px)", offset: 1 },
        ],
        { duration: total, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "both" },
      );
      if (total > longest) {
        longest = total;
        last = a;
      }
    });
    last?.finished.then(() => root.classList.add("is-sorted")).catch(() => {});
  }, [hold]);

  useEffect(() => {
    play();
  }, [play, playKey]);

  const label = lines.join(" ");
  return (
    <div className={`ts-wrap ${className}`}>
      <Tag ref={ref} className="ts" aria-label={label}>
        {lines.map((line, li) => (
          <span key={li} className="ts-line" aria-hidden="true">
            {line.split("").map((ch, ci) =>
              ch === " " ? (
                <span key={ci} className="ts-sp">
                  {" "}
                </span>
              ) : (
                <span key={ci} className="ts-ch">
                  {ch}
                </span>
              ),
            )}
          </span>
        ))}
      </Tag>
      {showReplay ? (
        <button type="button" className="ts-replay" onClick={play}>
          <span aria-hidden="true">↻</span> Re-order
        </button>
      ) : null}
    </div>
  );
}

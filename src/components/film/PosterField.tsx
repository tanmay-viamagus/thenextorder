"use client";

import { useEffect, useRef } from "react";
import { createLightField } from "./shader";

/** Renders one still of the film's light field; `window.__poster()` returns it as a JPEG data URL. */
export function PosterField() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const field = createLightField(canvas, 1);
    const draw = () => field?.render({ time: 41.3, energy: 0.78, flash: 0, mono: 0 });
    draw();
    (window as unknown as { __poster: () => string }).__poster = () => {
      draw();
      return canvas.toDataURL("image/jpeg", 0.86);
    };
    return () => field?.dispose();
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", background: "#000" }} />;
}

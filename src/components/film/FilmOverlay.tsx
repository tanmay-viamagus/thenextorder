"use client";

import { useEffect, useState } from "react";
import { FilmPlayer } from "./FilmPlayer";

export const OPEN_FILM = "nxo:open-film";

/** Any element can open the film: dispatch `OPEN_FILM` on window. */
export function FilmButton({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_FILM))}>
      {children}
    </button>
  );
}

/** The film, fullscreen over the site. */
export function FilmOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => {
      setOpen(true);
      // phones: go fullscreen and landscape where the browser allows it (ignored elsewhere)
      if (window.matchMedia("(max-width: 899px)").matches) {
        document.documentElement
          .requestFullscreen?.()
          .then(() => (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.("landscape"))
          .catch(() => {});
      }
    };
    window.addEventListener(OPEN_FILM, show);
    return () => window.removeEventListener(OPEN_FILM, show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="film-overlay" role="dialog" aria-modal="true" aria-label="The NEXT Order — the film">
      <FilmPlayer
        mode="overlay"
        onClose={() => {
          setOpen(false);
          if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
        }}
      />
    </div>
  );
}

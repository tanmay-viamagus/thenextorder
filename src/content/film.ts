/**
 * The 30-second event film, as data. /film plays it; docs/film-storyboard.md documents it.
 */
export type BeatId = "hook" | "shift" | "velocity" | "synthia" | "select" | "signal" | "reveal";

export const FILM_DURATION = 30;

export const beats: { id: BeatId; start: number; end: number; label: string; section: string }[] = [
  { id: "hook", start: 0, end: 4.5, label: "The Next Order", section: "#hook" },
  { id: "shift", start: 4.5, end: 12, label: "The shift", section: "#shift" },
  { id: "velocity", start: 12, end: 16, label: "Build · Velocity AI", section: "#forces" },
  { id: "synthia", start: 16, end: 20, label: "Operate · Synthia AI", section: "#forces" },
  { id: "select", start: 20, end: 24, label: "Scale · ViaMagus Select", section: "#forces" },
  { id: "signal", start: 24, end: 27, label: "The signal", section: "#signal" },
  { id: "reveal", start: 27, end: 30, label: "The reveal", section: "#invite" },
];

/** Inside the shift beat, the pyramid re-orders at this second. */
export const SHIFT_AT = 7.6;

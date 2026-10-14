/**
 * The 30-second film — a crescendo. Tension, acceleration, a rush,
 * one second of silence, then the logo on black and the invitation.
 * /film and the on-page player both run from this timeline; the storyboard
 * in docs/film-storyboard.md documents it.
 */
export type SceneId =
  | "cursor"
  | "grid"
  | "crack"
  | "rules"
  | "eight"
  | "build"
  | "operate"
  | "scale"
  | "rush"
  | "silence"
  | "logo"
  | "title"
  | "invite";

export type Scene = {
  id: SceneId;
  start: number;
  end: number;
  /** light-field brightness, 0 (black) → 1 (full purple/magenta light) */
  energy: number;
  /** 1 = colour drained (the old order) */
  mono?: number;
  /** fire a flash on the cut */
  flash?: number;
};

export const FILM_DURATION = 30;

export const scenes: Scene[] = [
  { id: "cursor", start: 0, end: 2.2, energy: 0 },
  { id: "grid", start: 2.2, end: 4.4, energy: 0.12, mono: 1, flash: 0.35 },
  { id: "crack", start: 4.4, end: 6.2, energy: 0.28, mono: 0.7, flash: 0.6 },
  { id: "rules", start: 6.2, end: 8, energy: 0.7, flash: 1 },
  { id: "eight", start: 8, end: 10, energy: 0.42, flash: 0.8 },
  { id: "build", start: 10, end: 12.5, energy: 0.62, flash: 0.7 },
  { id: "operate", start: 12.5, end: 15, energy: 0.66, flash: 0.7 },
  { id: "scale", start: 15, end: 17.5, energy: 0.7, flash: 0.7 },
  { id: "rush", start: 17.5, end: 21, energy: 1, flash: 1 },
  { id: "silence", start: 21, end: 22, energy: 0 },
  { id: "logo", start: 22, end: 25.2, energy: 0.22, flash: 1 },
  { id: "title", start: 25.2, end: 28.4, energy: 0.85, flash: 0.6 },
  { id: "invite", start: 28.4, end: 30, energy: 0.18 },
];

/** The rush: one word every 0.4 s, each with its own flash and beat. */
export const RUSH_STEP = 0.4;
export const rushWords = ["Build.", "Operate.", "Scale.", "Engineering.", "Intelligence.", "Talent.", "Three forces.", "One order."];

export const sceneAt = (t: number) => scenes.find((s) => t >= s.start && t < s.end) ?? scenes[scenes.length - 1];

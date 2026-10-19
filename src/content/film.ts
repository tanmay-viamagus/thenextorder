/**
 * The 30-second event-screen film, on the storyboard from the brief.
 * 16:9, readable without sound, and it loops: the last second wipes back to
 * paper, where the title begins. docs/film-storyboard.md documents it.
 */
export type FilmSceneId = "title" | "old" | "inflection" | "build" | "operate" | "scale" | "converge" | "close";

export type FilmScene = { id: FilmSceneId; start: number; end: number };

export const FILM_DURATION = 30;

export const filmScenes: FilmScene[] = [
  { id: "title", start: 0, end: 3 },
  { id: "old", start: 3, end: 6 },
  { id: "inflection", start: 6, end: 10 },
  { id: "build", start: 10, end: 14 },
  { id: "operate", start: 14, end: 18 },
  { id: "scale", start: 18, end: 22 },
  { id: "converge", start: 22, end: 26 },
  { id: "close", start: 26, end: 30 },
];

export const sceneAtTime = (t: number) =>
  filmScenes.find((s) => t >= s.start && t < s.end) ?? filmScenes[filmScenes.length - 1];

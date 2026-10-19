/**
 * The 42-second event-screen film, on the storyboard from the brief.
 * 16:9, readable without sound, and it loops: the last second wipes back to
 * paper, where the title begins. docs/film-storyboard.md documents it.
 */
export type FilmSceneId = "title" | "old" | "inflection" | "build" | "operate" | "scale" | "converge" | "close";

export type FilmScene = { id: FilmSceneId; start: number; end: number };

export const FILM_DURATION = 42;

export const filmScenes: FilmScene[] = [
  { id: "title", start: 0, end: 4 },
  { id: "old", start: 4, end: 9 },
  { id: "inflection", start: 9, end: 15 },
  { id: "build", start: 15, end: 20 },
  { id: "operate", start: 20, end: 25 },
  { id: "scale", start: 25, end: 30 },
  { id: "converge", start: 30, end: 36 },
  { id: "close", start: 36, end: 42 },
];

export const sceneAtTime = (t: number) =>
  filmScenes.find((s) => t >= s.start && t < s.end) ?? filmScenes[filmScenes.length - 1];

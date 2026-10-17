/**
 * The 30-second film: the site's story on a clock. The same engine and the
 * same formations; one short caption per beat, large enough for a venue
 * screen, and nothing that depends on sound. Ends where it starts (chaos),
 * so the loop is seamless. docs/film-storyboard.md documents it.
 */
export type FilmScene = {
  id: "arrive" | "old" | "break" | "stake" | "forces" | "mark" | "end";
  start: number;
  end: number;
  /** formation index (see components/order/story.ts → F) */
  f: number;
};

export const FILM_DURATION = 30;

export const filmScenes: FilmScene[] = [
  { id: "arrive", start: 0, end: 3.6, f: 1 },
  { id: "old", start: 3.6, end: 7.6, f: 2 },
  { id: "break", start: 7.6, end: 10.6, f: 3 },
  { id: "stake", start: 10.6, end: 14.2, f: 4 },
  { id: "forces", start: 14.2, end: 21.4, f: 5 },
  { id: "mark", start: 21.4, end: 25.4, f: 6 },
  { id: "end", start: 25.4, end: 30, f: 1 },
];

/** inside "forces": when each force is opened in turn */
export const FORCE_BEATS = [15.4, 17.4, 19.4];
/** the cells start in chaos and return to it for the last second, closing the loop */
export const CHAOS_UNTIL = 1.0;
export const CHAOS_FROM = 29.0;
/** seconds each transition between formations takes */
export const BLEND = 0.9;

export const sceneAtTime = (t: number) =>
  filmScenes.find((s) => t >= s.start && t < s.end) ?? filmScenes[filmScenes.length - 1];

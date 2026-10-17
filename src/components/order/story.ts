import type { Formation } from "./engine";
import { C, chaos, cell, clusters, fromText, mark, pyramid, shatter, text, type ClusterGeo } from "./formations";

/** Formation indices — the story, in order. */
export const F = { chaos: 0, title: 1, pyramid: 2, shatter: 3, eight: 4, forces: 5, mark: 6, cell: 7 } as const;

export type Story = {
  formations: Formation[];
  which: Uint8Array;
  geo: ClusterGeo;
};

/** Build every formation for a w × h screen. Both the site and the film use this. */
export function buildStory(w: number, h: number, n: number, family: string, film = false): Story {
  const portrait = h > w * 1.1;
  const title = text(w, h, n, ["THE NEXT", "ORDER."], family, {
    cx: w / 2,
    cy: h * (portrait ? 0.4 : film ? 0.44 : 0.42),
    maxW: w * (portrait ? 0.9 : 0.84),
    maxH: h * (portrait ? 0.34 : 0.56),
  });
  const eight = text(
    w,
    h,
    n,
    ["8%"],
    family,
    { cx: w / 2, cy: h * (portrait ? 0.34 : 0.4), maxW: w * (portrait ? 0.8 : 0.5), maxH: h * (portrait ? 0.34 : 0.56) },
    1,
  );
  const cl = clusters(w, h, n);
  const formations: Formation[] = [
    chaos(w, h, n, C.black),
    fromText(title.pos, n, C.black, C.white, { accent: C.magenta, share: 0.06, size: portrait ? 2 : 2.4 }),
    portrait ? pyramid(w, h, n, w / 2, h * 0.36, w * 0.82) : pyramid(w, h, n, w * 0.66, h * 0.47, Math.min(w * 0.42, h * 0.7)),
    shatter(w, h, n),
    fromText(eight.pos, n, C.black, C.white, { split: eight.split, splitCol: C.magenta, size: portrait ? 2.2 : 2.6 }),
    cl.formation,
    mark(w, h, n, w / 2, h * (portrait ? 0.38 : 0.42), portrait ? w * 0.74 : Math.min(w * 0.44, h * 0.95)),
    cell(w, h, n, w / 2, h * 0.7, Math.min(w, h) * (portrait ? 0.34 : 0.24)),
  ];
  return { formations, which: cl.which, geo: cl.geo };
}

/** Scale each cluster about its centre: the highlighted force swells, the others recede. */
export function highlighter(story: Story) {
  const scale = [1, 1, 1];
  return (tx: Float32Array, n: number, k: number | null, amount: number, dt: number) => {
    for (let c = 0; c < 3; c++) {
      const want = k === null ? 1 : c === k ? 1.45 : 0.62;
      scale[c] += (want - scale[c]) * Math.min(1, dt * 6);
    }
    if (amount <= 0) return;
    const { which, geo } = story;
    for (let i = 0; i < n; i++) {
      const g = geo[which[i]];
      const s = 1 + (scale[which[i]] - 1) * amount;
      tx[i * 2] = g.x + (tx[i * 2] - g.x) * s;
      tx[i * 2 + 1] = g.y + (tx[i * 2 + 1] - g.y) * s;
    }
  };
}

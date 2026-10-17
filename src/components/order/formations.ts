import type { Formation, RGB } from "./engine";

/** Brand colours (docs/brand-audit.md), 0–1 */
export const C = {
  black: [0.004, 0.004, 0.012] as RGB,
  ink: [0.055, 0.051, 0.071] as RGB,
  white: [0.988, 0.992, 1] as RGB,
  purple: [0.4, 0.031, 0.663] as RGB,
  magenta: [0.988, 0.376, 0.859] as RGB,
  lilac: [0.949, 0.816, 1] as RGB,
  paper: [0.957, 0.949, 0.925] as RGB,
  cyan: [0, 0.78, 0.808] as RGB,
  violet: [0.745, 0.396, 1] as RGB,
  amber: [0.961, 0.722, 0.239] as RGB,
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function colours(n: number, base: RGB, accent?: RGB, share = 0) {
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const c = accent && Math.random() < share ? accent : base;
    col.set(c, i * 3);
  }
  return col;
}

/** Sample n points from whatever is drawn on an offscreen canvas. */
function sampleCanvas(w: number, h: number, n: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const cv = document.createElement("canvas");
  cv.width = Math.max(1, Math.floor(w));
  cv.height = Math.max(1, Math.floor(h));
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  draw(ctx);
  const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
  // count filled pixels to pick a sampling step that gives roughly 2n candidates
  let filled = 0;
  for (let k = 3; k < data.length; k += 16) if (data[k] > 128) filled++;
  filled *= 4;
  const step = Math.max(1, Math.sqrt(filled / (n * 2)));
  const pts: number[] = [];
  for (let y = 0; y < cv.height; y += step) {
    for (let x = 0; x < cv.width; x += step) {
      const a = data[(Math.floor(y) * cv.width + Math.floor(x)) * 4 + 3];
      if (a > 128) pts.push(x, y);
    }
  }
  const out = new Float32Array(n * 2);
  const m = pts.length / 2;
  if (!m) return out;
  // shuffle-pick so every formation spreads cells evenly over the shape
  for (let i = 0; i < n; i++) {
    const j = i < m ? Math.floor((i * 7919) % m) : Math.floor(Math.random() * m);
    out[i * 2] = pts[j * 2] + rand(-step / 2, step / 2);
    out[i * 2 + 1] = pts[j * 2 + 1] + rand(-step / 2, step / 2);
  }
  return out;
}

/** Text, fitted into a box, centred at (cx, cy). Returns positions and the x where `splitAt` chars end. */
export function text(
  w: number,
  h: number,
  n: number,
  lines: string[],
  family: string,
  box: { cx: number; cy: number; maxW: number; maxH: number },
  splitAt?: number,
) {
  const probe = document.createElement("canvas").getContext("2d")!;
  let size = 400;
  const lh = 0.86;
  const fit = () => {
    probe.font = `600 ${size}px ${family}`;
    const widest = Math.max(...lines.map((l) => probe.measureText(l).width));
    return { widest, height: size * lh * lines.length };
  };
  let m = fit();
  while ((m.widest > box.maxW || m.height > box.maxH) && size > 10) {
    size *= 0.94;
    m = fit();
  }
  let split = Infinity;
  const pos = sampleCanvas(w, h, n, (ctx) => {
    ctx.font = `600 ${size}px ${family}`;
    ctx.textBaseline = "middle";
    const top = box.cy - (size * lh * (lines.length - 1)) / 2;
    lines.forEach((l, i) => {
      const lw = ctx.measureText(l).width;
      const x = box.cx - m.widest / 2;
      ctx.fillText(l, x, top + i * size * lh);
      if (splitAt !== undefined && i === 0) split = x + ctx.measureText(l.slice(0, splitAt)).width;
      void lw;
    });
  });
  return { pos, split };
}

export function chaos(w: number, h: number, n: number, bg: RGB): Formation {
  const pos = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    pos[i * 2] = rand(-0.05, 1.05) * w;
    pos[i * 2 + 1] = rand(-0.05, 1.05) * h;
  }
  const phase = new Float32Array(n).map(() => Math.random() * 100);
  return {
    pos,
    col: colours(n, C.white, C.magenta, 0.08),
    size: 2.6,
    bg,
    animate: (base, time, out) => {
      for (let i = 0; i < n; i++) {
        out[i * 2] = base[i * 2] + Math.sin(time * 0.35 + phase[i]) * 26;
        out[i * 2 + 1] = base[i * 2 + 1] + Math.cos(time * 0.3 + phase[i] * 1.3) * 26;
      }
    },
  };
}

export function pyramid(w: number, h: number, n: number, cx: number, cy: number, scale: number): Formation {
  // a rigid grid of tiers: the old order
  const tiers = 7;
  const cell = scale / 15;
  const slots: [number, number, number][] = [];
  for (let t = 0; t < tiers; t++) {
    const cols = 1 + t * 2;
    for (let c = 0; c < cols; c++) slots.push([cx + (c - (cols - 1) / 2) * cell * 1.08, cy - scale * 0.42 + t * cell * 1.32, t]);
  }
  const pos = new Float32Array(n * 2);
  const col = new Float32Array(n * 3);
  // each block is a crisp little grid of cells
  const per = Math.ceil(n / slots.length);
  const g = Math.max(2, Math.ceil(Math.sqrt(per)));
  for (let i = 0; i < n; i++) {
    const [sx, sy, t] = slots[i % slots.length];
    const j = Math.floor(i / slots.length);
    const gx = j % g;
    const gy = Math.floor(j / g) % g;
    pos[i * 2] = sx + (gx / (g - 1) - 0.5) * cell * 0.84;
    pos[i * 2 + 1] = sy + (gy / (g - 1) - 0.5) * cell * 0.84;
    col.set(t === 0 ? C.magenta : C.ink, i * 3);
  }
  return { pos, col, size: 2.4, bg: C.paper };
}

export function shatter(w: number, h: number, n: number): Formation {
  const pos = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.6) * Math.max(w, h) * 0.75;
    pos[i * 2] = w / 2 + Math.cos(a) * r * 1.2;
    pos[i * 2 + 1] = h / 2 + Math.sin(a) * r * 0.8;
  }
  const phase = new Float32Array(n).map(() => Math.random() * 100);
  return {
    pos,
    col: colours(n, C.ink, C.white, 0.18),
    size: 3,
    bg: C.magenta,
    animate: (base, time, out) => {
      for (let i = 0; i < n; i++) {
        out[i * 2] = base[i * 2] + Math.sin(time * 0.8 + phase[i]) * 40;
        out[i * 2 + 1] = base[i * 2 + 1] + Math.cos(time * 0.7 + phase[i]) * 40;
      }
    },
  };
}

export type ClusterGeo = { x: number; y: number; r: number }[];

export function clusterGeometry(w: number, h: number): ClusterGeo {
  // always one row, so the three read as equals; on phones the row sits higher to leave room for the panel
  const portrait = h > w * 1.1;
  const r = portrait ? Math.min(w * 0.125, h * 0.09) : Math.min(w * 0.13, h * 0.22);
  return [0.2, 0.5, 0.8].map((fx) => ({ x: w * fx, y: h * (portrait ? 0.4 : 0.48), r }));
}

export function clusters(w: number, h: number, n: number) {
  const geo = clusterGeometry(w, h);
  const pos = new Float32Array(n * 2);
  const col = new Float32Array(n * 3);
  const which = new Uint8Array(n);
  const ang = new Float32Array(n);
  const rad = new Float32Array(n);
  const tint = [C.cyan, C.violet, C.amber];
  for (let i = 0; i < n; i++) {
    const k = i % 3;
    which[i] = k;
    ang[i] = Math.random() * Math.PI * 2;
    rad[i] = Math.sqrt(Math.random()) * geo[k].r;
    pos[i * 2] = geo[k].x + Math.cos(ang[i]) * rad[i];
    pos[i * 2 + 1] = geo[k].y + Math.sin(ang[i]) * rad[i];
    col.set(Math.random() < 0.06 ? C.white : tint[k], i * 3);
  }
  const f: Formation = {
    pos,
    col,
    size: 3,
    bg: C.ink,
    animate: (_b, time, out) => {
      // each cluster turns slowly, inner cells faster — a living system
      for (let i = 0; i < n; i++) {
        const g = geo[which[i]];
        const a = ang[i] + time * (0.12 + (1 - rad[i] / g.r) * 0.35) * (which[i] === 1 ? -1 : 1);
        out[i * 2] = g.x + Math.cos(a) * rad[i];
        out[i * 2 + 1] = g.y + Math.sin(a) * rad[i];
      }
    },
  };
  return { formation: f, which, geo };
}

export function mark(w: number, h: number, n: number, cx: number, cy: number, width: number): Formation {
  const s = width / 30.4941;
  const pos = sampleCanvas(w, h, n, (ctx) => {
    ctx.translate(cx - width / 2, cy - (11.8959 * s) / 2);
    ctx.scale(s, s);
    ctx.fill(new Path2D("M0,0l6.7765,11.8958l6.7764,-11.8958z"));
    ctx.fill(new Path2D("M23.7177,0l-3.3881,5.9479l-3.3882,-5.9479l-6.7764,11.8955h20.3291z"));
  });
  return { pos, col: colours(n, C.white, C.lilac, 0.12), size: 2.4, bg: C.black };
}

export function cell(w: number, h: number, n: number, cx: number, cy: number, side: number): Formation {
  const pos = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    pos[i * 2] = cx + rand(-0.5, 0.5) * side;
    pos[i * 2 + 1] = cy + rand(-0.5, 0.5) * side;
  }
  return { pos, col: colours(n, C.magenta, C.white, 0.1), size: 2.6, bg: C.purple };
}

export function fromText(
  pos: Float32Array,
  n: number,
  bg: RGB,
  base: RGB,
  opts: { accent?: RGB; share?: number; split?: number; splitCol?: RGB; size?: number } = {},
): Formation {
  const col = colours(n, base, opts.accent, opts.share ?? 0);
  if (opts.split !== undefined && opts.splitCol) {
    for (let i = 0; i < n; i++) if (pos[i * 2] < opts.split) col.set(opts.splitCol, i * 3);
  }
  return { pos, col, size: opts.size ?? 2.4, bg };
}

/**
 * The Order engine: a few thousand square cells, rendered with WebGL points,
 * each pulled by a spring toward a target in the current "formation" and
 * pushed away by the pointer. Formations are sampled shapes (text, the
 * ViaMagus mark, a pyramid, clusters…) — blending between two of them is how
 * the story moves. Positions are in CSS pixels; colours are 0–1 RGB.
 */

export type RGB = [number, number, number];

export type Formation = {
  /** N × 2 target positions (CSS px) */
  pos: Float32Array;
  /** N × 3 colours */
  col: Float32Array;
  /** point size in CSS px */
  size: number;
  /** background colour behind this formation */
  bg: RGB;
  /** if set, targets animate each frame (e.g. drifting chaos, orbiting clusters) */
  animate?: (pos: Float32Array, time: number, out: Float32Array) => void;
};

const VERT = `
attribute vec2 a_pos;
attribute vec3 a_col;
attribute float a_size;
uniform vec2 u_res;
uniform float u_dpr;
varying vec3 v_col;
void main() {
  vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = a_size * u_dpr;
  v_col = a_col;
}`;

const FRAG = `
precision mediump float;
varying vec3 v_col;
void main() { gl_FragColor = vec4(v_col, 1.0); }`;

export class Engine {
  readonly n: number;
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private prog: WebGLProgram;
  private bufPos: WebGLBuffer;
  private bufCol: WebGLBuffer;
  private bufSize: WebGLBuffer;
  private loc: { pos: number; col: number; size: number; res: WebGLUniformLocation | null; dpr: WebGLUniformLocation | null };

  /** live state */
  pos: Float32Array;
  private vel: Float32Array;
  private col: Float32Array;
  private size: Float32Array;
  private seed: Float32Array;
  private tA: Float32Array;
  private tB: Float32Array;

  formations: Formation[] = [];
  /** blend: from formation a to b by t (0–1) */
  a = 0;
  b = 0;
  t = 0;
  /** extra scatter impulse 0–1 (press & hold) */
  scatter = 0;
  pointer = { x: -9999, y: -9999, on: false, r: 120 };
  bg: RGB = [0, 0, 0];
  stiffness = 34;
  damping = 0.83;
  w = 0;
  h = 0;
  dpr = 1;
  /** reduced motion: cells sit exactly on their targets, no springs */
  rigid = false;
  /** optional per-frame target adjuster (forces highlight, etc.) */
  shape?: (tx: Float32Array, n: number, time: number) => void;

  constructor(canvas: HTMLCanvasElement, n: number) {
    this.canvas = canvas;
    this.n = n;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.prog = prog;
    this.loc = {
      pos: gl.getAttribLocation(prog, "a_pos"),
      col: gl.getAttribLocation(prog, "a_col"),
      size: gl.getAttribLocation(prog, "a_size"),
      res: gl.getUniformLocation(prog, "u_res"),
      dpr: gl.getUniformLocation(prog, "u_dpr"),
    };
    this.bufPos = gl.createBuffer()!;
    this.bufCol = gl.createBuffer()!;
    this.bufSize = gl.createBuffer()!;

    this.pos = new Float32Array(n * 2);
    this.vel = new Float32Array(n * 2);
    this.col = new Float32Array(n * 3).fill(1);
    this.size = new Float32Array(n).fill(3);
    this.seed = new Float32Array(n);
    this.tA = new Float32Array(n * 2);
    this.tB = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) this.seed[i] = Math.random();
  }

  resize(w: number, h: number, dpr: number) {
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  /** place every cell at its first formation instantly (no animation) */
  snap(i: number) {
    const f = this.formations[i];
    if (!f) return;
    this.pos.set(f.pos);
    this.vel.fill(0);
  }

  step(dt: number, time: number) {
    const { n, pos, vel, seed, tA, tB } = this;
    const A = this.formations[this.a];
    const B = this.formations[this.b] ?? A;
    if (!A) return;
    if (A.animate) A.animate(A.pos, time, tA);
    else tA.set(A.pos);
    if (B.animate) B.animate(B.pos, time, tB);
    else tB.set(B.pos);
    const t = this.t;
    // blend targets into tA
    for (let k = 0; k < n * 2; k++) tA[k] += (tB[k] - tA[k]) * t;
    this.shape?.(tA, n, time);

    if (this.rigid) {
      pos.set(tA);
      this.vel.fill(0);
    }
    const kS = this.stiffness;
    const damp = Math.pow(this.damping, dt * 60);
    const p = this.pointer;
    const r2 = p.r * p.r;
    const sc = this.scatter;
    for (let i = 0; i < n && !this.rigid; i++) {
      const ix = i * 2;
      const iy = ix + 1;
      let tx = tA[ix];
      let ty = tA[iy];
      if (sc > 0) {
        // blow outward from the centre, each cell on its own ray
        const s = seed[i];
        const ang = s * 6283.18;
        const rad = (0.25 + s * 0.9) * Math.max(this.w, this.h) * sc;
        tx += Math.cos(ang) * rad;
        ty += Math.sin(ang) * rad;
      }
      // a little life: every cell breathes on its own phase
      tx += Math.sin(time * 1.3 + seed[i] * 40) * 0.8;
      ty += Math.cos(time * 1.1 + seed[i] * 31) * 0.8;
      let ax = (tx - pos[ix]) * kS;
      let ay = (ty - pos[iy]) * kS;
      if (p.on) {
        const dx = pos[ix] - p.x;
        const dy = pos[iy] - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / p.r) * 9000;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }
      }
      vel[ix] = (vel[ix] + ax * dt) * damp;
      vel[iy] = (vel[iy] + ay * dt) * damp;
      pos[ix] += vel[ix] * dt;
      pos[iy] += vel[iy] * dt;
    }

    // colours, size and background follow the blend
    const cA = A.col;
    const cB = B.col;
    const col = this.col;
    for (let k = 0; k < n * 3; k++) col[k] = cA[k] + (cB[k] - cA[k]) * t;
    const sz = A.size + (B.size - A.size) * t;
    this.size.fill(sz);
    for (let c = 0; c < 3; c++) this.bg[c] = A.bg[c] + (B.bg[c] - A.bg[c]) * t;
  }

  render() {
    const gl = this.gl;
    gl.clearColor(this.bg[0], this.bg[1], this.bg[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.prog);
    gl.uniform2f(this.loc.res, this.w, this.h);
    gl.uniform1f(this.loc.dpr, this.dpr);
    const bind = (buf: WebGLBuffer, data: Float32Array, loc: number, size: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    bind(this.bufPos, this.pos, this.loc.pos, 2);
    bind(this.bufCol, this.col, this.loc.col, 3);
    bind(this.bufSize, this.size, this.loc.size, 1);
    gl.drawArrays(gl.POINTS, 0, this.n);
  }

  dispose() {
    const gl = this.gl;
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufCol);
    gl.deleteBuffer(this.bufSize);
    gl.deleteProgram(this.prog);
  }
}

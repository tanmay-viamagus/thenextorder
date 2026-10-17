/**
 * The film's background: a live light field in ViaMagus colours.
 * Domain-warped noise on black, a vertical "gateway" beam, film grain and a
 * vignette. `energy` lifts it from near-black to full purple/magenta light;
 * `flash` is a decaying spike fired on every cut; `mono` drains colour for the
 * old-order scenes.
 */

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_energy;
uniform float u_flash;
uniform float u_mono;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec2 u_mouse;
uniform float u_pull;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  // the cursor is a gravity well: the field bends toward it
  vec2 toM = u_mouse - p;
  float dm = length(toM);
  p += toM * u_pull * 0.32 * exp(-dm * 2.6);
  float t = u_time * (0.06 + u_energy * 0.1);
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 4.0));
  vec2 r = vec2(fbm(p * 2.1 + q * 2.2 + vec2(1.7, 9.2) + t * 1.3), fbm(p * 2.1 + q * 2.2 + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.3 + r * 1.9);

  vec3 purple = u_c1;
  vec3 deep = u_c1 * 0.28;
  vec3 magenta = u_c2;
  vec3 lilac = vec3(0.95, 0.82, 1.0);

  float e = u_energy;
  // carve the field into light and dark: tendrils of colour through black
  float m = smoothstep(0.42, 0.95, f + r.y * 0.18);
  vec3 col = deep * m * (0.35 + e);
  col += purple * pow(m, 1.4) * (0.18 + e * 1.7);
  col += magenta * pow(m, 3.2) * e * 2.4;
  col += lilac * pow(m, 7.0) * e * 1.4;
  // the gateway: a narrow beam rising from below centre
  float beam = exp(-abs(p.x) * (14.0 - e * 6.0)) * smoothstep(0.7, -0.6, p.y);
  col += lilac * beam * e * (0.35 + 0.5 * r.x);
  // a soft light where the cursor is
  col += mix(lilac, magenta, 0.5) * exp(-dm * 7.0) * u_pull * (0.12 + e * 0.35);
  // the flash on every cut
  col += u_flash * (magenta * 0.55 + lilac * 0.35);

  col *= smoothstep(1.2, 0.1, length(p * vec2(0.8, 1.0)));
  col = mix(col, vec3(dot(col, vec3(0.3, 0.59, 0.11))), u_mono);
  col += (hash(gl_FragCoord.xy + fract(u_time) * 100.0) - 0.5) * 0.045;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

export type RGB = [number, number, number];
export type Uniforms = {
  time: number;
  energy: number;
  flash: number;
  mono: number;
  c1?: RGB;
  c2?: RGB;
  /** cursor in field space (y up, units of screen height from centre) */
  mouse?: [number, number];
  pull?: number;
};

/** ViaMagus primary #6608a9 and secondary #fc60db, linear-ish 0–1 */
export const BRAND: { c1: RGB; c2: RGB } = { c1: [0.4, 0.03, 0.66], c2: [0.99, 0.38, 0.86] };

export function createLightField(canvas: HTMLCanvasElement, scale = 0.5) {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, powerPreference: "high-performance" });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn("light field:", gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(prog, "u_res"),
    time: gl.getUniformLocation(prog, "u_time"),
    energy: gl.getUniformLocation(prog, "u_energy"),
    flash: gl.getUniformLocation(prog, "u_flash"),
    mono: gl.getUniformLocation(prog, "u_mono"),
    c1: gl.getUniformLocation(prog, "u_c1"),
    c2: gl.getUniformLocation(prog, "u_c2"),
    mouse: gl.getUniformLocation(prog, "u_mouse"),
    pull: gl.getUniformLocation(prog, "u_pull"),
  };

  const resize = () => {
    const w = Math.max(2, Math.round(canvas.clientWidth * scale));
    const h = Math.max(2, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  return {
    render(v: Uniforms) {
      resize();
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, v.time);
      gl.uniform1f(u.energy, v.energy);
      gl.uniform1f(u.flash, v.flash);
      gl.uniform1f(u.mono, v.mono);
      gl.uniform3fv(u.c1, v.c1 ?? BRAND.c1);
      gl.uniform3fv(u.c2, v.c2 ?? BRAND.c2);
      gl.uniform2fv(u.mouse, v.mouse ?? [0, 0]);
      gl.uniform1f(u.pull, v.pull ?? 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      // the canvas (and its context) can be re-mounted, so the context is left for GC
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    },
  };
}

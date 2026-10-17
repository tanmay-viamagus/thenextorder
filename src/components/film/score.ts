import { FILM_DURATION, FORCE_BEATS, filmScenes } from "@/content/film";

/**
 * An optional score, synthesised live with Web Audio — no audio files.
 * A kick on every change of formation, hats while the forces turn, a riser
 * into the mark, a sub-bass boom when it lands, a pad under the name.
 * The film never depends on it.
 */
export class Score {
  ctx: AudioContext;
  private out: GainNode;
  private noise: AudioBuffer;
  private nodes: AudioScheduledSourceNode[] = [];

  constructor() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    this.out = this.ctx.createGain();
    this.out.gain.value = 0.85;
    this.out.connect(comp).connect(this.ctx.destination);
    const len = this.ctx.sampleRate * 2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  private env(at: number, peak: number, attack: number, decay: number) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
    g.connect(this.out);
    return g;
  }

  private track(n: AudioScheduledSourceNode, at: number, dur: number) {
    n.start(at);
    n.stop(at + dur);
    this.nodes.push(n);
    n.onended = () => (this.nodes = this.nodes.filter((x) => x !== n));
  }

  kick(at: number, peak = 0.9) {
    const o = this.ctx.createOscillator();
    o.frequency.setValueAtTime(140, at);
    o.frequency.exponentialRampToValueAtTime(42, at + 0.14);
    o.connect(this.env(at, peak, 0.004, 0.32));
    this.track(o, at, 0.4);
  }

  hit(at: number, peak: number, freq: number, type: BiquadFilterType, decay: number) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    s.connect(f).connect(this.env(at, peak, 0.002, decay));
    this.track(s, at, decay + 0.05);
  }

  boom(at: number) {
    const o = this.ctx.createOscillator();
    o.frequency.setValueAtTime(70, at);
    o.frequency.exponentialRampToValueAtTime(28, at + 1.4);
    o.connect(this.env(at, 1.2, 0.01, 2.6));
    this.track(o, at, 2.8);
    this.hit(at, 0.6, 380, "lowpass", 1.6);
  }

  riser(at: number, dur: number) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 3;
    f.frequency.setValueAtTime(300, at);
    f.frequency.exponentialRampToValueAtTime(7000, at + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.45, at + dur - 0.02);
    g.gain.setValueAtTime(0.0001, at + dur);
    s.connect(f).connect(g).connect(this.out);
    this.track(s, at, dur);
  }

  pad(at: number, dur: number) {
    [110, 164.81, 220, 246.94, 329.63].forEach((hz, i) => {
      const o = this.ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = hz;
      o.detune.value = (i - 2) * 6;
      const f = this.ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(400, at);
      f.frequency.linearRampToValueAtTime(1600, at + dur * 0.6);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(0.07, at + 0.5);
      g.gain.setValueAtTime(0.07, at + dur - 1);
      g.gain.linearRampToValueAtTime(0.0001, at + dur);
      o.connect(f).connect(g).connect(this.out);
      this.track(o, at, dur);
    });
  }

  /** Schedule one loop whose t = 0 is `loopStart` (audio clock); skip anything before `fromT`. */
  scheduleLoop(loopStart: number, fromT = 0) {
    const at = (t: number) => loopStart + t;
    const ok = (t: number) => t >= fromT - 0.001;
    for (const s of filmScenes) {
      if (!ok(s.start) || s.id === "mark") continue;
      this.kick(at(s.start), 0.85);
      this.hit(at(s.start), 0.3, 2500, "highpass", 0.12);
    }
    for (const b of FORCE_BEATS) if (ok(b)) this.kick(at(b), 0.7);
    const forces = filmScenes.find((s) => s.id === "forces")!;
    for (let t = forces.start; t < forces.end; t += 0.25) if (ok(t)) this.hit(at(t), 0.1, 8000, "highpass", 0.04);
    const mark = filmScenes.find((s) => s.id === "mark")!;
    if (ok(mark.start - 1.8)) this.riser(at(mark.start - 1.8), 1.8);
    if (ok(mark.start)) this.boom(at(mark.start));
    const end = filmScenes.find((s) => s.id === "end")!;
    if (ok(end.start)) this.pad(at(end.start), FILM_DURATION - end.start);
  }

  stopAll() {
    this.nodes.forEach((n) => {
      try {
        n.stop();
      } catch {}
    });
    this.nodes = [];
  }

  close() {
    this.stopAll();
    void this.ctx.close();
  }
}

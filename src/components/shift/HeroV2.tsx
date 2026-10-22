import { MavericksLogo } from "@/components/Brand";
import { FilmButton } from "@/components/film/FilmOverlay";
import { statusLine } from "@/content/event";
import { cta } from "@/content/story";
import { ShiftTitle } from "./Interactive";

/**
 * V2 opening — one centred column on the layout the brief sketched:
 * a background shape (the brand's segmented rings, as a U that dips behind
 * the title), the title, one line, two calls to action side by side, and a
 * line of facts at the foot. The magenta cut still runs through the title.
 */
const rad = (d: number) => (d * Math.PI) / 180;
const f = (n: number) => n.toFixed(2);
/** an arc on a circle centred at 0,0; angles clockwise from 12 o'clock */
const arc = (a0: number, a1: number, r: number) => {
  const p = (a: number) => [Math.sin(rad(a)) * r, -Math.cos(rad(a)) * r];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
};
/** the lower half only (90° → 270°): the U */
const RINGS = [
  { r: 452, n: 40, w: 14 },
  { r: 404, n: 30, w: 10 },
  { r: 364, n: 20, w: 7 },
];

function Arc() {
  return (
    <svg className="hero2__arc" viewBox="-500 -500 1000 1000" aria-hidden="true" focusable="false">
      <path className="hero2__band" d={arc(90, 270, 410)} strokeWidth={120} />
      {RINGS.map((ring) => {
        const step = 180 / ring.n;
        const gap = step * 0.3;
        return (
          <g key={ring.r} className="hero2__ring">
            {Array.from({ length: ring.n }, (_, i) => (
              <path key={i} d={arc(90 + i * step + gap / 2, 90 + (i + 1) * step - gap / 2, ring.r)} strokeWidth={ring.w} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function HeroV2() {
  return (
    <section id="top" className="hero2" data-tone="dark" data-shift-root aria-labelledby="hero-h">
      <Arc />
      <div className="hero2__in">
        <h1 id="hero-h" className="sr-only">
          The NEXT Order — an invite-only symposium from Viamagus for Hyderabad’s GCC leaders and decision-makers
        </h1>
        <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} />
        <div className="hero2__text">
          <p className="hero2__line">The next order of talent, technology and leadership.</p>
          <p className="hero2__sub">An invite-only symposium for Hyderabad’s GCC leaders and decision-makers.</p>
        </div>
        <div className="hero2__cta">
          <a className="btn btn--shift btn--lg" href="/register">
            {cta.primary}{" "}
            <span className="btn__arr" aria-hidden="true">
              →
            </span>
          </a>
          <FilmButton className="fl__btn hero2__film">
            <span className="fl__btnplay" aria-hidden="true">
              <span className="tri" />
            </span>
            Play the film
          </FilmButton>
        </div>
      </div>
      <div className="hero2__foot">
        <p className="hero2__facts">{statusLine()}</p>
        <p className="hero2__partner">
          <span>In collaboration with</span>
          <MavericksLogo className="hero2__mav" height={20} />
        </p>
      </div>
    </section>
  );
}

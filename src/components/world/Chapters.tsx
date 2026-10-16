import type { CSSProperties, ReactNode } from "react";
import { event, interestUrl, knownFacts, officialLinks, pending, whenWhere } from "@/content/event";
import { forces, hook, invite, signal, title } from "@/content/story";
import { SelectWordmark, SynthiaLogo, VelocityWordmark, ViaMagusLogo, ViaMagusMark } from "../Brand";
import { FilmButton } from "../film/FilmOverlay";
import { SelectVisual, SynthiaVisual, VelocityVisual } from "../ForceVisuals";
import { TitleSort } from "../TitleSort";

/** Scroll-scrubbed reveal: in over [a, b] of the chapter's --p, out over [c, d]. */
function S({
  a,
  b,
  c = 2,
  d = 3,
  as: Tag = "div",
  className = "",
  children,
  style,
}: {
  a: number;
  b: number;
  c?: number;
  d?: number;
  as?: "div" | "p" | "h2" | "h3" | "span";
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <Tag className={`sx ${className}`} style={{ "--a": a, "--b": b, "--c": c, "--d": d, ...style } as CSSProperties}>
      {children}
    </Tag>
  );
}

export function Header() {
  return (
    <>
      <a className="skip-link" href="#invite">
        Skip to the invitation
      </a>
      <header className="hdr">
        <ViaMagusLogo href={officialLinks.viamagus} />
        <nav className="hdr__nav" aria-label="Site">
          <FilmButton className="hdr__film">
            <span className="play" aria-hidden="true" /> Watch the film
          </FilmButton>
          <a className="hdr__invite" href="#invite">
            Request an invitation
          </a>
        </nav>
      </header>
    </>
  );
}

/* 01 — the hero */
export function Hero() {
  const line = whenWhere();
  return (
    <section className="ch ch--hero" data-ch="hero" aria-label="The Next Order">
      <div className="hero">
        <p className="kicker hero__kicker">
          {invite.from} <span aria-hidden="true">·</span> For GCC leaders{line ? ` · ${line}` : ""}
        </p>
        <TitleSort lines={title} className="hero__title" showReplay />
        <p className="hero__line">{hook}</p>
        <div className="hero__actions">
          <FilmButton className="btn btn--film">
            <span className="btn__play" aria-hidden="true">
              <span className="play" />
            </span>
            Watch the film <span className="btn__dim">30 sec</span>
          </FilmButton>
          <a className="btn btn--ghost" href="#invite">
            Request an invitation
          </a>
        </div>
      </div>
      <p className="scrollcue" aria-hidden="true">
        <i /> Scroll
      </p>
    </section>
  );
}

/* 02 — the old order breaks */
export function Order() {
  const cells = Array.from({ length: 12 * 7 }, (_, i) => i);
  return (
    <section className="ch ch--order" data-ch="order" aria-labelledby="order-a">
      <div className="stage">
        <div className="grid" aria-hidden="true">
          {cells.map((i) => (
            <i
              key={i}
              style={
                {
                  "--i": i,
                  "--r": (i * 37) % 84,
                  "--fx": (((i * 53) % 21) - 10) * 4,
                  "--fr": (((i * 71) % 17) - 8) * 9,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="order">
          <S a={0.02} b={0.1} c={0.44} d={0.52} as="p" className="kicker">
            The last order
          </S>
          <S a={0.04} b={0.16} c={0.45} d={0.53} as="h2" className="mega">
            <span id="order-a">Built to scale people.</span>
          </S>
          <S a={0.1} b={0.22} c={0.43} d={0.51} as="p" className="sub">
            Layers of functions. Work handed down. Growth meant more of everything.
          </S>
        </div>
        <div className="order order--b">
          <S a={0.6} b={0.68} as="p" className="kicker kicker--hot">
            The shift
          </S>
          <S a={0.58} b={0.72} as="h2" className="mega">
            AI changed the rules.
          </S>
          <S a={0.72} b={0.84} as="p" className="sub">
            Now the operating model has to change — engineering, operations and talent, together.
          </S>
        </div>
      </div>
    </section>
  );
}

/* 03 — three forces: the light turns each force's colour */
const MARK = { velocity: <VelocityWordmark />, synthia: <SynthiaLogo height={34} />, select: <SelectWordmark /> };
const DEMO = { velocity: <VelocityVisual />, synthia: <SynthiaVisual />, select: <SelectVisual /> };

export function Forces() {
  return (
    <section className="ch ch--forces" data-ch="forces" aria-label="Build. Operate. Scale.">
      <div className="stage">
        <p className="forces__tag kicker">
          Three forces. One operating model.
          <span className="forces__count" aria-hidden="true">
            <b /> / 03
          </span>
        </p>
        {forces.map((f, k) => {
          const a = k / 3;
          const z = (k + 1) / 3;
          const last = k === forces.length - 1;
          return (
            <article
              key={f.key}
              className={`force force--${f.key}`}
              style={{ "--k": k, "--k0": a } as CSSProperties}
              aria-labelledby={`force-${f.key}`}
            >
              <S a={a} b={a + 0.06} c={last ? 2 : z - 0.05} d={last ? 3 : z - 0.005} className="force__verb" as="p">
                <span aria-hidden="true">{f.verb}.</span>
              </S>
              <div className="force__body">
                <S a={a + 0.02} b={a + 0.08} c={last ? 2 : z - 0.06} d={last ? 3 : z - 0.01} as="p" className="kicker">
                  0{k + 1} — {f.verb}
                </S>
                <S a={a + 0.03} b={a + 0.09} c={last ? 2 : z - 0.06} d={last ? 3 : z - 0.01} className="force__mark">
                  {MARK[f.key]}
                </S>
                <S a={a + 0.04} b={a + 0.1} c={last ? 2 : z - 0.055} d={last ? 3 : z - 0.008} as="h3" className="force__claim">
                  <span id={`force-${f.key}`}>{f.claim}</span>
                </S>
                <S a={a + 0.06} b={a + 0.12} c={last ? 2 : z - 0.05} d={last ? 3 : z - 0.006} as="p" className="force__detail">
                  {f.detail}
                </S>
                <S a={a + 0.08} b={a + 0.14} c={last ? 2 : z - 0.05} d={last ? 3 : z - 0.005} className="force__demo">
                  {DEMO[f.key]}
                </S>
                <S a={a + 0.1} b={a + 0.15} c={last ? 2 : z - 0.05} d={last ? 3 : z - 0.005} className="force__link-wrap">
                  <a className="force__link" href={f.href} target="_blank" rel="noopener noreferrer">
                    {f.source} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </S>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* 04 — the signal */
export function Signal() {
  const lit = [7, 22, 34, 46, 58, 63, 79, 91];
  return (
    <section className="ch ch--signal" data-ch="signal" aria-labelledby="signal-h">
      <div className="stage">
        <div className="signal">
          <S a={0} b={0.22} c={0.6} d={0.68} className="signal__num" as="h2">
            <span id="signal-h">
              <b>{signal.figure}</b>%
            </span>
          </S>
          <S a={0} b={0.01} c={0.6} d={0.68} className="signal__side">
            <S a={0.16} b={0.3} as="p" className="signal__finding">
              {signal.finding}
            </S>
            <S a={0.2} b={0.32} as="p" className="signal__src">
              <a href={signal.sourceUrl} target="_blank" rel="noopener noreferrer">
                {signal.source}
              </a>
            </S>
            <div className="dots" aria-hidden="true">
              {Array.from({ length: 100 }, (_, i) => (
                <i key={i} className={lit.includes(i) ? "is-lit" : ""} style={{ "--t": 0.28 + lit.indexOf(i) * 0.03 } as CSSProperties} />
              ))}
            </div>
            <S a={0.5} b={0.62} as="p" className="signal__src signal__counter">
              {signal.counter}{" "}
              <a href={signal.counterUrl} target="_blank" rel="noopener noreferrer">
                {signal.counterSource}
              </a>
            </S>
          </S>
        </div>
        <S a={0.68} b={0.82} as="p" className="signal__closing">
          {signal.closing}
        </S>
      </div>
    </section>
  );
}

/* 05 — the finale: the mark on black, then the name */
export function Finale() {
  return (
    <section className="ch ch--finale" data-ch="finale" aria-label="ViaMagus — The Next Order">
      <div className="stage">
        <div className="mark" aria-hidden="true">
          <span className="mark__ring" />
          <svg className="mark__svg" viewBox="0 0 30.4941 11.8959">
            <path className="mark__l" d="M0,0l6.7765,11.8958l6.7764,-11.8958z" />
            <path className="mark__r" d="M23.7177,0l-3.3881,5.9479l-3.3882,-5.9479l-6.7764,11.8955h20.3291z" />
          </svg>
          <p className="mark__word">viamagus</p>
        </div>
        <div className="finale">
          <S a={0.56} b={0.7} className="finale__title" as="p">
            <span className="ts-line">The Next</span>
            <span className="ts-line">Order</span>
          </S>
          <S a={0.68} b={0.8} as="p" className="finale__pos">
            {invite.positioning}
          </S>
        </div>
      </div>
    </section>
  );
}

/* 06 — the invitation */
export function Invite() {
  const rows = [
    { k: "For", v: knownFacts.audience },
    { k: "When & where", v: whenWhere() },
    ...(event.format ? [{ k: "Format", v: event.format }] : []),
    ...(event.speakers.length ? [{ k: "With", v: event.speakers.map((s) => `${s.name}, ${s.role}`).join(" · ") }] : []),
    { k: "Hosted by", v: knownFacts.host },
  ];
  return (
    <section id="invite" className="ch ch--invite" data-ch="invite" aria-labelledby="invite-h">
      <div className="invite">
        <div className="invite__lead">
          <p className="kicker kicker--hot">Your next move</p>
          <h2 id="invite-h" className="invite__h">
            {invite.headline[0]} <em>{invite.headline[1]}</em>
          </h2>
        </div>
        <div className="invite__card">
          <p className="invite__from">
            <ViaMagusMark className="invite__mark" /> {invite.from}
          </p>
          <dl className="invite__rows">
            {rows.map((r) => (
              <div key={r.k}>
                <dt>{r.k}</dt>
                <dd className={r.v ? "" : "is-pending"}>{r.v ?? pending}</dd>
              </div>
            ))}
          </dl>
          <div className="invite__actions">
            <a
              className="btn btn--hot"
              href={event.registrationUrl ?? interestUrl}
              target={event.registrationUrl ? undefined : "_blank"}
              rel="noopener noreferrer"
            >
              {event.registrationUrl ? "Request your invitation" : "Register your interest"} <span aria-hidden="true">→</span>
            </a>
            <FilmButton className="btn btn--ghost">
              <span className="play" aria-hidden="true" /> Watch the film
            </FilmButton>
          </div>
        </div>
      </div>
      <footer className="foot">
        <ViaMagusLogo />
        <ul>
          <li>
            <a href={officialLinks.velocity} target="_blank" rel="noopener noreferrer">
              Velocity AI
            </a>
          </li>
          <li>
            <a href={officialLinks.synthia} target="_blank" rel="noopener noreferrer">
              Synthia AI
            </a>
          </li>
          <li>
            <a href={officialLinks.select} target="_blank" rel="noopener noreferrer">
              ViaMagus Select
            </a>
          </li>
        </ul>
        <p>© {new Date().getFullYear()} ViaMagus Technologies Pvt. Ltd.</p>
      </footer>
    </section>
  );
}

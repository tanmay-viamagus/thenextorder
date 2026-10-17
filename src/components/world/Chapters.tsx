import type { CSSProperties, ReactNode } from "react";
import { event, interestUrl, knownFacts, officialLinks, pending, whenWhere } from "@/content/event";
import { eras, forces, hook, inflection, invite, nextOrder, oldOrder, title, type Signal } from "@/content/story";
import { SelectWordmark, SynthiaLogo, VelocityWordmark, ViaMagusLogo, ViaMagusMark } from "../Brand";
import { FilmButton } from "../film/FilmOverlay";
import { SelectVisual, SynthiaVisual, VelocityVisual } from "../ForceVisuals";
import { TitleSort } from "../TitleSort";

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */

/** A beat inside a chapter: active while the chapter's --p is in [a, b). */
function Seg({
  a,
  b,
  look,
  hold = false,
  className = "",
  children,
  label,
}: {
  a: number;
  b: number;
  look: string;
  hold?: boolean;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <div
      className={`seg${hold ? " seg--hold" : ""} ${className}`}
      data-seg={`${a} ${b}`}
      data-look={look}
      role={label ? "group" : undefined}
      aria-label={label}
    >
      {children}
    </div>
  );
}

/** Reveals with its beat; `s` staggers it. */
function X({
  s = 0,
  as: Tag = "div",
  className = "",
  children,
  id,
  glitch,
}: {
  s?: number;
  as?: "div" | "p" | "h2" | "h3" | "span";
  className?: string;
  children: ReactNode;
  id?: string;
  /** text for the cyan/magenta channel-split copies */
  glitch?: string;
}) {
  return (
    <Tag
      id={id}
      className={`sx ${glitch ? "glitch " : ""}${className}`}
      style={{ "--s": s } as CSSProperties}
    >
      {children}
      {glitch ? (
        <>
          <span className="glitch__a" aria-hidden="true">
            {glitch}
          </span>
          <span className="glitch__b" aria-hidden="true">
            {glitch}
          </span>
        </>
      ) : null}
    </Tag>
  );
}

function Source({ sig }: { sig: Signal }) {
  return (
    <p className="src">
      <span className={`src__kind${sig.kind === "Forecast" ? " src__kind--forecast" : ""}`}>{sig.kind}</span>
      <a href={sig.url} target="_blank" rel="noopener noreferrer">
        {sig.source}, {sig.date}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <span className="src__pop">{sig.population}</span>
    </p>
  );
}

/** A figure that counts up as its beat reveals ("58%" → 0…58 + "%"). */
function Count({ figure }: { figure: string }) {
  const m = figure.match(/^([\d,]+)(.*)$/);
  if (!m) return <>{figure}</>;
  const to = Number(m[1].replace(/,/g, ""));
  return (
    <>
      <span className="sr-only">{figure}</span>
      <span className="count" aria-hidden="true" data-suffix={m[2]} data-full={figure} style={{ "--to": to } as CSSProperties} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* header                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Act I — arrival                                                     */
/* ------------------------------------------------------------------ */

export function Hero() {
  const line = whenWhere();
  return (
    <section className="ch ch--hero" data-ch="hero" data-look="hero" aria-label="The Next Order">
      <div className="hero">
        <p className="kicker hero__kicker">
          {invite.from} <span aria-hidden="true">·</span> For GCC leaders{line ? ` · ${line}` : ""}
        </p>
        <TitleSort lines={title} className="hero__title" />
        <p className="hero__line">{hook}</p>
        <ol className="hero__eras" aria-label="The story in three eras">
          {eras.map((e, i) => (
            <li key={e}>
              <span>0{i + 1}</span> {e}
            </li>
          ))}
        </ol>
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

/* ------------------------------------------------------------------ */
/* Act II — the old order                                              */
/* ------------------------------------------------------------------ */

export function OldOrder() {
  const cells = Array.from({ length: 12 * 7 }, (_, i) => i);
  const ev = oldOrder.evidence;
  return (
    <section className="ch ch--old" data-ch="old" data-look="old" aria-labelledby="old-h">
      <div className="stage">
        <Seg a={0} b={1} look="old" className="seg--old">
          <div className="grid" aria-hidden="true">
            {cells.map((i) => (
              <i
                key={i}
                style={
                  {
                    "--r": (i * 37) % 84,
                    "--fx": (((i * 53) % 21) - 10) * 4,
                    "--fr": (((i * 71) % 17) - 8) * 9,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className="old">
            <X s={0} as="p" className="kicker">
              {oldOrder.kicker}
            </X>
            <X s={1} as="h2" className="mega" id="old-h">
              {oldOrder.headline}
            </X>
            <div className="old__row">
              <X s={2} as="p" className="sub">
                {oldOrder.body}
              </X>
              <X s={3} className="evidence">
                <p className="evidence__fig">{ev.figure}</p>
                <p className="evidence__txt">{ev.finding}</p>
                <Source sig={ev} />
              </X>
            </div>
          </div>
        </Seg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Act III — the inflection point                                      */
/* ------------------------------------------------------------------ */

const SIG_A = 0.16;
const SIG_W = 0.17;

export function Inflection() {
  const n = inflection.signals.length;
  const end = SIG_A + n * SIG_W;
  return (
    <section className="ch ch--inflection" data-ch="inflection" data-look="rules" aria-labelledby="inf-h">
      <div className="stage">
        <Seg a={0} b={SIG_A} look="rules" className="seg--center">
          <X s={0} as="p" className="kicker kicker--hot">
            {inflection.kicker}
          </X>
          <X s={1} as="h2" className="mega" id="inf-h" glitch={inflection.headline}>
            {inflection.headline}
          </X>
          <X s={2} as="p" className="sub">
            {inflection.body}
          </X>
        </Seg>

        {inflection.signals.map((sig, i) => (
          <Seg
            key={sig.source}
            a={SIG_A + i * SIG_W}
            b={SIG_A + (i + 1) * SIG_W}
            look="signal"
            className="seg--signal"
            label={`Signal ${i + 1} of ${n}`}
          >
            <X s={0} as="p" className="sig__count">
              Era 02 · Signal <b>0{i + 1}</b> / 0{n}
            </X>
            <X s={0} className="sig__fig">
              <Count figure={sig.figure} />
            </X>
            <div className="sig__side">
              <X s={1} as="h3" className="sig__head">
                {sig.headline}
              </X>
              <X s={2} as="p" className="sig__txt">
                {sig.finding}
              </X>
              <X s={3}>
                <Source sig={sig} />
              </X>
            </div>
          </Seg>
        ))}

        <Seg a={end} b={1} look="closing" hold className="seg--center">
          <X s={0} as="p" className="closer">
            {inflection.closing}
          </X>
        </Seg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Act IV — the next order: three forces, equal weight                */
/* ------------------------------------------------------------------ */

const MARK = { velocity: <VelocityWordmark />, synthia: <SynthiaLogo height={34} />, select: <SelectWordmark /> };
const DEMO = { velocity: <VelocityVisual />, synthia: <SynthiaVisual />, select: <SelectVisual /> };
const F_A = 0.1;
const F_W = 0.22;

export function NextOrder() {
  const conv = F_A + forces.length * F_W;
  return (
    <section className="ch ch--next" data-ch="next" data-look="next-intro" aria-labelledby="next-h">
      <div className="stage">
        <Seg a={0} b={F_A} look="next-intro" className="seg--center">
          <X s={0} as="p" className="kicker kicker--hot">
            {nextOrder.kicker}
          </X>
          <X s={1} as="h2" className="mega" id="next-h">
            {nextOrder.headline}
          </X>
        </Seg>

        {forces.map((f, k) => (
          <Seg
            key={f.key}
            a={F_A + k * F_W}
            b={F_A + (k + 1) * F_W}
            look={f.key}
            className={`seg--force force force--${f.key}`}
          >
            <p className="force__verb" aria-hidden="true">
              {f.verb}.
            </p>
            <div className="force__body">
              <X s={0} as="p" className="kicker">
                0{k + 1} · {f.role}
              </X>
              <X s={0} className="force__mark">
                {MARK[f.key]}
              </X>
              <X s={1} as="h3" className="force__claim">
                {f.claim}
              </X>
              <X s={2} as="p" className="force__detail">
                {f.detail}
              </X>
              <X s={3} as="p" className="force__why">
                {f.why}
              </X>
              <X s={2} className="force__demo">
                {DEMO[f.key]}
              </X>
              <X s={4} className="force__link-wrap">
                <a className="force__link" href={f.href} target="_blank" rel="noopener noreferrer">
                  {f.source} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </X>
            </div>
          </Seg>
        ))}

        <Seg a={conv} b={1} look="converge" hold className="seg--converge">
          <X s={0} as="p" className="kicker kicker--hot conv__kicker">
            Three forces. One operating model.
          </X>
          <ul className="conv">
            {forces.map((f, k) => (
              <li key={f.key} className={`conv__col conv__col--${f.key}`}>
                <X s={k + 1} as="p" className="conv__verb">
                  {f.verb}.
                </X>
                <X s={k + 1.5} className="conv__mark">
                  {MARK[f.key]}
                </X>
                <X s={k + 2} as="p" className="conv__role">
                  {f.role}
                </X>
              </li>
            ))}
          </ul>
        </Seg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* the conclusion: the mark on black, then the name and the line       */
/* ------------------------------------------------------------------ */

export function Finale() {
  return (
    <section className="ch ch--finale" data-ch="finale" data-look="mark" aria-label="ViaMagus — The Next Order">
      <div className="stage">
        <Seg a={0} b={0.5} look="mark" className="seg--mark">
          <div className="mark" aria-hidden="true">
            <span className="mark__ring" />
            <svg className="mark__svg" viewBox="0 0 30.4941 11.8959">
              <path className="mark__l" d="M0,0l6.7765,11.8958l6.7764,-11.8958z" />
              <path className="mark__r" d="M23.7177,0l-3.3881,5.9479l-3.3882,-5.9479l-6.7764,11.8955h20.3291z" />
            </svg>
            <p className="mark__word">viamagus</p>
          </div>
        </Seg>
        <Seg a={0.5} b={1} look="title" hold className="seg--title">
          <X s={0} as="p" className="finale__title">
            <span className="ts-line">The Next</span>
            <span className="ts-line">Order</span>
          </X>
          <X s={2} as="p" className="finale__pos">
            {nextOrder.closing}
          </X>
        </Seg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* the invitation (practical information, kept separate)              */
/* ------------------------------------------------------------------ */

export function Invite() {
  const rows = [
    { k: "For", v: knownFacts.audience },
    { k: "When & where", v: whenWhere() },
    ...(event.format ? [{ k: "Format", v: event.format }] : []),
    ...(event.speakers.length ? [{ k: "With", v: event.speakers.map((s) => `${s.name}, ${s.role}`).join(" · ") }] : []),
    { k: "Hosted by", v: knownFacts.host },
  ];
  return (
    <section id="invite" className="ch ch--invite" data-ch="invite" data-look="invite" aria-labelledby="invite-h">
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
              {event.registrationUrl ? null : <span className="sr-only"> (opens viamagus.com in a new tab)</span>}
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
          {forces.map((f) => (
            <li key={f.key}>
              <a href={f.href} target="_blank" rel="noopener noreferrer">
                {f.name}
              </a>
            </li>
          ))}
        </ul>
        <p>© {new Date().getFullYear()} ViaMagus Technologies Pvt. Ltd.</p>
      </footer>
    </section>
  );
}

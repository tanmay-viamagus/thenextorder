import type { CSSProperties, ReactNode } from "react";
import { event, interestUrl, knownFacts, officialLinks, pending, whenWhere } from "@/content/event";
import { eras, forces, hook, inflection, invite, nextOrder, oldOrder, questions, theme, title, type Signal } from "@/content/story";
import { SelectWordmark, SynthiaLogo, VelocityWordmark, ViaMagusLogo, ViaMagusMark } from "../Brand";
import { FilmButton } from "../film/FilmOverlay";
import { TitleSort } from "../TitleSort";
import { Proof } from "../Proof";

/**
 * The site as a sequence of flat colour fields. Every field opens with a
 * hairline strip (index · era · label) and sets poster-scale type on a
 * 12-column grid. `data-ink` tells the header which ink to use over it.
 */

const TOTAL = 12;
const d = (n: number) => ({ "--d": n }) as CSSProperties;

function Strip({ n, era, label }: { n: number; era?: string; label: string }) {
  return (
    <div className="strip" data-r="" style={d(0)}>
      <span className="strip__n">
        {String(n).padStart(2, "0")} / {TOTAL}
      </span>
      <span className="strip__era">{era ?? ""}</span>
      <span className="strip__label">{label}</span>
    </div>
  );
}

function Field({
  id,
  tone,
  ink = "dark",
  className = "",
  label,
  labelledBy,
  children,
}: {
  id?: string;
  tone: string;
  ink?: "dark" | "light";
  className?: string;
  label?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`field field--${tone} ${className}`}
      data-ink={ink}
      aria-label={label}
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
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

/** "58%" counts up from 0 when it comes into view. */
function Count({ figure }: { figure: string }) {
  const m = figure.match(/^([\d,]+)(.*)$/);
  if (!m) return <>{figure}</>;
  return (
    <>
      <span className="sr-only">{figure}</span>
      <span aria-hidden="true" data-count={m[1].replace(/,/g, "")} data-suffix={m[2]} data-comma={m[1].includes(",") ? "" : undefined}>
        {figure}
      </span>
    </>
  );
}

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

/* 01 — arrival (purple) */
export function Hero() {
  const line = whenWhere();
  return (
    <Field tone="purple" ink="light" className="hero" label="The Next Order">
      <div className="hero__top">
        <p className="eyebrow">
          {invite.from} · {theme}
          {line ? ` · ${line}` : ""}
        </p>
      </div>
      <TitleSort lines={title} className="hero__title" />
      <div className="hero__base">
        <p className="hero__hook">{hook}</p>
        <ol className="hero__eras" aria-label="The story in three eras">
          {eras.map((e, i) => (
            <li key={e}>
              <span>0{i + 1}</span>
              {e}
            </li>
          ))}
        </ol>
        <div className="hero__cta">
          <FilmButton className="btn btn--light">
            <span className="btn__play" aria-hidden="true">
              <span className="play" />
            </span>
            Watch the film <span className="btn__dim">30 sec</span>
          </FilmButton>
          <a className="btn btn--line" href="#invite">
            Request an invitation
          </a>
        </div>
      </div>
    </Field>
  );
}

/* 02 — the old order (paper) */
export function OldOrder() {
  const ev = oldOrder.evidence;
  const tiers = [1, 3, 5, 7, 9, 11];
  return (
    <Field tone="paper" className="old" labelledBy="old-h">
      <Strip n={2} era="Era 01" label="The old order" />
      <h2 id="old-h" className="poster poster--ink" data-r="" style={d(1)}>
        {oldOrder.headline}
      </h2>
      <div className="grid12 old__row">
        <div className="old__copy">
          <p className="lede" data-r="" style={d(2)}>
            {oldOrder.body}
          </p>
          <div className="evidence" data-r="" style={d(3)}>
            <p className="evidence__fig">
              <Count figure={ev.figure} />
            </p>
            <p className="evidence__txt">{ev.finding}</p>
            <Source sig={ev} />
          </div>
        </div>
        {/* the shape of the old order: layers, widening as headcount grows */}
        <div className="pyramid" aria-hidden="true">
          {tiers.map((w, i) => (
            <i key={w} style={{ "--w": w, "--i": i } as CSSProperties} className={i === 0 ? "is-top" : ""} />
          ))}
        </div>
      </div>
    </Field>
  );
}

/* 03 — the inflection (magenta) */
export function Rules() {
  return (
    <Field tone="magenta" className="rules" labelledBy="rules-h">
      <Strip n={3} era="Era 02" label="The inflection point" />
      <h2 id="rules-h" className="poster poster--giant glitch" data-r="" style={d(1)}>
        {inflection.headline}
        <span className="glitch__a" aria-hidden="true">
          {inflection.headline}
        </span>
        <span className="glitch__b" aria-hidden="true">
          {inflection.headline}
        </span>
      </h2>
      <p className="lede rules__sub" data-r="" style={d(2)}>
        {inflection.body}
      </p>
    </Field>
  );
}

/* 04 — four signals (white) */
export function Signals() {
  return (
    <Field tone="white" className="signals" label="Four signals">
      <Strip n={4} era="Era 02" label="Four signals" />
      <ol className="sigs">
        {inflection.signals.map((sig, i) => (
          <li key={sig.source} className="sig" data-r="" style={d(i)}>
            <p className="sig__n">0{i + 1}</p>
            <p className="sig__fig">
              <Count figure={sig.figure} />
            </p>
            <h3 className="sig__head">{sig.headline}</h3>
            <p className="sig__txt">{sig.finding}</p>
            <Source sig={sig} />
          </li>
        ))}
      </ol>
      <p className="signals__close" data-r="" style={d(1)}>
        {inflection.closing}
      </p>
    </Field>
  );
}

/* 05 — the next order (purple) */
export function NextIntro() {
  return (
    <Field tone="purple" ink="light" className="next" labelledBy="next-h">
      <Strip n={5} era="Era 03" label="The next order" />
      <h2 id="next-h" className="poster" data-r="" style={d(1)}>
        {nextOrder.headline}
      </h2>
      <ul className="next__keys" aria-label="The three forces">
        {forces.map((f, k) => (
          <li key={f.key} className={`next__key next__key--${f.key}`} data-r="" style={d(k + 2)}>
            <span className="next__sw" aria-hidden="true" />
            <span className="next__k">
              <b>{f.verb}.</b> {f.name}
            </span>
            <span className="next__v">{nextOrder.keys[k]}</span>
          </li>
        ))}
      </ul>
    </Field>
  );
}

/* 06–08 — the three forces, one colour field each, identical structure */
const MARK = { velocity: <VelocityWordmark />, synthia: <SynthiaLogo height={34} />, select: <SelectWordmark /> };

export function Forces() {
  return (
    <>
      {forces.map((f, k) => (
        <Field key={f.key} tone={f.key} className="force" labelledBy={`force-${f.key}`}>
          <Strip n={6 + k} era={`Force 0${k + 1}`} label={`${f.role} · ${f.name}`} />
          <p className="force__verb" aria-hidden="true" data-par="">
            {f.verb}.
          </p>
          <div className="grid12 force__row">
            <div className="force__proof" data-r="" style={d(1)}>
              <Proof f={f} />
            </div>
            <div className="force__copy">
              <div className="force__mark" data-r="" style={d(2)}>
                {MARK[f.key]}
              </div>
              <h3 id={`force-${f.key}`} className="force__claim" data-r="" style={d(2)}>
                {f.claim}
              </h3>
              <p className="force__detail" data-r="" style={d(3)}>
                {f.detail}
              </p>
              <p className="force__why" data-r="" style={d(4)}>
                {f.why}
              </p>
              <a className="force__link" href={f.href} target="_blank" rel="noopener noreferrer" data-r="" style={d(5)}>
                {f.source} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </Field>
      ))}
    </>
  );
}

/* 09 — convergence: three fields side by side, one operating model */
export function Convergence() {
  return (
    <section className="conv" aria-labelledby="conv-h" data-ink="dark">
      <div className="conv__head">
        <Strip n={9} era="Era 03" label="One operating model" />
        <h2 id="conv-h" className="conv__title" data-r="" style={d(1)}>
          Three forces. One operating model.
        </h2>
      </div>
      <ul className="conv__cols">
        {forces.map((f, k) => (
          <li key={f.key} className={`conv__col field--${f.key}`} data-r="" style={d(k + 1)}>
            <p className="conv__verb">{f.verb}.</p>
            <div className="conv__mark">{MARK[f.key]}</div>
            <p className="conv__role">{f.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 10 — the questions on the table: one per leadership seat */
export function Questions() {
  return (
    <Field tone="white" className="questions" labelledBy="q-h">
      <Strip n={10} era="The conversation" label="The questions on the table" />
      <h2 id="q-h" className="poster questions__h" data-r="" style={d(1)}>
        Four seats. Four questions.
      </h2>
      <ol className="qs">
        {questions.map((q, i) => (
          <li key={q.seat} className={`q${q.force ? ` q--${q.force}` : " q--site"}`} data-r="" style={d(i + 2)}>
            <p className="q__seat">
              <span className="q__sw" aria-hidden="true" />
              {q.seat}
            </p>
            <p className="q__text">{q.q}</p>
          </li>
        ))}
      </ol>
    </Field>
  );
}

/* 11 — the conclusion: the mark on black */
export function Finale() {
  return (
    <Field tone="black" ink="light" className="finale" label="ViaMagus — The Next Order">
      <div className="finale__mark" data-r="" style={d(0)} aria-hidden="true">
        <svg viewBox="0 0 30.4941 11.8959">
          <path className="mk-l" d="M0,0l6.7765,11.8958l6.7764,-11.8958z" />
          <path className="mk-r" d="M23.7177,0l-3.3881,5.9479l-3.3882,-5.9479l-6.7764,11.8955h20.3291z" />
        </svg>
      </div>
      <p className="finale__title" data-r="" style={d(2)}>
        <span className="ts-line">The Next</span>
        <span className="ts-line">Order</span>
      </p>
      <p className="finale__pos" data-r="" style={d(3)}>
        {nextOrder.closing}
      </p>
    </Field>
  );
}

/* 12 — the invitation (purple) */
export function Invite() {
  const rows = [
    { k: "For", v: knownFacts.audience },
    { k: "When & where", v: whenWhere() },
    ...(event.format ? [{ k: "Format", v: event.format }] : []),
    ...(event.speakers.length ? [{ k: "With", v: event.speakers.map((s) => `${s.name}, ${s.role}`).join(" · ") }] : []),
    { k: "Hosted by", v: knownFacts.host },
    { k: "Featuring", v: knownFacts.featuring },
  ];
  return (
    <Field id="invite" tone="purple" ink="light" className="invite" labelledBy="invite-h">
      <Strip n={12} label="Your next move" />
      <div className="grid12 invite__row">
        <h2 id="invite-h" className="invite__h" data-r="" style={d(1)}>
          {invite.headline[0]} <em>{invite.headline[1]}</em>
        </h2>
        <div className="card" data-r="" style={d(2)}>
          <p className="card__from">
            <ViaMagusMark className="card__mark" /> {invite.from}
          </p>
          <p className="card__title">The NEXT Order</p>
          <dl className="card__rows">
            {rows.map((r) => (
              <div key={r.k}>
                <dt>{r.k}</dt>
                <dd className={r.v ? "" : "is-pending"}>{r.v ?? pending}</dd>
              </div>
            ))}
          </dl>
          <a
            className="btn btn--ink"
            href={event.registrationUrl ?? interestUrl}
            target={event.registrationUrl ? undefined : "_blank"}
            rel="noopener noreferrer"
          >
            Request an invitation <span aria-hidden="true">→</span>
            {event.registrationUrl ? null : <span className="sr-only"> (opens viamagus.com in a new tab)</span>}
          </a>
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
          <li>
            <FilmButton className="foot__film">Watch the film</FilmButton>
          </li>
        </ul>
        <p>© {new Date().getFullYear()} ViaMagus Technologies Pvt. Ltd.</p>
      </footer>
    </Field>
  );
}

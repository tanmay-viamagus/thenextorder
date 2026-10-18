import type { CSSProperties } from "react";
import { SelectWordmark, SynthiaLogo, VelocityWordmark, ViaMagusLogo, ViaMagusMark } from "@/components/Brand";
import { FilmButton } from "@/components/film/FilmOverlay";
import { event, knownFacts, officialLinks, pending } from "@/content/event";
import { convergence, invite, practices, shift } from "@/content/story";
import { Chrome, Reveal, ShiftTitle } from "./Interactive";
import { InviteForm } from "./InviteForm";
import { SelectMech, SynthiaMech, VelocityMech } from "./Mechanisms";
import { ShiftArt } from "./ShiftArt";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

const MECH = { velocity: VelocityMech, synthia: SynthiaMech, select: SelectMech };
const MARK = { velocity: VelocityWordmark, synthia: () => <SynthiaLogo height={28} />, select: SelectWordmark };

const venue = [event.venue, event.city].filter(Boolean).join(", ") || null;
const details: [string, string | null][] = [
  ["Date", event.date],
  ["Venue", venue],
  ["Format", event.format],
  ["Host", knownFacts.host],
];

/** Cells already lifted above the line in the hero field: [col, row, cols, rows]. */
const LIFTED: [number, number, number, number][] = [
  [15, 1, 2, 1],
  [18, 1, 1, 1],
  [12, 3, 1, 1],
  [3, 1, 1, 1],
  [8, 1, 1, 1],
];

const nothingYet = !event.date && !venue && !event.format;

/** Confirmed details as a title block; until there are any, one honest line instead of a table of blanks. */
function Details({ className = "" }: { className?: string }) {
  if (nothingYet)
    return (
      <p className={`status ${className}`}>
        <span className="status__k">Hosted by {knownFacts.host}</span>
        Date, venue and format to be announced. Request an invitation to hear first.
      </p>
    );
  return (
    <dl className={`tblock ${className}`} aria-label="Event details">
      {details.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd className={v ? undefined : "is-pending"}>{v ?? pending}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Site() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Chrome />
      <Reveal />

      <header className="hdr">
        <ViaMagusLogo href={officialLinks.viamagus} />
        <nav className="hdr__nav" aria-label="Sections">
          <a href="#shift" data-for="shift">
            The shift
          </a>
          <a href="#practices" data-for="practices">
            Build · Operate · Scale
          </a>
        </nav>
        <div className="hdr__end">
          <FilmButton className="hdr__film">
            <span className="tri" aria-hidden="true" /> Film
          </FilmButton>
          <a className="btn btn--shift btn--sm" href="/register">
            Register
          </a>
        </div>
      </header>

      <main id="main">
        {/* ------------------------------------------------ OPENING · attention */}
        <section id="top" className="hero" data-tone="light" data-shift-root aria-labelledby="hero-h">
          <div className="fld" aria-hidden="true">
            <div className="fld__below" />
            <div className="fld__above">
              {LIFTED.map(([c, r, w, h], i) => (
                <span key={i} className="fc" style={{ "--c": c, "--r": r, "--w": w, "--h": h } as CSSProperties} />
              ))}
            </div>
          </div>
          <p className="hero__meta">An invitation from ViaMagus</p>
          <h1 id="hero-h" className="sr-only">
            The NEXT Order — an invitation from ViaMagus for India’s GCC leaders
          </h1>
          <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} edges={["The next order ↑", "↓ The old order"]} />
          <div className="hero__foot">
            <p className="hero__line">For India’s GCC leaders.</p>
            <div className="hero__cta">
              <a className="btn btn--shift" href="/register">
                Request an invitation <span aria-hidden="true">→</span>
              </a>
              <FilmButton className="btn btn--line">
                <span className="tri" aria-hidden="true" /> The film <span className="dim">30s</span>
              </FilmButton>
            </div>
            <Details className="tblock--hero" />
          </div>
        </section>

        {/* ------------------------------------------------ THE SHIFT · curiosity → relevance */}
        <section id="shift" className="sh" data-shift-scene data-state="a" data-tone="light" data-act="shift" aria-labelledby="shift-h">
          <h2 id="shift-h" className="sr-only">
            The shift
          </h2>
          <div className="sh__stage">
            <div className="sh__copy">
              {shift.map((s, i) => (
                <div key={s.n} className={`sh__st sh__st--${"abc"[i]}`}>
                  <p className="sh__n">
                    <span>{s.n}</span> {s.era}
                  </p>
                  <h3 className="sh__h">{s.headline}</h3>
                  {s.evidence ? (
                    <p className="sh__ev">
                      <b>{s.evidence.figure}</b> {s.evidence.finding}.{" "}
                      <a href={s.evidence.url} {...ext}>
                        {s.evidence.source}, {s.evidence.date}
                        <NewTab />
                      </a>
                    </p>
                  ) : null}
                  {s.coda ? <p className="sh__coda">{s.coda}</p> : null}
                </div>
              ))}
            </div>
            <div className="sh__art">
              <ShiftArt label="A grid of identical cells — the work as it was given — cracks along a line; everything above it slides, then the cells fuse into larger volumes: product, platforms, decisions, quality, capability, efficiency, with the original grid as the foundation and one volume left open." />
            </div>
            <div className="sh__progress" aria-hidden="true">
              <span>I</span>
              <span>II</span>
              <span>III</span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ THE PRACTICES · context */}
        <section id="practices" className="eco" data-tone="dark" data-act="practices" aria-labelledby="eco-h">
          <div className="eco__hd">
            <p className="eco__k">Hosted by ViaMagus</p>
            <h2 id="eco-h" className="eco__h">
              One system for the next mandate.
            </h2>
          </div>
          <div className="pnls" data-reveal>
            <span className="pnls__line" aria-hidden="true" />
            {practices.map((p) => {
              const Mech = MECH[p.key];
              const Mark = MARK[p.key];
              return (
                <article key={p.key} className={`pnl pnl--${p.key}`} aria-labelledby={`${p.key}-h`}>
                  <p className="pnl__n">{p.n}</p>
                  <h3 id={`${p.key}-h`} className="pnl__verb">
                    {p.verb}.<span className="sr-only"> {p.name}</span>
                  </h3>
                  <div className="pnl__mark" aria-hidden="true">
                    <Mark />
                  </div>
                  <div className="pnl__mech">
                    <Mech />
                  </div>
                  <p className="pnl__line">“{p.line}”</p>
                  <a className="pnl__link" href={p.href} {...ext}>
                    {p.source} ↗<NewTab />
                  </a>
                </article>
              );
            })}
          </div>
          <div className="eco__end" data-reveal>
            <svg className="eco__lines" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true">
              <path className="cl cl--v" d="M200 0 C 200 140, 600 120, 600 250" pathLength={1} />
              <path className="cl cl--s" d="M600 0 V 250" pathLength={1} />
              <path className="cl cl--x" d="M1000 0 C 1000 140, 600 120, 600 250" pathLength={1} />
            </svg>
            <ViaMagusMark className="eco__mark" />
            <p className="eco__close">{convergence}</p>
          </div>
        </section>

        {/* ------------------------------------------------ CLOSING · action */}
        <section id="register" className="close" data-tone="light" data-act="register" data-shift-root aria-labelledby="register-h">
          <div className="close__grid">
            <div className="close__art">
              <p className="hero__meta">An invitation from ViaMagus</p>
              <h2 id="register-h" className="sr-only">
                Request an invitation to The NEXT Order
              </h2>
              <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} still />
              <p className="close__line">{invite.line}</p>
              <p className="close__who">{invite.what}</p>
              <p className="close__who close__who--b">{invite.who}</p>
              <Details />
            </div>
            <InviteForm source="site" />
          </div>
        </section>
      </main>

      <footer className="ftr" data-tone="dark">
        <ViaMagusLogo href={officialLinks.viamagus} />
        <ul>
          <li>
            <a href={officialLinks.velocity} {...ext}>
              Velocity AI<NewTab />
            </a>
          </li>
          <li>
            <a href={officialLinks.synthia} {...ext}>
              Synthia AI<NewTab />
            </a>
          </li>
          <li>
            <a href={officialLinks.select} {...ext}>
              ViaMagus Select<NewTab />
            </a>
          </li>
          <li>
            <a href="/film">The film</a>
          </li>
          <li>
            <a href="/register">Register</a>
          </li>
        </ul>
      </footer>

      <div className="bar">
        <a className="btn btn--shift" href="/register">
          Request an invitation <span aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}

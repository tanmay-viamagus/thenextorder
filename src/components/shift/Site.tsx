import { SelectWordmark, SynthiaLogo, VelocityWordmark, ViaMagusLogo } from "@/components/Brand";
import { Countdown, EraClock, HandsClock, LiveClock } from "@/components/clock/Clock";
import { FilmButton } from "@/components/film/FilmOverlay";
import { event, knownFacts, officialLinks } from "@/content/event";
import { convergence, invite, practices, shift } from "@/content/story";
import { Chrome, Reveal, ShiftTitle } from "./Interactive";
import { InviteForm } from "./InviteForm";
import { SelectMech, SynthiaMech, VelocityMech } from "./Mechanisms";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

const MECH = { velocity: VelocityMech, synthia: SynthiaMech, select: SelectMech };
const MARK = { velocity: VelocityWordmark, synthia: () => <SynthiaLogo height={28} />, select: SelectWordmark };
const HAND = { velocity: "The second hand", synthia: "The minute hand", select: "The hour hand" };

const venue = [event.venue, event.city].filter(Boolean).join(", ") || null;
const confirmed = [event.date, venue, event.format].filter(Boolean).join(" · ");

function Status() {
  return (
    <p className="status">
      <span className="status__k">Hosted by {knownFacts.host}</span>
      {confirmed || "Date, venue and format to be announced. Request an invitation to hear first."}
    </p>
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
          <a href="#eras" data-for="eras">
            The eras
          </a>
          <a href="#practices" data-for="practices">
            Three hands
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
        {/* ------------------------------------------------ OPENING · it's already running */}
        <section id="top" className="hero" data-tone="dark" data-clock-root aria-labelledby="hero-h">
          <div className="hero__l">
            <p className="hero__meta">An invitation from ViaMagus</p>
            <h1 id="hero-h" className="sr-only">
              The NEXT Order — an invitation from ViaMagus for India’s GCC leaders
            </h1>
            <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} tick />
            <p className="hero__line">For India’s GCC leaders.</p>
            <div className="hero__cta">
              <a className="btn btn--shift" href="/register">
                Request an invitation <span aria-hidden="true">→</span>
              </a>
              <FilmButton className="playlink">
                <span className="playlink__i" aria-hidden="true">
                  <span className="tri" />
                </span>
                Watch the film <span className="playlink__t">0:30</span>
              </FilmButton>
            </div>
            <p className="hero__note">{confirmed || "Date & venue to be announced"} · Hosted by {knownFacts.host}</p>
          </div>
          <div className="hero__r">
            <LiveClock />
          </div>
        </section>

        {/* ------------------------------------------------ THE ERAS · one hand, one revolution */}
        <section id="eras" className="eras" data-era-scene data-era="a" data-tone="light" data-act="eras" aria-labelledby="eras-h">
          <h2 id="eras-h" className="sr-only">
            Three eras
          </h2>
          <div className="eras__stage">
            <div className="eras__dial">
              <EraClock label="A clock face. One hand makes a full turn. From twelve to four, the old order: regular, identical ticks. From four to eight, the inflection point: the ticks crack out of line. From eight to twelve, the next order: the ticks fuse into owned arcs — product, platforms, decisions, capability — and one is left open." />
              <div className="eras__copy">
                {shift.map((s, i) => (
                  <div key={s.n} className={`eras__st eras__st--${"abc"[i]}`}>
                    <p className="eras__n">{s.era}</p>
                    <h3 className="eras__h">{s.headline}</h3>
                    {s.evidence ? (
                      <p className="eras__ev">
                        <b>{s.evidence.figure}</b> {s.evidence.finding}.{" "}
                        <a href={s.evidence.url} {...ext}>
                          {s.evidence.source}, {s.evidence.date}
                          <NewTab />
                        </a>
                      </p>
                    ) : null}
                    {s.coda ? <p className="eras__coda">{s.coda}</p> : null}
                  </div>
                ))}
              </div>
            </div>
            <p className="eras__hint" aria-hidden="true">
              Scroll to turn the hand
            </p>
          </div>
        </section>

        {/* ------------------------------------------------ THREE HANDS, ONE CLOCK */}
        <section id="practices" className="eco" data-tone="dark" data-act="practices" aria-labelledby="eco-h">
          <div className="eco__top">
            <div className="eco__hd" data-reveal>
              <p className="eco__k">Hosted by ViaMagus</p>
              <h2 id="eco-h" className="eco__h">
                Three hands.
                <br />
                One clock.
              </h2>
              <p className="eco__lede">
                <span className="k-v">Velocity AI</span> keeps the seconds. <span className="k-s">Synthia AI</span> keeps the minutes.{" "}
                <span className="k-x">ViaMagus Select</span> keeps the hours.
              </p>
            </div>
            <HandsClock label="A live clock in India time. Its second hand is Velocity AI, its minute hand Synthia AI and its hour hand ViaMagus Select, all pinned on the ViaMagus mark." />
          </div>
          <div className="pnls" data-reveal>
            {practices.map((p) => {
              const Mech = MECH[p.key];
              const Mark = MARK[p.key];
              return (
                <article key={p.key} className={`pnl pnl--${p.key}`} data-practice={p.key} aria-labelledby={`${p.key}-h`}>
                  <p className="pnl__n">{HAND[p.key]}</p>
                  <h3 id={`${p.key}-h`} className="pnl__verb">
                    {p.verb}.<span className="sr-only"> {p.name}</span>
                  </h3>
                  <div className="pnl__mark" aria-hidden="true">
                    <Mark />
                  </div>
                  <p className="pnl__for">{p.for}</p>
                  <div className="pnl__mech">
                    <Mech />
                  </div>
                  <p className="pnl__line">“{p.line}”</p>
                  <div className="pnl__acts">
                    <a className="pnl__go" href={`/register?interest=${p.key}`}>
                      Explore it at the event <span aria-hidden="true">→</span>
                    </a>
                    <a className="pnl__link" href={p.href} {...ext}>
                      {p.source} ↗<NewTab />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="eco__close" data-reveal>
            {convergence}
          </p>
        </section>

        {/* ------------------------------------------------ CLOSING · the next hour */}
        <section id="register" className="close" data-tone="light" data-act="register" aria-labelledby="register-h">
          <div className="close__grid">
            <div className="close__copy">
              <p className="close__k">The NEXT Order begins in</p>
              <Countdown startsAt={event.startsAt} />
              <h2 id="register-h" className="close__h">
                Be in the room when it starts.
              </h2>
              <p className="close__who">{invite.what}</p>
              <p className="close__who close__who--b">{invite.who}</p>
              <Status />
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

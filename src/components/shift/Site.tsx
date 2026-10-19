import { SelectWordmark, SynthiaLogo, VelocityWordmark, ViaMagusLogo } from "@/components/Brand";
import { HandsClock } from "@/components/clock/Clock";
import { FilmButton } from "@/components/film/FilmOverlay";
import { event, knownFacts, officialLinks } from "@/content/event";
import { convergence, cta, invite, practices } from "@/content/story";
import { FILM_DURATION } from "@/content/film";
import { Chrome, Reveal, ShiftTitle } from "./Interactive";
import { InviteForm } from "./InviteForm";
import { GccEvolution } from "./GccEvolution";
import { NameBoard } from "./NameBoard";
import { Showcase } from "./Showcase";
import { SelectMech, SynthiaMech, VelocityMech } from "./Mechanisms";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

const MECH = { velocity: VelocityMech, synthia: SynthiaMech, select: SelectMech };
const MARK = { velocity: VelocityWordmark, synthia: () => <SynthiaLogo height={28} />, select: SelectWordmark };
const HAND = { velocity: "The second hand", synthia: "The minute hand", select: "The hour hand" };

const filmLength = `${Math.floor(FILM_DURATION / 60)}:${String(FILM_DURATION % 60).padStart(2, "0")}`;
const venue = [event.venue, event.city].filter(Boolean).join(", ") || null;
const confirmed = [event.date, venue, event.format].filter(Boolean).join(" · ");


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
          <a href="#name" data-for="name">
            GCC → ?
          </a>
          <a href="#evolve" data-for="evolve">
            How a GCC evolves
          </a>
          <a href="#practices" data-for="practices">
            The practices
          </a>
        </nav>
        <div className="hdr__end">
          <a className="btn btn--shift btn--sm hdr__cta" href="/register">
            {cta.primary} <span className="btn__arr" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <main id="main">
        {/* ------------------------------------------------ OPENING · it's already running */}
        <section id="top" className="hero" data-tone="dark" data-shift-root aria-labelledby="hero-h">
          <div className="hero__l">
            <p className="hero__meta">An invitation from ViaMagus</p>
            <h1 id="hero-h" className="sr-only">
              The NEXT Order — an invitation from ViaMagus for India’s GCC leaders
            </h1>
            <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} />
            <p className="hero__line">For the leaders shaping what India’s GCCs become next.</p>
            <div className="hero__cta">
              <a className="btn btn--shift btn--lg" href="/register">
                {cta.primary} <span className="btn__arr" aria-hidden="true">→</span>
              </a>
            </div>
            <p className="hero__note">{confirmed || "Date & venue to be announced"} · Hosted by {knownFacts.host}</p>
          </div>
        </section>

        {/* ------------------------------------------------ THE NAME · GCC → GIC → ? (split-flap, pinned) */}
        <NameBoard />

        {/* ------------------------------------------------ HOW A GCC EVOLVES · five stages (pinned)
            The ring of years (YearCycle) is kept in components/clock for later use. */}
        <GccEvolution />

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
                    <a className="pnl__go" href={p.href} {...ext}>
                      <span>{p.go}</span>
                      <span className="pnl__goarr" aria-hidden="true">
                        ↗
                      </span>
                      <span className="sr-only"> — {p.name} (opens in a new tab)</span>
                    </a>
                    <a className="pnl__room" href={`/register?interest=${p.key}`}>
                      <span>{p.room}</span>
                      <span className="pnl__arr" aria-hidden="true">
                        →
                      </span>
                    </a>
                    <p className="pnl__src">{p.source}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="eco__close" data-reveal>
            {convergence}
          </p>
        </section>

        {/* ------------------------------------------------ THE FILM · near the end */}
        <section id="film" className="fl" data-tone="dark" aria-labelledby="fl-h">
          <div className="fl__head">
            <div>
              <p className="fl__k">The film · {filmLength}</p>
              <h2 id="fl-h" className="fl__h">
                See what’s changing.
              </h2>
            </div>
            <div className="fl__side">
              <p className="fl__txt">The old order, the shift, and three practices that become one ViaMagus. No sound needed.</p>
              <FilmButton className="fl__btn">
                <span className="fl__btnplay" aria-hidden="true">
                  <span className="tri" />
                </span>
                Play the film
              </FilmButton>
            </div>
          </div>
          <div className="fl__show">
            <Showcase />
          </div>
        </section>

        {/* ------------------------------------------------ CLOSING · the next hour */}
        <section id="request" className="close" data-tone="light" data-act="register" aria-labelledby="register-h">
          <div className="close__grid">
            <div className="close__copy">
              <p className="close__k">The NEXT Order</p>
              <h2 id="register-h" className="close__h">
                Find your place in the conversation.
              </h2>
              <p className="close__who">{invite.what}</p>
              <p className="close__who close__who--b">{invite.who}</p>
              <ol className="steps">
                <li>
                  <b>01</b>
                  <span>
                    <strong>Request your place</strong> — about 30 seconds, mostly taps.
                  </span>
                </li>
                <li>
                  <b>02</b>
                  <span>
                    <strong>The ViaMagus team reviews every request</strong>, including the LinkedIn profile you share.
                  </span>
                </li>
                <li>
                  <b>03</b>
                  <span>
                    <strong>Invitations go out</strong> with the date, venue and format once they’re confirmed.
                  </span>
                </li>
              </ol>
              <p className="close__note">
                {confirmed || "Date, venue and format to be announced"} · Hosted by {knownFacts.host}
              </p>
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
            <a href="/register">{cta.primary}</a>
          </li>
        </ul>
      </footer>

      <div className="bar">
        <a className="btn btn--shift" href="/register">
          {cta.primary} <span className="btn__arr" aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}

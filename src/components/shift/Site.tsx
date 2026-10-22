import { Fragment } from "react";
import {
  SelectWordmark,
  SynthiaLogo,
  VelocityWordmark,
  ViaMagusLogo,
} from "@/components/Brand";
import { HandsClock } from "@/components/clock/Clock";
import { FilmButton } from "@/components/film/FilmOverlay";
import { contactEmail, event, knownFacts, officialLinks, statusLine } from "@/content/event";
import {
  convergence,
  cta,
  invite,
  positioning,
  practices,
} from "@/content/story";
import { FILM_DURATION } from "@/content/film";
import { Chrome, Reveal, ShiftTitle } from "./Interactive";
import { InviteForm } from "./InviteForm";
import { GccEvolution } from "./GccEvolution";
import { Theme } from "./Theme";
import { Evening } from "./Evening";
import { SelectMech, SynthiaMech, VelocityMech } from "./Mechanisms";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

const MECH = {
  velocity: VelocityMech,
  synthia: SynthiaMech,
  select: SelectMech,
};
const MARK = {
  velocity: VelocityWordmark,
  synthia: () => <SynthiaLogo height={28} />,
  select: SelectWordmark,
};
const HAND = {
  velocity: "The second hand",
  synthia: "The minute hand",
  select: "The hour hand",
};

const filmLength = `${Math.floor(FILM_DURATION / 60)}:${String(FILM_DURATION % 60).padStart(2, "0")}`;

/** The date, time and place, broken only between the parts. */
function Facts({ extra }: { extra?: string | null }) {
  const parts = [...statusLine().split(" · "), ...(extra ? [extra] : [])];
  return parts.map((part, k) => (
    <Fragment key={part}>
      {k ? " · " : ""}
      <span className="hero__metap">{part}</span>
    </Fragment>
  ));
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
          <a href="#theme" data-for="theme">
            Why this event
          </a>
          <a href="#evening" data-for="evening">
            The evening
          </a>
          <a href="#evolve" data-for="evolve">
            How a GCC evolves
          </a>
          <a href="#practices" data-for="practices">
            The hosts
          </a>
        </nav>
        <div className="hdr__end">
          <a className="btn btn--shift btn--sm hdr__cta" href="/register">
            {cta.primary}{" "}
            <span className="btn__arr" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </header>

      <main id="main">
        {/* ------------------------------------------------ OPENING · it's already running */}
        <section
          id="top"
          className="hero"
          data-tone="dark"
          data-shift-root
          aria-labelledby="hero-h"
        >
          <div className="hero__l">
            <p className="hero__meta">
              <Facts />
            </p>
            <h1 id="hero-h" className="sr-only">
              The NEXT Order — an invitation from ViaMagus for Hyderabad’s GCC
              leaders
            </h1>
            <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} />
            <p className="hero__line">
              An invite-only evening for Hyderabad’s GCC leaders on how AI is
              reshaping the way GCCs hire, build and lead.
            </p>
            <div className="hero__cta">
              <a className="btn btn--shift btn--lg" href="/register">
                {cta.primary}{" "}
                <span className="btn__arr" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
            <p className="hero__note">
              By invitation · Organised by {knownFacts.host} with{" "}
              {knownFacts.partner}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------ WHY THIS EVENT · the theme */}
        <Theme />

        {/* ------------------------------------------------ THE EVENING · what happens, and who is behind it */}
        <Evening />


        {/* ------------------------------------------------ HOW A GCC EVOLVES · five stages (pinned)
            The ring of years (YearCycle) is kept in components/clock for later use. */}
        <GccEvolution />

        {/* ------------------------------------------------ THREE HANDS, ONE CLOCK */}
        <section
          id="practices"
          className="eco"
          data-tone="dark"
          data-act="practices"
          aria-labelledby="eco-h"
        >
          <div className="eco__top">
            <div className="eco__hd" data-reveal>
              <p className="eco__k">
                <span className="chap">04</span>Hosted by ViaMagus
              </p>
              <h2 id="eco-h" className="eco__h">
                Three hands.
                <br />
                One clock.
              </h2>
              <p className="eco__lede">
                <span className="k-v">Velocity AI</span> keeps the seconds.{" "}
                <span className="k-s">Synthia AI</span> keeps the minutes.{" "}
                <span className="k-x">ViaMagus Select</span> keeps the hours.
              </p>
              <p className="eco__hands">{positioning.lede}</p>
            </div>
            <HandsClock label="A live clock in India time. Its second hand is Velocity AI, its minute hand Synthia AI and its hour hand ViaMagus Select, all pinned on the ViaMagus mark." />
          </div>
          <div className="pnls" data-reveal>
            {practices.map((p) => {
              const Mech = MECH[p.key];
              const Mark = MARK[p.key];
              return (
                <article
                  key={p.key}
                  className={`pnl pnl--${p.key}`}
                  data-practice={p.key}
                  aria-labelledby={`${p.key}-h`}
                >
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
                      <span className="sr-only">
                        {" "}
                        — {p.name} (opens in a new tab)
                      </span>
                    </a>
                    <a
                      className="pnl__room"
                      href={`/register?interest=${p.key}`}
                    >
                      <span>{p.room}</span>
                      <span className="pnl__arr" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
          {/* two more ways in — the same grid, the same language as the panels */}
          <div className="more" data-reveal>
            <article className="more__c more__c--bot" aria-labelledby="bot-h">
              <p className="pnl__n">{positioning.bot.k}</p>
              <h3 id="bot-h" className="more__t">
                {positioning.bot.title}
              </h3>
              <ol className="more__steps">
                {positioning.bot.steps.map((st) => (
                  <li key={st.k}>
                    <span className="more__when">{st.when}</span>
                    <b>{st.word}</b>
                    <span>{st.d}</span>
                  </li>
                ))}
              </ol>
              <a className="pnl__room" href="/register?interest=bot">
                <span>Ask about Build-Operate-Transfer</span>
                <span className="pnl__arr" aria-hidden="true">
                  →
                </span>
              </a>
            </article>
            <article className="more__c more__c--prog" aria-labelledby="prog-h">
              <p className="pnl__n">{positioning.programme.k}</p>
              <h3 id="prog-h" className="more__t">
                {positioning.programme.title}.
              </h3>
              <p className="more__l">{positioning.programme.line}</p>
              <a className="pnl__room" href="/register?interest=programme">
                <span>Ask about AI training</span>
                <span className="pnl__arr" aria-hidden="true">
                  →
                </span>
              </a>
            </article>
          </div>
          <p className="eco__close" data-reveal>
            {convergence}
          </p>
        </section>

        {/* ------------------------------------------------ THE FILM · near the end */}
        <section
          id="film"
          className="fl"
          data-tone="dark"
          aria-labelledby="fl-h"
        >
          <div className="fl__head">
            <div>
              <p className="fl__k">
                The film · {filmLength}
              </p>
              <h2 id="fl-h" className="fl__h">
                See what’s changing.
              </h2>
            </div>
            <div className="fl__side">
              <p className="fl__txt">
                The old order, the shift, and three practices that become one
                ViaMagus. No sound needed.
              </p>
              <FilmButton className="fl__btn">
                <span className="fl__btnplay" aria-hidden="true">
                  <span className="tri" />
                </span>
                Play the film
              </FilmButton>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ CLOSING · your place */}
        <section
          id="request"
          className="close"
          data-tone="light"
          data-act="register"
          aria-labelledby="register-h"
        >
          <div className="close__grid">
            <div className="close__copy">
              <p className="close__k">
                <span className="chap">05</span>Your place
              </p>
              <h2 id="register-h" className="close__h">
                Find your place in the conversation.
              </h2>
              <p className="close__when">
                <Facts extra={event.format} />
              </p>
              <p className="close__who">{invite.who}</p>
              <ol className="steps">
                <li>
                  <b>01</b>
                  <span>
                    <strong>Request your place</strong> — about 30 seconds,
                    mostly taps.
                  </span>
                </li>
                <li>
                  <b>02</b>
                  <span>
                    <strong>The ViaMagus team reviews every request</strong>,
                    including the LinkedIn profile you share.
                  </span>
                </li>
                <li>
                  <b>03</b>
                  <span>
                    <strong>Invitations go out</strong> to confirmed guests, with
                    everything you need for 3 December at T-Hub.
                  </span>
                </li>
              </ol>
            </div>
            <InviteForm source="site" />
          </div>
        </section>
      </main>

      <footer className="ftr" data-tone="dark">
        <ViaMagusLogo href={officialLinks.viamagus} />
        <div className="ftr__event">
          <p className="ftr__name">The NEXT Order</p>
          <p className="ftr__partner">
            {statusLine()} · {event.format}
          </p>
          <p className="ftr__partner">
            Organised by <b>{knownFacts.host}</b> · Ecosystem partner{" "}
            <b>{knownFacts.partner}</b> ·{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </div>
        <ul>
          <li>
            <a href={officialLinks.velocity} {...ext}>
              Velocity AI
              <NewTab />
            </a>
          </li>
          <li>
            <a href={officialLinks.synthia} {...ext}>
              Synthia AI
              <NewTab />
            </a>
          </li>
          <li>
            <a href={officialLinks.select} {...ext}>
              ViaMagus Select
              <NewTab />
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
          {cta.primary}{" "}
          <span className="btn__arr" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </>
  );
}

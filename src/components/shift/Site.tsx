import { Fragment } from "react";
import { MavericksLogo, ViaMagusLogo } from "@/components/Brand";
import { contactEmail, event, knownFacts, officialLinks, statusLine } from "@/content/event";
import { cta, invite } from "@/content/story";
import { Chrome, Reveal, ShiftTitle } from "./Interactive";
import { InviteForm } from "./InviteForm";
import { GccEvolution } from "./GccEvolution";
import { Theme } from "./Theme";
import { Evening } from "./Evening";
import { Handoff, StoryNav, StoryStrip } from "./Story";

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
        <StoryNav />
        <div className="hdr__end">
          <a className="btn btn--shift btn--sm hdr__cta" href="/register">
            {cta.primary}{" "}
            <span className="btn__arr" aria-hidden="true">
              →
            </span>
          </a>
        </div>
        <StoryStrip />
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
              The NEXT Order — an invitation from Viamagus for Hyderabad’s GCC
              leaders
            </h1>
            <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} />
            <p className="hero__line">
              The next order of talent, technology and leadership.
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
              An invite-only symposium for Hyderabad’s GCC leaders and
              decision-makers
            </p>
            <p className="hero__partner">
              <span>In collaboration with</span>
              <MavericksLogo className="hero__mav" height={22} />
            </p>
          </div>
        </section>



        {/* ------------------------------------------------ HOW GCCS ARE EVOLVING · four stages (pinned)
            The ring of years (YearCycle) is kept in components/clock for later use. */}
        <GccEvolution />
        <div className="handoff-band" data-tone="light">
          <Handoff to="evening">The next order is being written now. Where will your centre be?</Handoff>
        </div>


        {/* ------------------------------------------------ THE EVENING · what happens, and who is behind it */}
        <Evening />

        {/* ------------------------------------------------ WHY ATTEND · why the next order fits */}
        <Theme />

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
                <span className="chap">04</span>Your place
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
                    <strong>The Viamagus team reviews every request</strong>,
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
            Organised by <b>{knownFacts.host}</b> ·{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
          <p className="ftr__partner ftr__mav">
            <span>Ecosystem partner</span>
            <MavericksLogo className="ftr__mavlogo" height={20} />
          </p>
        </div>
        <ul>
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

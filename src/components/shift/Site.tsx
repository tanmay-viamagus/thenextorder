import { Fragment } from "react";
import { LinkedInMark, MavericksLogo, ViaMagusLogo } from "@/components/Brand";
import {
  contactEmail,
  event,
  knownFacts,
  officialLinks,
  statusLine,
} from "@/content/event";
import { cta, invite } from "@/content/story";
import { Chrome, Reveal } from "./Interactive";
import { InviteForm } from "./InviteForm";
import { Icon } from "./Icons";
import { GccEvolution } from "./GccEvolution";
import { Theme } from "./Theme";
import { Evening } from "./Evening";
import { HeroV2 } from "./HeroV2";
import { ChapterLabel, StoryNav, StoryStrip } from "./Story";

/** The date, time and place, broken only between the parts. */
function Facts({ extra }: { extra?: string | null }) {
  const parts = [...statusLine().split(" · "), ...(extra ? [extra] : [])];
  return parts.map((part, k) => (
    <Fragment key={part}>
      {k ? " · " : ""}
      <span className="facts__p">{part}</span>
    </Fragment>
  ));
}

/**
 * One page per part of the story: the opening, how GCCs are evolving (one
 * swipe a stage), the symposium, why attend — each one screen, one swipe —
 * and the form, which runs as long as it needs to.
 */
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
        {/* ------------------------------------------------ OPENING · one page */}
        <HeroV2 />

        {/* ------------------------------------------------ HOW GCCS ARE EVOLVING · four stages (pinned)
            The ring of years (YearCycle) is kept in components/clock for later use. */}
        <GccEvolution />

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
                <ChapterLabel id="request" />
              </p>
              <h2 id="register-h" className="close__h">
                Find your place <span>in the conversation.</span>
              </h2>
              <p className="close__when">
                <Facts extra={event.format} />
              </p>
              <p className="close__who">{invite.who}</p>
              <ol className="steps">
                <li>
                  <b className="steps__tile">
                    <Icon name="pen" />
                    <span className="sr-only">Step 1</span>
                  </b>
                  <span>
                    <strong>Request your place</strong> — about 30 seconds,
                    mostly taps.
                  </span>
                </li>
                <li>
                  <b className="steps__tile">
                    <Icon name="eye" />
                    <span className="sr-only">Step 2</span>
                  </b>
                  <span>
                    <strong>The Viamagus team reviews every request</strong>,
                    including the LinkedIn profile you share.
                  </span>
                </li>
                <li>
                  <b className="steps__tile">
                    <Icon name="mail" />
                    <span className="sr-only">Step 3</span>
                  </b>
                  <span>
                    <strong>Invitations go out</strong> to confirmed guests,
                    with everything you need for 3 December at T-Hub.
                  </span>
                </li>
              </ol>
            </div>
            <InviteForm source="site" />
          </div>
        </section>
      </main>

      <footer className="ftr" data-tone="dark">
        {/* the doorway's light, at the edge of the page */}
        <div className="ftr__light" aria-hidden="true">
          <span className="ftr__wall" />
          <span className="ftr__floor" />
          <span className="ftr__door" />
        </div>
        <div className="ftr__top">
          <div className="ftr__brand">
            <ViaMagusLogo href={officialLinks.viamagus} />
            <p className="ftr__tag">
              People <span aria-hidden="true">×</span> Technology <span aria-hidden="true">×</span> Possibilities
            </p>
          </div>
          <div className="ftr__event">
            <p className="ftr__name">The NEXT Order</p>
            <div className="ftr__facts">
              <p className="ftr__fact">
                <Icon name="calendar" />
                <span>
                  <b>{event.date}</b>
                  <span>{event.time}</span>
                </span>
              </p>
              <p className="ftr__fact">
                <Icon name="pin" />
                <span>
                  <b>{[event.venue, event.city].filter(Boolean).join(", ")}</b>
                  <span className="ftr__mono">{event.format}</span>
                </span>
              </p>
            </div>
            <div className="ftr__by">
              <p>
                Organised by <b>{knownFacts.host}</b>
              </p>
              <p>
                Ecosystem partner <MavericksLogo className="ftr__mavlogo" height={22} />
              </p>
            </div>
          </div>
          <nav className="ftr__nav" aria-label="Footer">
            <a className="ftr__go" href="/film">
              The film <span aria-hidden="true">→</span>
            </a>
            <a className="ftr__go" href="/register">
              {cta.primary} <span aria-hidden="true">→</span>
            </a>
            <a className="ftr__in" href={officialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInMark />
              <span className="sr-only">Viamagus on LinkedIn (opens in a new tab)</span>
            </a>
          </nav>
        </div>
        <div className="ftr__base">
          <p>© 2026 Viamagus. All rights reserved.</p>
          <ul>
            <li>
              <a href={officialLinks.privacy}>Privacy</a>
            </li>
            <li>
              <a href={`mailto:${contactEmail}`}>Contact</a>
            </li>
          </ul>
        </div>
      </footer>

    </>
  );
}

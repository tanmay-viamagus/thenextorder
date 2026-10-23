import { MavericksLogo } from "@/components/Brand";
import { FilmButton } from "@/components/film/FilmOverlay";
import { event } from "@/content/event";
import { cta } from "@/content/story";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icons";

/**
 * The opening — a light room: soft lilac light and glass at the sides,
 * "Viamagus presents", the title (THE NEXT in ink, ORDER in purple) running
 * on into "of talent, technology and leadership.", one line on who it's for,
 * two calls to action, and the facts with their icons at the foot.
 */
const FACTS: { k: string; icon: IconName; v: ReactNode }[] = [
  { k: "Date", icon: "calendar", v: event.date },
  { k: "Time", icon: "clock", v: event.time },
  { k: "Venue", icon: "pin", v: [event.venue, event.city].filter(Boolean).join(", ") },
  { k: "In collaboration with", icon: "users", v: <MavericksLogo className="hero2__mav" height={24} tone="ink" /> },
];

/** glass panels and light at the sides of the room */
function Glass() {
  return (
    <div className="hero2__glass" aria-hidden="true">
      <span className="hero2__pane hero2__pane--l1" />
      <span className="hero2__pane hero2__pane--l2" />
      <span className="hero2__pane hero2__pane--r1" />
      <span className="hero2__pane hero2__pane--r2" />
      <span className="hero2__beam hero2__beam--l" />
      <span className="hero2__beam hero2__beam--r" />
    </div>
  );
}

export function HeroV2() {
  return (
    <section id="top" className="hero2" data-tone="light" aria-labelledby="hero-h">
      <Glass />
      <div className="hero2__in">
        <p className="hero2__presents">Viamagus presents</p>
        <h1 id="hero-h" className="sr-only">
          The Next Order: talent, technology and leadership — an invite-only symposium from Viamagus for Hyderabad’s
          GCC leaders and decision-makers
        </h1>
        {/* one title: THE NEXT ORDER / talent, technology and leadership. */}
        <p className="hero2__t" aria-hidden="true">
          <span>THE NEXT</span>
          <span className="hero2__order">ORDER</span>
        </p>
        <div className="hero2__text">
          <p className="hero2__line" aria-hidden="true">
            <span className="hero2__ttl">talent, technology and leadership.</span>
          </p>
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
      {/* the facts, as labelled cells — when, what time, where, and with whom */}
      <dl className="hero2__facts">
        {FACTS.map((f) => (
          <div key={f.k}>
            <dt>
              <span className="hero2__ftile">
                <Icon name={f.icon} />
              </span>
              {f.k}
            </dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

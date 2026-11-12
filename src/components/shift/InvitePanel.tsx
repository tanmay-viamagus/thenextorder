import { MavericksLogo, ViaMagusLogo } from "@/components/Brand";
import { Icon } from "@/components/shift/Icons";
import { OrgStrip } from "@/components/shift/Showcase";
import { event, knownFacts, siteAddress } from "@/content/event";
import { directionsUrl, rsvpCopy } from "@/content/rsvp";
import { keep } from "@/lib/text";

/**
 * The invitation, as the left half of /rsvp and /register: the event, the
 * organisations on stage, then its details the way a calendar invite lists
 * them. On phones it stacks above the page's form, with a jump down to it.
 */
export function InvitePanel({
  titleAs: Title = "p",
  jump,
}: {
  /** "h1" where the panel names the page; "p" where the page has its own heading */
  titleAs?: "h1" | "p";
  /** the phone's jump down to the form */
  jump: { href: string; label: string };
}) {
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  return (
    <section className="rsvp__invite" aria-labelledby="invite-t">
      <div className="rsvp__top">
        <ViaMagusLogo />
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full load of the microsite, from its top */}
        <a className="rsvp__site" href="/">
          The site <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="rsvp__id">
        <p className="rsvp__k">{rsvpCopy.kicker}</p>
        <Title id="invite-t" className="rsvp__t">
          <span>The NEXT</span> <span>Order.</span>
        </Title>
        <p className="rsvp__sum">{keep(rsvpCopy.summary)}</p>
      </div>
      <OrgStrip />

      <ul className="rsvp__facts">
        <li>
          <span className="rsvp__tile">
            <Icon name="calendar" />
          </span>
          <span>
            <span className="rsvp__label">When</span>
            <b>{event.date}</b>
            <span className="rsvp__more">{event.time}</span>
          </span>
        </li>
        <li>
          <span className="rsvp__tile">
            <Icon name="pin" />
          </span>
          <span>
            <span className="rsvp__label">Where</span>
            <b>{keep(place)}</b>
            <a className="rsvp__more rsvp__link" href={directionsUrl} target="_blank" rel="noopener noreferrer">
              Directions<span className="sr-only"> to {place} (opens in a new tab)</span> <span aria-hidden="true">↗</span>
            </a>
          </span>
        </li>
        <li>
          <span className="rsvp__tile">
            <Icon name="users" />
          </span>
          <span>
            <span className="rsvp__label">{event.format ?? "Hosted by"}</span>
            <b>Organised by {knownFacts.host}</b>
            <span className="rsvp__more rsvp__with">
              In collaboration with <MavericksLogo className="rsvp__mav" height={18} />
            </span>
          </span>
        </li>
        <li>
          <span className="rsvp__tile">
            <Icon name="sparkle" />
          </span>
          <span>
            <span className="rsvp__label">The evening</span>
            <b>{rsvpCopy.site}</b>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full load of the microsite, from its top */}
            <a className="rsvp__more rsvp__link" href="/">
              {siteAddress.replace(/^https:\/\//, "")} <span aria-hidden="true">→</span>
            </a>
          </span>
        </li>
      </ul>

      <a className="rsvp__jump" href={jump.href}>
        {jump.label} <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}

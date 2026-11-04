import type { Metadata } from "next";
import { MavericksLogo, ViaMagusLogo } from "@/components/Brand";
import { Icon } from "@/components/shift/Icons";
import { RsvpForm } from "@/components/shift/RsvpForm";
import { event, knownFacts, siteAddress } from "@/content/event";
import { directionsUrl, rsvpCopy } from "@/content/rsvp";
import { shareImage } from "@/content/story";
import { isReply } from "@/lib/rsvp";
import { keep } from "@/lib/text";

const title = "RSVP | The NEXT Order — 3 December 2026, T-Hub Hyderabad";
const description =
  "Your invitation to The NEXT Order, a Viamagus symposium for Hyderabad’s GCC leaders: Thursday 3 December 2026, from 3:30 PM IST, at T-Hub. Reply yes, tentative or no.";

// the link goes to invitees only: shared and previewed, never indexed
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/rsvp" },
  robots: { index: false, follow: true },
  openGraph: { title, description, url: "/rsvp", images: [shareImage] },
  twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * /rsvp — the invitation and the reply. Each list gets its own link
 * (/rsvp?ref=guest-list, /rsvp?ref=invitee-list; see content/rsvp.ts), and
 * an email can carry the reply in it (/rsvp?reply=yes|tentative|no).
 */
export default async function Rsvp({ searchParams }: { searchParams: Promise<{ ref?: string | string[]; reply?: string | string[] }> }) {
  const q = await searchParams;
  const asked = one(q.reply).toLowerCase();
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  return (
    <main className="rsvp">
      <section className="rsvp__invite" aria-labelledby="rsvp-t">
        <div className="rsvp__top">
          <ViaMagusLogo />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full load of the microsite, from its top */}
          <a className="rsvp__site" href="/">
            The site <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="rsvp__id">
          <p className="rsvp__k">{rsvpCopy.kicker}</p>
          <h1 id="rsvp-t" className="rsvp__t">
            <span>The NEXT</span> <span>Order.</span>
          </h1>
          <p className="rsvp__sum">{keep(rsvpCopy.summary)}</p>
        </div>

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

        <a className="rsvp__jump" href="#reply">
          Reply <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section id="reply" className="rsvp__reply" aria-labelledby="rsvp-h">
        <div className="rsvp__inner">
          <p className="rsvp__k2">RSVP</p>
          <h2 id="rsvp-h" className="rsvp__h">
            {rsvpCopy.ask}
          </h2>
          <p className="rsvp__lede">{rsvpCopy.askLine}</p>
          <RsvpForm refKey={one(q.ref)} preset={isReply(asked) ? asked : undefined} />
        </div>
      </section>
    </main>
  );
}

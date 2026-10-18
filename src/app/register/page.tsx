import type { Metadata } from "next";
import Link from "next/link";
import { ViaMagusLogo } from "@/components/Brand";
import { ShiftTitle } from "@/components/shift/Interactive";
import { InviteForm } from "@/components/shift/InviteForm";
import { event, knownFacts, pending } from "@/content/event";
import { invite, tagline } from "@/content/story";

const title = "Register | The NEXT Order — ViaMagus";
const description = "Request your invitation to The NEXT Order — a ViaMagus event for India’s GCC leaders on where global centres go next.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/register" },
  openGraph: { title, description, url: "/register" },
  twitter: { title, description },
};

const details: [string, string | null][] = [
  ["Date", event.date],
  ["City & venue", [event.venue, event.city].filter(Boolean).join(", ") || null],
  ["Format", event.format],
  ["Host", knownFacts.host],
];

export default function Register() {
  return (
    <div className="reg">
      <header className="reg__hdr">
        <ViaMagusLogo />
        <Link className="reg__back" href="/">
          ← The NEXT Order
        </Link>
      </header>
      <main className="reg__main">
        <section className="reg__copy" aria-labelledby="reg-h">
          <p className="sheet">
            <span>Sheet 04</span>
            <span>Your next move</span>
            <span className="sheet__l">Register</span>
          </p>
          <h1 id="reg-h" className="sr-only">
            Register for The NEXT Order
          </h1>
          <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} />
          <p className="reg__q">{tagline}</p>
          <p className="lede">{invite.what}</p>
          {details.some(([k, v]) => k !== "Host" && v) ? (
            <dl className="tblock tblock--attend" aria-label="Event details">
              {details.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd className={v ? undefined : "is-pending"}>{v ?? pending}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="status">
              <span className="status__k">Hosted by {knownFacts.host}</span>
              Date, venue and format to be announced. Request an invitation to hear first.
            </p>
          )}
        </section>
        <InviteForm source="register" />
      </main>
    </div>
  );
}

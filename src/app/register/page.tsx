import type { Metadata } from "next";
import Link from "next/link";
import { ViaMagusLogo } from "@/components/Brand";
import { Countdown } from "@/components/clock/Clock";
import { InviteForm } from "@/components/shift/InviteForm";
import { Showcase } from "@/components/shift/Showcase";
import { event, knownFacts } from "@/content/event";
import { INTEREST_BY_KEY } from "@/content/register";

const title = "Register | The NEXT Order — ViaMagus";
const description = "Request your invitation to The NEXT Order — a ViaMagus event for India’s GCC leaders on where global centres go next.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/register" },
  openGraph: { title, description, url: "/register" },
  twitter: { title, description },
};

const venue = [event.venue, event.city].filter(Boolean).join(", ");
const confirmed = [event.date, venue, event.format].filter(Boolean).join(" · ");

export default async function Register({ searchParams }: { searchParams: Promise<{ interest?: string }> }) {
  const { interest } = await searchParams;
  const preset = interest ? INTEREST_BY_KEY[interest] : undefined;
  return (
    <div className="reg">
      <aside className="reg__show" aria-label="The NEXT Order">
        <div className="reg__top">
          <ViaMagusLogo />
          <Link className="reg__back" href="/">
            ← The site
          </Link>
        </div>
        <div className="reg__id">
          <p className="reg__k">An invitation for India’s GCC leaders</p>
          <p className="reg__t" aria-hidden="true">
            <span>The NEXT</span> <span>Order.</span>
          </p>
        </div>
        <Showcase />
        <div className="reg__when">
          <p className="reg__k">{confirmed || "Date & venue to be announced"}</p>
          <Countdown startsAt={event.startsAt} />
          <p className="reg__host">Hosted by {knownFacts.host}</p>
        </div>
      </aside>
      <main className="reg__main">
        <h1 className="reg__h">
          Be in the room.
        </h1>
        <p className="reg__lede">A ViaMagus event on where global centres go next: what they own, the value they create and the capabilities they’ll need.</p>
        <InviteForm source="register" preset={preset} />
      </main>
    </div>
  );
}

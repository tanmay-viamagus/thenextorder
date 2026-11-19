import type { Metadata } from "next";
import { InvitePanel } from "@/components/shift/InvitePanel";
import { RsvpForm } from "@/components/shift/RsvpForm";
import { rsvpCopy } from "@/content/rsvp";
import { shareImage } from "@/content/story";
import { isReply } from "@/lib/rsvp";

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
  return (
    <main className="rsvp">
      <InvitePanel titleAs="h1" jump={{ href: "#reply", label: "Reply" }} />

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

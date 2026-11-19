import type { Metadata } from "next";
import { InviteForm } from "@/components/shift/InviteForm";
import { InvitePanel } from "@/components/shift/InvitePanel";
import { INTEREST_BY_KEY } from "@/content/register";
import { cta, invite, shareImage } from "@/content/story";
import { keep } from "@/lib/text";

const title = "Register | The NEXT Order — Viamagus";
const description =
  "Request your place at The NEXT Order — a Viamagus event for Hyderabad’s GCC leaders on how AI is reshaping talent, technology and leadership.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/register" },
  openGraph: { title, description, url: "/register", images: [shareImage] },
  twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
};

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const { interest } = await searchParams;
  const preset = interest ? INTEREST_BY_KEY[interest] : undefined;
  return (
    <main className="rsvp">
      {/* the same invitation as /rsvp */}
      <InvitePanel jump={{ href: "#request", label: cta.primary }} />

      {/* links from the site land here (/register#request); the brochure's QR opens the whole page */}
      <section id="request" className="rsvp__reply" aria-labelledby="reg-h">
        <div className="rsvp__inner">
          <p className="rsvp__k2">Register</p>
          <h1 id="reg-h" className="rsvp__h">
            Find your place in the conversation.
          </h1>
          <p className="rsvp__lede">{keep(invite.outcomes)}</p>
          <InviteForm source="register" preset={preset} />
        </div>
      </section>
    </main>
  );
}

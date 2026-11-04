import type { Metadata } from "next";
import { Fragment } from "react";
import { MavericksLogo, ViaMagusLogo } from "@/components/Brand";
import { InviteForm } from "@/components/shift/InviteForm";
import { agenda, agendaNote, knownFacts, statusLine } from "@/content/event";
import { INTEREST_BY_KEY } from "@/content/register";
import { invite, shareImage } from "@/content/story";
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
    <div className="reg">
      <aside className="reg__show" aria-label="The NEXT Order">
        <div className="reg__top">
          <ViaMagusLogo />
          {/* a full navigation to the top of the microsite — client-side routing restored the form's scroll position */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="reg__back" href="/#top">
            ← The site
          </a>
        </div>
        <div className="reg__id">
          <p className="reg__k">An invitation for Hyderabad’s GCC leaders</p>
          <p className="reg__t" aria-hidden="true">
            <span>The NEXT</span> <span>Order.</span>
          </p>
        </div>
        {/* the agenda, as the final brochure gives it — compact on phones */}
        <div className="reg__agenda">
          <p className="reg__k">Tentative agenda</p>
          <ol>
            {agenda.map((a) => (
              <li key={a.k}>
                <span className="reg__at">{a.time ?? ""}</span>
                <span>
                  {a.kind ? <span className="reg__kind">{a.kind}</span> : null}
                  {keep(a.t)}
                </span>
              </li>
            ))}
          </ol>
          <p className="reg__note">{agendaNote.replace(/^Tentative\. /, "")}</p>
        </div>
        <div className="reg__when">
          <p className="reg__k">
            {statusLine()
              .split(" · ")
              .map((part, k, all) => (
                <Fragment key={part}>
                  {/* the space between parts is the line's only break */}
                  {k ? " " : ""}
                  <span className="reg__part">
                    {keep(part)}
                    {k < all.length - 1 ? " ·" : ""}
                  </span>
                </Fragment>
              ))}
          </p>
          <p className="reg__host">
            <span>Organised by {knownFacts.host}</span>
            <span aria-hidden="true">·</span>
            <span className="reg__with">
              In collaboration with
              <MavericksLogo className="reg__mav" height={18} />
            </span>
          </p>
        </div>
      </aside>
      {/* links from the site land here (/register#request); the brochure's QR opens the whole page */}
      <main id="request" className="reg__main">
        <h1 className="reg__h">Find your place in the conversation.</h1>
        <p className="reg__lede">{keep(invite.summary)}</p>
        <InviteForm source="register" preset={preset} />
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { MavericksLogo, ViaMagusLogo } from "@/components/Brand";
import { InviteForm } from "@/components/shift/InviteForm";
import { agenda, knownFacts, statusLine } from "@/content/event";
import { INTEREST_BY_KEY } from "@/content/register";
import { invite } from "@/content/story";

const title = "Register | The NEXT Order — Viamagus";
const description =
  "Request your place at The NEXT Order — a Viamagus event for Hyderabad’s GCC leaders on how AI is reshaping talent, technology and leadership.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/register" },
  openGraph: { title, description, url: "/register" },
  twitter: { title, description },
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
        {/* the agenda, as the final brochure gives it — no products here */}
        <div className="reg__agenda">
          <p className="reg__k">Tentative agenda</p>
          <ol>
            {agenda.map((a) => (
              <li key={a.k}>
                <span className="reg__at">{a.time ?? ""}</span>
                <span>
                  {a.kind ? <span className="reg__kind">{a.kind}</span> : null}
                  {a.t}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="reg__when">
          <p className="reg__k">{statusLine()}</p>
          <p className="reg__host">
            Organised by {knownFacts.host} · In collaboration with
            <MavericksLogo className="reg__mav" height={18} />
          </p>
        </div>
      </aside>
      <main className="reg__main">
        <h1 className="reg__h">Find your place in the conversation.</h1>
        <p className="reg__lede">{invite.summary}</p>
        <InviteForm source="register" preset={preset} />
      </main>
    </div>
  );
}

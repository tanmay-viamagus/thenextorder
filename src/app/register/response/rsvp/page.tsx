import type { Metadata } from "next";
import { connection } from "next/server";
import { ViaMagusLogo } from "@/components/Brand";
import { siteAddress } from "@/content/event";
import { listName, replyWords, rsvpLists } from "@/content/rsvp";
import { REPLIES } from "@/lib/rsvp";
import { listRsvps, type Rsvp } from "@/lib/rsvp-store";

export const metadata: Metadata = {
  title: "RSVPs | The NEXT Order",
  robots: { index: false, follow: false },
};

const fmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

/** /register/response/rsvp — every reply to the invitation, for the organisers. Protected by src/proxy.ts. */
export default async function Replies() {
  await connection();
  let rows: Rsvp[] = [];
  let failed = false;
  try {
    rows = await listRsvps();
  } catch (e) {
    console.error(e);
    failed = true;
  }
  const byReply = REPLIES.map((r) => [r, rows.filter((x) => x.reply === r).length] as const);
  const lists = [...new Set([...Object.values(rsvpLists), ...rows.map((r) => listName(r.source))])];
  const byList = lists.map((l) => {
    const mine = rows.filter((r) => listName(r.source) === l);
    return { l, n: mine.length, yes: mine.filter((r) => r.reply === "yes").length };
  });

  return (
    <main className="resp">
      <header className="resp__hd">
        <ViaMagusLogo />
        <p className="resp__k">The NEXT Order · RSVPs · private</p>
      </header>
      <nav className="resp__nav" aria-label="Responses">
        <a href="/register/response">Registrations</a>
        <a href="/register/response/rsvp" aria-current="page">
          RSVPs
        </a>
      </nav>
      <div className="resp__top">
        <h1>
          <span className="resp__n">{rows.length}</span> {rows.length === 1 ? "reply" : "replies"}
        </h1>
        <a className="btn btn--shift" href="/register/response/rsvp/csv" download>
          Download CSV
        </a>
      </div>
      <p className="resp__sub">By reply</p>
      <dl className="resp__roles">
        {byReply.map(([r, n]) => (
          <div key={r}>
            <dt>{replyWords[r].label}</dt>
            <dd>{n}</dd>
          </div>
        ))}
      </dl>
      <p className="resp__sub">By list</p>
      <dl className="resp__roles">
        {byList.map(({ l, n, yes }) => (
          <div key={l}>
            <dt>{l}</dt>
            <dd>
              {n}
              {n ? <span className="resp__of"> · {yes} yes</span> : null}
            </dd>
          </div>
        ))}
      </dl>
      <p className="resp__sub">The links to send</p>
      <ul className="resp__links">
        {Object.entries(rsvpLists).map(([ref, l]) => (
          <li key={ref}>
            <span>{l}</span>
            <code>{`${siteAddress}/rsvp?ref=${ref}`}</code>
          </li>
        ))}
      </ul>
      {failed ? (
        <p className="resp__empty">Couldn’t reach the database. Check the Neon integration in the Vercel project.</p>
      ) : rows.length === 0 ? (
        <p className="resp__empty">No replies yet.</p>
      ) : (
        <div className="resp__scroll">
          <table className="resp__table">
            <thead>
              <tr>
                <th scope="col">Replied (IST)</th>
                <th scope="col">Reply</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Organisation</th>
                <th scope="col">List</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{fmt.format(new Date(r.updated_at))}</td>
                  <td>
                    <span className={`resp__reply resp__reply--${r.reply}`}>{replyWords[r.reply].label}</span>
                    {r.previous_reply ? <span className="resp__upd"> · was {replyWords[r.previous_reply].label}</span> : null}
                  </td>
                  <td>{r.name}</td>
                  <td>
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                  </td>
                  <td>{r.organisation}</td>
                  <td>{listName(r.source)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

import type { Metadata } from "next";
import { connection } from "next/server";
import { ViaMagusLogo } from "@/components/Brand";
import { INTERESTS, SEATS } from "@/content/register";
import { listRegistrations, type Registration } from "@/lib/registrations";

export const metadata: Metadata = {
  title: "Registrations | The NEXT Order",
  robots: { index: false, follow: false },
};

const fmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function Responses() {
  await connection();
  let rows: Registration[] = [];
  let failed = false;
  try {
    rows = await listRegistrations();
  } catch (e) {
    console.error(e);
    failed = true;
  }
  const byRole = SEATS.map((r) => [r, rows.filter((x) => x.role === r).length] as const);
  const byInterest = INTERESTS.map((r) => [r, rows.filter((x) => (x.interests ?? "").split(", ").includes(r)).length] as const);

  return (
    <main className="resp">
      <header className="resp__hd">
        <ViaMagusLogo />
        <p className="resp__k">The NEXT Order · Registrations · private</p>
      </header>
      <div className="resp__top">
        <h1>
          <span className="resp__n">{rows.length}</span> {rows.length === 1 ? "registration" : "registrations"}
        </h1>
        <a className="btn btn--shift" href="/register/response/csv" download>
          Download CSV
        </a>
      </div>
      <p className="resp__sub">By seat</p>
      <dl className="resp__roles">
        {byRole.map(([r, n]) => (
          <div key={r}>
            <dt>{r}</dt>
            <dd>{n}</dd>
          </div>
        ))}
      </dl>
      <p className="resp__sub">Want to explore</p>
      <dl className="resp__roles">
        {byInterest.map(([r, n]) => (
          <div key={r}>
            <dt>{r}</dt>
            <dd>{n}</dd>
          </div>
        ))}
      </dl>
      {failed ? (
        <p className="resp__empty">Couldn’t reach the database. Check the Neon integration in the Vercel project.</p>
      ) : rows.length === 0 ? (
        <p className="resp__empty">No registrations yet. Share the link: /register</p>
      ) : (
        <div className="resp__scroll">
          <table className="resp__table">
            <thead>
              <tr>
                <th scope="col">Received (IST)</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Organisation</th>
                <th scope="col">LinkedIn</th>
                <th scope="col">Seat</th>
                <th scope="col">Explore</th>
                <th scope="col">Taking on</th>
                <th scope="col">Via</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    {fmt.format(new Date(r.created_at))}
                    {new Date(r.updated_at).getTime() - new Date(r.created_at).getTime() > 1000 ? <span className="resp__upd"> · updated</span> : null}
                  </td>
                  <td>{r.name}</td>
                  <td>
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                  </td>
                  <td>{r.organisation}</td>
                  <td>
                    {r.linkedin ? (
                      <a href={r.linkedin} target="_blank" rel="noopener noreferrer">
                        {r.linkedin.replace("https://www.linkedin.com/in/", "in/")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{r.role}</td>
                  <td>{r.interests ?? "—"}</td>
                  <td className="resp__note">{[r.focus, r.next_mandate].filter(Boolean).join(" · ") || "—"}</td>
                  <td>{r.source ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

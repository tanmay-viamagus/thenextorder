import { listGuests } from "@/lib/attendance";

/** CSV export of the check-in list: everyone, whether they came, and when. Protected by src/proxy.ts. */
export async function GET() {
  const guests = await listGuests();
  const time = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
  const cols = ["attended", "arrived_ist", "name", "organisation", "email", "phone", "rsvp", "list", "on_stage", "welcome_email"] as const;
  const cell = (v: unknown) => {
    let s = v == null ? "" : String(v);
    // neutralise spreadsheet formulas
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const rows = guests
    .sort((a, b) => Number(!!b.arrivedAt) - Number(!!a.arrivedAt) || a.name.localeCompare(b.name, "en", { sensitivity: "base" }))
    .map((g) =>
      [
        g.arrivedAt ? "yes" : "no",
        g.arrivedAt ? time.format(new Date(g.arrivedAt)) : "",
        g.name,
        g.organisation,
        g.email,
        g.phone,
        g.reply ?? "",
        g.list,
        g.kind === "speaker" ? g.part ?? "yes" : "",
        g.welcomed ? "sent" : "",
      ]
        .map(cell)
        .join(","),
    );
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + [cols.join(","), ...rows].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="the-next-order-attendance-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

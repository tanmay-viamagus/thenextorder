import { listRegistrations } from "@/lib/registrations";

/** CSV export of every registration. Protected by src/proxy.ts. */
export async function GET() {
  const rows = await listRegistrations();
  const cols = ["created_at", "updated_at", "name", "email", "organisation", "role", "interests", "focus", "next_mandate", "source"] as const;
  const cell = (v: unknown) => {
    let s = v == null ? "" : String(v instanceof Date ? v.toISOString() : v);
    // neutralise spreadsheet formulas
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="the-next-order-registrations-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

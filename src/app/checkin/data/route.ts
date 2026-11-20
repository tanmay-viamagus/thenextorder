import { addWalkIn, checkIn, listGuests, undoCheckIn, welcome } from "@/lib/attendance";
import { sendWelcome } from "@/lib/send-welcome";

/**
 * /checkin/data — the registration desk's list and its actions. Behind the
 * desk password (src/proxy.ts), like the page.
 *   GET  → { guests }
 *   POST { action: "in" | "undo", key }  or  { action: "walkin", name, organisation, email, phone }
 * Checking someone in (or adding a walk-in with an email) sends them the
 * welcome email, once per address; the reply says how that went (welcome).
 */
const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    return Response.json({ ok: true, guests: await listGuests() }, { headers: noStore });
  } catch (e) {
    console.error("checkin list failed", e instanceof Error ? e.message : e);
    return Response.json({ ok: false, error: "Couldn’t reach the guest list. Check the connection and try again." }, { status: 500, headers: noStore });
  }
}

export async function POST(req: Request) {
  // the browser sends the desk password on its own, so only this site's own page may change the list
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return Response.json({ ok: false, error: "Not allowed." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const s = (k: string, max: number) => String(body[k] ?? "").trim().slice(0, max);
  const action = s("action", 10);
  const key = s("key", 80);

  try {
    if (action === "in" || action === "undo") {
      if (!/^(rsvp|speaker|walkin):[\w-]+$/.test(key)) return Response.json({ ok: false, error: "Invalid guest." }, { status: 400 });
      if (action === "undo") {
        await undoCheckIn(key);
        return Response.json({ ok: true });
      }
      const r = await checkIn(key);
      if (!r.ok) return Response.json(r, { status: 404 });
      return Response.json({ ok: true, welcome: await welcome(r.guest, sendWelcome) });
    }
    if (action === "walkin") {
      const d = { name: s("name", 120), organisation: s("organisation", 160), email: s("email", 200).toLowerCase(), phone: s("phone", 40) };
      if (!d.name) return Response.json({ ok: false, error: "Add their name." }, { status: 400 });
      if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return Response.json({ ok: false, error: "That email doesn’t look right. Leave it blank if unsure." }, { status: 400 });
      if (d.phone && !/^\+?[\d\s().-]{6,}$/.test(d.phone)) return Response.json({ ok: false, error: "That phone number doesn’t look right. Leave it blank if unsure." }, { status: 400 });
      const newKey = await addWalkIn(d);
      return Response.json({ ok: true, key: newKey, welcome: await welcome(d, sendWelcome) });
    }
    return Response.json({ ok: false, error: "Unknown action." }, { status: 400 });
  } catch (e) {
    console.error("checkin action failed", e instanceof Error ? e.message : e);
    return Response.json({ ok: false, error: "Couldn’t save that. Check the connection and try again." }, { status: 500 });
  }
}

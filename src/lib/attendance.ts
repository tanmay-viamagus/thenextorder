import { randomUUID } from "node:crypto";
import { allSpeakers, speakerGroups } from "@/content/speakers";
import { listName } from "@/content/rsvp";
import { sql } from "@/lib/db";
import type { Reply } from "@/lib/rsvp";
import { listRsvps } from "@/lib/rsvp-store";

/**
 * Check-in at the registration desk (/checkin), in the event's Neon Postgres
 * database (lib/db.ts), table "attendance": one row per person who has
 * arrived. The guest list itself is not copied: it is everyone who replied to
 * the invitation (table "rsvps"), the people on stage (content/speakers.ts),
 * and anyone the desk adds as a walk-in (stored here, with their details).
 *
 * Keys: "rsvp:<rsvps.id>", "speaker:<slug of the name>", "walkin:<uuid>".
 * Checking someone in inserts their row; undoing it deletes the row (for a
 * walk-in, that removes them from the list too).
 */
export type GuestKind = "rsvp" | "speaker" | "walkin";

export type Guest = {
  key: string;
  kind: GuestKind;
  name: string;
  organisation: string;
  email: string;
  /** the RSVP reply, for guests who replied */
  reply: Reply | null;
  /** the list the RSVP came from, or "On stage" / "Walk-in" */
  list: string;
  /** e.g. "Moderator · Technology panel", for the people on stage */
  part: string | null;
  /** ISO time of arrival, or null */
  arrivedAt: string | null;
};

type Row = { key: string; kind: GuestKind; name: string; organisation: string; email: string; arrived_at: string };

let ready: Promise<unknown> | null = null;
function ensureTable() {
  ready ??= (async () => {
    const q = sql();
    await q`CREATE TABLE IF NOT EXISTS attendance (
      key text PRIMARY KEY,
      kind text NOT NULL CHECK (kind IN ('rsvp', 'speaker', 'walkin')),
      name text NOT NULL,
      organisation text NOT NULL DEFAULT '',
      email text NOT NULL DEFAULT '',
      arrived_at timestamptz NOT NULL DEFAULT now()
    )`;
  })().catch((e) => {
    // try again on the next request rather than keep the failure
    ready = null;
    throw e;
  });
  return ready;
}

export const speakerKey = (name: string) =>
  "speaker:" +
  name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

/** Every guest the desk can check in, with whether they have arrived. */
export async function listGuests(): Promise<Guest[]> {
  await ensureTable();
  const [rsvps, rows] = await Promise.all([listRsvps(), sql()`SELECT * FROM attendance` as unknown as Promise<Row[]>]);
  const arrived = new Map(rows.map((r) => [r.key, r]));
  const at = (k: string) => {
    const r = arrived.get(k);
    return r ? new Date(r.arrived_at).toISOString() : null;
  };

  const guests: Guest[] = [];
  // the people on stage, then the replies, then walk-ins
  for (const g of speakerGroups)
    for (const p of g.people) {
      const key = speakerKey(p.name);
      guests.push({
        key,
        kind: "speaker",
        name: p.name,
        organisation: p.company ?? "",
        email: "",
        reply: null,
        list: "On stage",
        part: [p.part, g.title].filter(Boolean).join(" · "),
        arrivedAt: at(key),
      });
    }
  const onStage = new Set(allSpeakers.map((p) => p.name.toLowerCase()));
  for (const r of rsvps) {
    // someone on stage who also replied is listed once, as a speaker
    if (onStage.has(r.name.trim().toLowerCase())) continue;
    const key = `rsvp:${r.id}`;
    guests.push({
      key,
      kind: "rsvp",
      name: r.name,
      organisation: r.organisation,
      email: r.email,
      reply: r.reply,
      list: listName(r.source),
      part: null,
      arrivedAt: at(key),
    });
  }
  for (const r of rows)
    if (r.kind === "walkin")
      guests.push({
        key: r.key,
        kind: "walkin",
        name: r.name,
        organisation: r.organisation,
        email: r.email,
        reply: null,
        list: "Walk-in",
        part: null,
        arrivedAt: new Date(r.arrived_at).toISOString(),
      });
  return guests;
}

/** Marks a listed guest as arrived (a second tap keeps the first time). */
export async function checkIn(key: string): Promise<{ ok: boolean; error?: string }> {
  await ensureTable();
  const guest = (await listGuests()).find((g) => g.key === key);
  if (!guest) return { ok: false, error: "That guest isn’t on the list any more. Refresh the page." };
  if (guest.kind === "walkin") return { ok: true };
  await sql()`
    INSERT INTO attendance (key, kind, name, organisation, email)
    VALUES (${guest.key}, ${guest.kind}, ${guest.name}, ${guest.organisation}, ${guest.email})
    ON CONFLICT (key) DO NOTHING`;
  return { ok: true };
}

/** Undoes a check-in. A walk-in is removed from the list. */
export async function undoCheckIn(key: string) {
  await ensureTable();
  await sql()`DELETE FROM attendance WHERE key = ${key}`;
}

/** Adds someone who wasn't on the list, already arrived. */
export async function addWalkIn(d: { name: string; organisation: string; email: string }): Promise<string> {
  await ensureTable();
  const key = `walkin:${randomUUID()}`;
  await sql()`INSERT INTO attendance (key, kind, name, organisation, email) VALUES (${key}, 'walkin', ${d.name}, ${d.organisation}, ${d.email})`;
  return key;
}

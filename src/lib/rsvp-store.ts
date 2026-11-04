import { sql } from "@/lib/db";
import type { Reply, RsvpInput } from "@/lib/rsvp";

/**
 * Replies to the invitation (/rsvp), in the event's Neon Postgres database
 * (lib/db.ts), table "rsvps". One row per email: replying again changes the
 * reply and keeps the one before it, as a calendar invite does. The list the
 * guest first came from (source) stays as it was.
 */
export type Rsvp = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  organisation: string;
  reply: Reply;
  previous_reply: Reply | null;
  source: string | null;
};

let ready: Promise<unknown> | null = null;
function ensureTable() {
  ready ??= (async () => {
    const q = sql();
    await q`CREATE TABLE IF NOT EXISTS rsvps (
      id serial PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      name text NOT NULL,
      email text NOT NULL,
      organisation text NOT NULL,
      reply text NOT NULL CHECK (reply IN ('yes', 'tentative', 'no')),
      previous_reply text,
      source text
    )`;
    await q`CREATE UNIQUE INDEX IF NOT EXISTS rsvps_email_key ON rsvps (lower(email))`;
  })().catch((e) => {
    // try again on the next request rather than keep the failure
    ready = null;
    throw e;
  });
  return ready;
}

/** Stores the reply. `was` is the reply it replaced, if the guest had replied before. */
export async function saveRsvp(d: RsvpInput): Promise<{ updated: boolean; was: Reply | null }> {
  await ensureTable();
  const rows = (await sql()`
    WITH before AS (SELECT reply FROM rsvps WHERE lower(email) = lower(${d.email}))
    INSERT INTO rsvps (name, email, organisation, reply, source)
    VALUES (${d.name}, ${d.email}, ${d.organisation}, ${d.reply}, ${d.source})
    ON CONFLICT (lower(email)) DO UPDATE SET
      name = EXCLUDED.name,
      organisation = EXCLUDED.organisation,
      previous_reply = CASE WHEN rsvps.reply = EXCLUDED.reply THEN rsvps.previous_reply ELSE rsvps.reply END,
      reply = EXCLUDED.reply,
      updated_at = now()
    RETURNING (xmax = 0) AS inserted, (SELECT reply FROM before) AS was
  `) as { inserted: boolean; was: Reply | null }[];
  const r = rows[0];
  return { updated: !r?.inserted, was: r?.inserted ? null : (r?.was ?? null) };
}

export async function listRsvps(): Promise<Rsvp[]> {
  await ensureTable();
  return (await sql()`SELECT * FROM rsvps ORDER BY updated_at DESC`) as Rsvp[];
}

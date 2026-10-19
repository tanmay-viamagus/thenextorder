import { neon } from "@neondatabase/serverless";

/**
 * Registrations live in the Neon Postgres database provisioned through the
 * Vercel Marketplace (resource "thenextorder-registrations"; env DATABASE_URL).
 * One row per email: registering again updates the row instead of duplicating it.
 */
export type Registration = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  organisation: string;
  role: string;
  next_mandate: string | null;
  source: string | null;
};

export const ROLES = [
  "GCC CEO / MD / senior executive",
  "Site head / site leader",
  "Technology / engineering leader",
  "CHRO / HR / talent acquisition leader",
  "Other",
] as const;

let _sql: ReturnType<typeof neon> | null = null;
function sql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

let ready: Promise<unknown> | null = null;
function ensureTable() {
  ready ??= (async () => {
    const q = sql();
    await q`CREATE TABLE IF NOT EXISTS registrations (
      id serial PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      name text NOT NULL,
      email text NOT NULL,
      organisation text NOT NULL,
      role text NOT NULL,
      next_mandate text,
      source text
    )`;
    await q`CREATE UNIQUE INDEX IF NOT EXISTS registrations_email_key ON registrations (lower(email))`;
  })();
  return ready;
}

export type Input = { name: string; email: string; organisation: string; role: string; next_mandate: string; source: string };

export function validate(raw: Record<string, unknown>): { ok: true; data: Input } | { ok: false; errors: Record<string, string> } {
  const s = (k: string, max: number) => String(raw[k] ?? "").trim().slice(0, max);
  const data: Input = {
    name: s("name", 120),
    email: s("email", 200).toLowerCase(),
    organisation: s("organisation", 160),
    role: s("role", 80),
    next_mandate: s("next_mandate", 1200),
    source: s("source", 40) || "site",
  };
  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Please add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please add a valid work email.";
  if (!data.organisation) errors.organisation = "Please add your organisation.";
  if (!(ROLES as readonly string[]).includes(data.role)) errors.role = "Please choose the seat closest to yours.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export async function saveRegistration(d: Input) {
  await ensureTable();
  const rows = (await sql()`
    INSERT INTO registrations (name, email, organisation, role, next_mandate, source)
    VALUES (${d.name}, ${d.email}, ${d.organisation}, ${d.role}, ${d.next_mandate || null}, ${d.source})
    ON CONFLICT (lower(email)) DO UPDATE SET
      name = EXCLUDED.name, organisation = EXCLUDED.organisation, role = EXCLUDED.role,
      next_mandate = COALESCE(EXCLUDED.next_mandate, registrations.next_mandate),
      source = EXCLUDED.source, updated_at = now()
    RETURNING (xmax = 0) AS inserted
  `) as { inserted: boolean }[];
  return { updated: !rows[0]?.inserted };
}

export async function listRegistrations(): Promise<Registration[]> {
  await ensureTable();
  return (await sql()`SELECT * FROM registrations ORDER BY created_at DESC`) as Registration[];
}

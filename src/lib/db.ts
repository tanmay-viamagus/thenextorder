import { neon } from "@neondatabase/serverless";

/**
 * The event's Neon Postgres database, provisioned through the Vercel
 * Marketplace (resource "thenextorder-registrations"; env DATABASE_URL).
 * Registrations (lib/registrations.ts) and RSVP replies (lib/rsvp-store.ts)
 * live here.
 */
let _sql: ReturnType<typeof neon> | null = null;
export function sql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

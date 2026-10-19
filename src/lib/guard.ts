import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";

/**
 * Server-side abuse protection for the registration endpoint (alongside
 * Vercel BotID and the honeypot):
 *  - a signed form token: issued when the form loads, required on submit,
 *    rejected if forged, if submitted under MIN_MS (scripted), or if stale;
 *  - per-IP rate limiting, stored as salted hashes (no raw IPs kept).
 * FORM_SECRET must be set; without it every submission is refused (fail closed).
 */
const MIN_MS = 2500;
const MAX_MS = 6 * 3600e3;
const WINDOW_MIN = 10;
const MAX_PER_WINDOW = 6;

function secret() {
  const s = process.env.FORM_SECRET;
  return s && s.length >= 24 ? s : null;
}

const sign = (ts: string, s: string) => createHmac("sha256", s).update(`nxo-form:${ts}`).digest("base64url");

export function issueToken(): string | null {
  const s = secret();
  if (!s) return null;
  const ts = String(Date.now());
  return `${ts}.${sign(ts, s)}`;
}

export function checkToken(token: unknown): { ok: true } | { ok: false; status: number; error: string } {
  const s = secret();
  if (!s) return { ok: false, status: 503, error: "Registration is temporarily unavailable. Please email hi@viamagus.com." };
  const [ts, mac] = String(token ?? "").split(".");
  if (!ts || !mac) return { ok: false, status: 400, error: "Please refresh the page and try again." };
  const want = Buffer.from(sign(ts, s));
  const got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return { ok: false, status: 400, error: "Please refresh the page and try again." };
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age < MIN_MS) return { ok: false, status: 429, error: "That was quick — please take a moment and try again." };
  if (age > MAX_MS) return { ok: false, status: 400, error: "This page has been open a while. Please refresh and try again." };
  return { ok: true };
}

export function clientIp(req: Request) {
  return (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
}

/** Records the attempt and reports whether this IP is over the limit. */
export async function rateLimited(ip: string): Promise<boolean> {
  const s = secret();
  if (!s || !process.env.DATABASE_URL) return true;
  const sql = neon(process.env.DATABASE_URL);
  const h = createHash("sha256").update(`${s}:${ip}`).digest("hex").slice(0, 32);
  await sql`CREATE TABLE IF NOT EXISTS register_attempts (ip_hash text NOT NULL, at timestamptz NOT NULL DEFAULT now())`;
  await sql`CREATE INDEX IF NOT EXISTS register_attempts_ip_at ON register_attempts (ip_hash, at)`;
  await sql`DELETE FROM register_attempts WHERE at < now() - interval '1 day'`;
  await sql`INSERT INTO register_attempts (ip_hash) VALUES (${h})`;
  const rows = (await sql`SELECT count(*)::int AS n FROM register_attempts WHERE ip_hash = ${h} AND at > now() - make_interval(mins => ${WINDOW_MIN})`) as { n: number }[];
  return (rows[0]?.n ?? 0) > MAX_PER_WINDOW;
}

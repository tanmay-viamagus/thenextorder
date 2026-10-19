import { issueToken } from "@/lib/guard";

/** GET /api/register/token — a signed, timestamped token the form must return on submit. */
export async function GET() {
  const t = issueToken();
  if (!t) return Response.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  return Response.json({ ok: true, t }, { headers: { "Cache-Control": "no-store" } });
}

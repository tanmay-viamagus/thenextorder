import { saveRegistration, validate } from "@/lib/registrations";

/** POST /api/register — stores one registration (JSON body). */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // honeypot: people never see this field; bots fill it in
  if (String(body.website ?? "").trim()) return Response.json({ ok: true });

  const v = validate(body);
  if (!v.ok) return Response.json({ ok: false, errors: v.errors }, { status: 400 });
  try {
    const r = await saveRegistration(v.data);
    return Response.json({ ok: true, updated: r.updated });
  } catch (e) {
    console.error("register failed", e);
    return Response.json({ ok: false, error: "We couldn’t save your request just now." }, { status: 500 });
  }
}

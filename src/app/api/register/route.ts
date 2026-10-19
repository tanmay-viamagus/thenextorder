import { checkBotId } from "botid/server";
import { checkToken, clientIp, rateLimited } from "@/lib/guard";
import { saveRegistration, validate } from "@/lib/registrations";

/**
 * POST /api/register — stores one registration (JSON body).
 * Every check runs here, on the server: BotID, the honeypot, the signed form
 * token (timing), per-IP rate limiting, then field validation.
 */
export async function POST(req: Request) {
  // BotID only runs on Vercel. There, any failure to classify refuses the request (fail closed);
  // on a local machine it is skipped so the form can be tested.
  try {
    const bot = await checkBotId();
    if (bot.isBot) return Response.json({ ok: false, error: "We couldn’t verify this request. Please try again from your browser." }, { status: 403 });
  } catch (e) {
    if (process.env.VERCEL) {
      console.error("botid check failed", e instanceof Error ? e.message : e);
      return Response.json({ ok: false, error: "We couldn’t verify this request. Please try again in a moment." }, { status: 503 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // honeypot: people never see this field; bots fill it in. Answer as if it worked.
  if (String(body.website ?? "").trim()) return Response.json({ ok: true });

  const tok = checkToken(body.t);
  if (!tok.ok) return Response.json({ ok: false, error: tok.error }, { status: tok.status });

  try {
    if (await rateLimited(clientIp(req))) {
      return Response.json({ ok: false, error: "Too many attempts from this connection. Please wait a few minutes." }, { status: 429 });
    }
  } catch (e) {
    console.error("rate limit check failed", e instanceof Error ? e.message : e);
    return Response.json({ ok: false, error: "We couldn’t save your request just now." }, { status: 500 });
  }

  const v = validate(body);
  if (!v.ok) return Response.json({ ok: false, errors: v.errors }, { status: 400 });
  try {
    const r = await saveRegistration(v.data);
    return Response.json({ ok: true, updated: r.updated });
  } catch (e) {
    console.error("register failed", e instanceof Error ? e.message : e);
    return Response.json({ ok: false, error: "We couldn’t save your request just now." }, { status: 500 });
  }
}

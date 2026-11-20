import { NextResponse, type NextRequest } from "next/server";

/**
 * Private pages sit behind HTTP Basic auth.
 *
 * /register/response holds attendees' personal details: username "viamagus",
 * password RESPONSES_PASSWORD.
 *
 * /checkin is the registration desk on the evening: username "desk",
 * password CHECKIN_PASSWORD, so the desk team can check guests in without
 * seeing the responses pages. The organisers' "viamagus" login opens it too.
 *
 * Both are set in the Vercel project's environment variables. Without its
 * variable, a login doesn't work and the page stays locked.
 */
function credentials(req: NextRequest): [string, string] | null {
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return null;
  try {
    const [user, ...rest] = atob(header.slice(6)).split(":");
    return [user, rest.join(":")];
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const desk = req.nextUrl.pathname === "/checkin" || req.nextUrl.pathname.startsWith("/checkin/");
  const responses = process.env.RESPONSES_PASSWORD;
  const checkin = process.env.CHECKIN_PASSWORD;
  const c = credentials(req);
  if (c) {
    const [user, pass] = c;
    if (responses && user === "viamagus" && pass === responses) return NextResponse.next();
    if (desk && checkin && user === "desk" && pass === checkin) return NextResponse.next();
  }
  const realm = desk ? "The NEXT Order - registration desk" : "The NEXT Order - responses";
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`, "Cache-Control": "no-store" },
  });
}

export const config = {
  matcher: ["/register/response", "/register/response/:path*", "/checkin", "/checkin/:path*"],
};

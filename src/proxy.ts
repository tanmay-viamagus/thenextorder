import { NextResponse, type NextRequest } from "next/server";

/**
 * /register/response holds attendees' personal details, so it sits behind
 * HTTP Basic auth. Username "viamagus"; password from RESPONSES_PASSWORD
 * (set in the Vercel project's environment variables). Without that variable
 * the page stays locked.
 */
export function proxy(req: NextRequest) {
  const want = process.env.RESPONSES_PASSWORD;
  const header = req.headers.get("authorization") ?? "";
  if (want && header.startsWith("Basic ")) {
    try {
      const [user, ...rest] = atob(header.slice(6)).split(":");
      if (user === "viamagus" && rest.join(":") === want) return NextResponse.next();
    } catch {}
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="The NEXT Order - responses", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

export const config = {
  matcher: ["/register/response", "/register/response/:path*"],
};

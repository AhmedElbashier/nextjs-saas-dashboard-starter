import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "session";

/**
 * Route guard. Disabled by default so the demo runs without an identity provider.
 * Set AUTH_REQUIRED=true once getSession() in src/lib/auth.ts is wired to a real provider.
 */
export function middleware(req: NextRequest) {
  if (process.env.AUTH_REQUIRED !== "true") return NextResponse.next();
  if (req.cookies.get(SESSION_COOKIE)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/dashboard/:path*"] };

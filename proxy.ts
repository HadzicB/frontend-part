import { NextRequest, NextResponse } from "next/server";

// Pages anyone can open. Every other route requires a session cookie.
const publicRoutes = ["/login", "/signup", "/forgot-password"];

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // Optimistic check: only looks that the cookie exists, not that it's valid.
  const hasSession = req.cookies.has("session");

  if (!isPublicRoute && !hasSession) {
    console.log("proxy: no session, redirecting to /login from", path);
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Logged-in users have no business on login/signup
  if (isPublicRoute && hasSession) {
    console.log("proxy: has session, redirecting to / from", path);
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes the proxy should NOT run on (static files, images, etc.)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};

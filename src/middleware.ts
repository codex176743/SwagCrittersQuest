import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
  // return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  // The above middleware would only run for the "/" path
  matcher: "/admin/:path*",
};

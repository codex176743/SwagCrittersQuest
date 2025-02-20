import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Request for : ", request.nextUrl.pathname);
  return NextResponse.next();
  // return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  // The above middleware would only run for the "/" path
  matcher: "/admin/:path*",
};

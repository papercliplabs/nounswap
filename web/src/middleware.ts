import { NextResponse, NextRequest } from "next/server";

// Redirect non-www to www
export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const url = req.nextUrl.clone();

  if (process.env.NODE_ENV === "development") {
    // Don't redirect in development
    return NextResponse.next();
  }

  if (host && !host.startsWith("www.")) {
    url.hostname = "www." + host;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

import { NextResponse, type NextRequest } from "next/server";

import { LANG_HEADER } from "@/lib/i18n";

// /en and /en/... are the English site: same pages, language passed upstream in a request header.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    headers.set(LANG_HEADER, "en");
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/en" ? "/" : pathname.slice(3);
    return NextResponse.rewrite(url, { request: { headers } });
  }
  // A visitor cannot pick the language by sending the header: only the URL decides.
  headers.delete(LANG_HEADER);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|widget.js).*)"],
};

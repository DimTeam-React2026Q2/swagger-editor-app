import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "ru"],
  defaultLocale: "en",
});

export default function middleware(request: NextRequest): NextResponse {
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(ru|en)/:path*"],
};

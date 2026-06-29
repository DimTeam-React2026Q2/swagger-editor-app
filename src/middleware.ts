import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "ru"],
  defaultLocale: "en",
});

export default async function middleware(
  request: NextRequest
): Promise<Response> {
  const response = intlMiddleware(request);

  return updateSession(request, response);
}

export const config = {
  matcher: ["/", "/(ru|en)/:path*"],
};

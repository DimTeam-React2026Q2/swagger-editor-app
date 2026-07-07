import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { TryItOutResponse } from "@/types/swagger";

/**
 * Server-side request proxy for the Try-It-Out REST client.
 *
 * Browsers can't call arbitrary third-party APIs directly (CORS), so the
 * form posts the assembled request here and we execute it server-side with
 * fetch, then return the result in the TryItOutResponse shape.
 *
 * Error HTTP statuses (4xx/5xx) are returned as data, never thrown — the UI
 * must be able to display them (per task spec).
 */

type ProxyRequest = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
};

const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "DELETE", "PATCH"]);
const REQUEST_TIMEOUT_MS = 30_000;

function errorResponse(statusCode: number, message: string): TryItOutResponse {
  return {
    statusCode,
    headers: {},
    body: message,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let payload: ProxyRequest;

  try {
    payload = (await request.json()) as ProxyRequest;
  } catch {
    return NextResponse.json(
      errorResponse(0, "Invalid proxy request: body must be valid JSON."),
      { status: 200 }
    );
  }

  const method = (payload.method ?? "GET").toUpperCase();
  const { url, headers, body } = payload;

  if (!url || typeof url !== "string") {
    return NextResponse.json(
      errorResponse(0, "Invalid proxy request: 'url' is required."),
      { status: 200 }
    );
  }

  // Only allow http(s) targets — block file://, data:, etc.
  let target: URL;
  try {
    target = new URL(url);
    if (target.protocol !== "http:" && target.protocol !== "https:") {
      throw new Error("protocol");
    }
  } catch {
    return NextResponse.json(
      errorResponse(0, `Invalid or unsupported URL: ${url}`),
      { status: 200 }
    );
  }

  if (!ALLOWED_METHODS.has(method)) {
    return NextResponse.json(
      errorResponse(0, `Unsupported method: ${method}`),
      { status: 200 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    (): void => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const hasBody = method !== "GET" && method !== "DELETE" && Boolean(body);

    const upstream = await fetch(target.toString(), {
      method,
      headers: headers ?? {},
      body: hasBody ? body : undefined,
      signal: controller.signal,
      redirect: "follow",
    });

    const responseHeaders: Record<string, string> = {};
    upstream.headers.forEach((value: string, key: string): void => {
      responseHeaders[key] = value;
    });

    const responseBody = await upstream.text();

    const result: TryItOutResponse = {
      statusCode: upstream.status,
      headers: responseHeaders,
      body: responseBody,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    const message = isAbort
      ? `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`
      : `Network error: ${error instanceof Error ? error.message : "unknown"}`;
    return NextResponse.json(errorResponse(0, message), { status: 200 });
  } finally {
    clearTimeout(timeout);
  }
}

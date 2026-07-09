import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

/** A single recorded request/response analytics entry. */
export interface RequestHistoryEntry {
  id: string;
  method: string;
  url: string;
  endpoint: string | null;
  status_code: number;
  duration_ms: number;
  request_size: number;
  response_size: number;
  error: string | null;
  created_at: string;
}

/** Payload recorded after a request executes (server-side). */
export interface RecordRequestInput {
  method: string;
  url: string;
  endpoint?: string | null;
  statusCode: number;
  durationMs: number;
  requestSize: number;
  responseSize: number;
  error?: string | null;
}

/**
 * Records one executed request into the history table for the current user.
 * No-op when unauthenticated (guests don't get history). Never throws — a
 * failed insert must not break the actual proxied request/response.
 */
export async function recordRequest(input: RecordRequestInput): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const supabase = await createClient();
    await supabase.from("request_history").insert({
      user_id: user.id,
      method: input.method,
      url: input.url,
      endpoint: input.endpoint ?? null,
      status_code: input.statusCode,
      duration_ms: input.durationMs,
      request_size: input.requestSize,
      response_size: input.responseSize,
      error: input.error ?? null,
    });
  } catch {
    // Swallow: analytics recording is best-effort.
  }
}

/**
 * Loads the current user's request history, most recent first.
 * Returns an empty array when unauthenticated or on error.
 */
export async function loadHistory(): Promise<RequestHistoryEntry[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("request_history")
    .select(
      "id, method, url, endpoint, status_code, duration_ms, request_size, response_size, error, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as RequestHistoryEntry[];
}

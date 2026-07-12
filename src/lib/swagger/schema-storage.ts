"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

export interface SavedSchema {
  content: string;
  format: string;
}

export interface SaveSchemaResult {
  ok: boolean;
  error: string | null;
}

export async function saveSchema(
  content: string,
  format: string
): Promise<SaveSchemaResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "You must be signed in to save a schema." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("schemas").upsert(
    {
      user_id: user.id,
      content,
      format,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, error: null };
}

export async function loadSchema(): Promise<SavedSchema | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schemas")
    .select("content, format")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return { content: data.content as string, format: data.format as string };
}

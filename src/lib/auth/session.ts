import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// Returns the current authenticated user, or null if not signed in.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

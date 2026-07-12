import { ReactElement } from "react";
import SwaggerDashboard from "@/components/swagger/SwaggerDashboard";
import { loadSchema } from "@/lib/swagger/schema-storage";
import { getCurrentUser } from "@/lib/auth/session";

export default async function Home(): Promise<ReactElement> {
  const user = await getCurrentUser();
  const saved = user ? await loadSchema() : null;

  return (
    <main className="min-h-screen w-full bg-[#1b1b1b]">
      <SwaggerDashboard
        initialSchema={saved?.content ?? ""}
        isAuthenticated={Boolean(user)}
      />
    </main>
  );
}

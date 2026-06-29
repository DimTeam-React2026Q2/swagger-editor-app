import type { ReactElement } from "react";
import { requireUser } from "@/lib/auth/session";

export default async function HistoryPage(): Promise<ReactElement> {
  // Private route: unauthenticated users are redirected to Main.
  await requireUser();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 bg-zinc-50 px-4 py-16">
      <h1 className="text-2xl font-semibold text-[#173647]">
        History &amp; Analytics
      </h1>
      <p className="text-sm text-zinc-600">
        Your executed requests will appear here. (Coming soon.)
      </p>
    </main>
  );
}

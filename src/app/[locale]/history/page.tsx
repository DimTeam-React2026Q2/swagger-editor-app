import type { ReactElement } from "react";
import { requireUser } from "@/lib/auth/session";
import { loadHistory } from "@/lib/history/request-history";
import HistoryList from "@/components/history/HistoryList";

export default async function HistoryPage(): Promise<ReactElement> {
  // Private route: unauthenticated users are redirected to Main.
  await requireUser();

  // Server-side generated: history is fetched on the server, newest first.
  const entries = await loadHistory();

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-2xl font-semibold text-[#173647]">
          History &amp; Analytics
        </h1>
        <p className="mb-6 text-sm text-zinc-600">
          {entries.length > 0
            ? `${entries.length} request${entries.length === 1 ? "" : "s"} recorded, most recent first.`
            : "Your executed requests will be recorded here."}
        </p>
        <HistoryList entries={entries} />
      </div>
    </main>
  );
}

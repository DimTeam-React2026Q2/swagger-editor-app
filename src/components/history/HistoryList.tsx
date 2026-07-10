import type { ReactElement } from "react";
import { Link } from "@/i18n/navigation";
import type { RequestHistoryEntry } from "@/lib/history/request-history";
import {
  formatBytes,
  formatDuration,
  statusColorClass,
} from "@/lib/history/format";

interface HistoryListProps {
  entries: RequestHistoryEntry[];
}

export default function HistoryList({
  entries,
}: HistoryListProps): ReactElement {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
        <h2 className="mb-1 text-lg font-semibold text-[#173647]">
          No requests yet
        </h2>
        <p className="mb-4 text-sm text-zinc-600">
          Execute a request from the Try-It-Out client and it will appear here
          with full analytics.
        </p>
        <div className="flex justify-center gap-3 text-sm font-medium">
          <Link href="/" className="text-[#173647] underline">
            Go to Editor
          </Link>
          <Link href="/" className="text-[#173647] underline">
            Open Viewer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] tracking-wider text-zinc-500 uppercase">
          <tr>
            <th className="px-3 py-2">Method</th>
            <th className="px-3 py-2">Endpoint / URL</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Duration</th>
            <th className="px-3 py-2">Req</th>
            <th className="px-3 py-2">Resp</th>
            <th className="px-3 py-2">When</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {entries.map(
            (entry): ReactElement => (
              <tr key={entry.id} className="hover:bg-zinc-50">
                <td className="px-3 py-2 font-mono font-semibold text-zinc-700">
                  {entry.method}
                </td>
                <td className="max-w-[280px] truncate px-3 py-2 font-mono text-xs text-zinc-600">
                  {entry.endpoint ?? entry.url}
                  {entry.error && (
                    <span className="mt-0.5 block text-[11px] text-rose-500">
                      {entry.error}
                    </span>
                  )}
                </td>
                <td
                  className={`px-3 py-2 font-mono font-semibold ${statusColorClass(
                    entry.status_code
                  )}`}
                >
                  {entry.status_code === 0 ? "ERR" : entry.status_code}
                </td>
                <td className="px-3 py-2 text-zinc-600">
                  {formatDuration(entry.duration_ms)}
                </td>
                <td className="px-3 py-2 text-zinc-600">
                  {formatBytes(entry.request_size)}
                </td>
                <td className="px-3 py-2 text-zinc-600">
                  {formatBytes(entry.response_size)}
                </td>
                <td className="px-3 py-2 text-xs text-zinc-500">
                  {new Date(entry.created_at).toLocaleString()}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

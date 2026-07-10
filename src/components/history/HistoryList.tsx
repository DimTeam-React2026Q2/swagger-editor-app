import type { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
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

export default async function HistoryList({
  entries,
}: HistoryListProps): Promise<ReactElement> {
  const t = await getTranslations("History");

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
        <h2 className="mb-1 text-lg font-semibold text-[#173647]">
          {t("emptyTitle")}
        </h2>
        <p className="mb-4 text-sm text-zinc-600">{t("emptyText")}</p>
        <div className="flex justify-center gap-3 text-sm font-medium">
          <Link href="/" className="text-[#173647] underline">
            {t("goToEditor")}
          </Link>
          <Link href="/" className="text-[#173647] underline">
            {t("openViewer")}
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
            <th className="px-3 py-2">{t("method")}</th>
            <th className="px-3 py-2">{t("endpointUrl")}</th>
            <th className="px-3 py-2">{t("status")}</th>
            <th className="px-3 py-2">{t("duration")}</th>
            <th className="px-3 py-2">{t("req")}</th>
            <th className="px-3 py-2">{t("resp")}</th>
            <th className="px-3 py-2">{t("when")}</th>
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

"use client";

import { ReactElement } from "react";
import { useSwaggerParser } from "@/hooks/useSwaggerParser";
import { EndpointData } from "@/types/swagger";

interface SwaggerViewerProps {
  schemaText: string;
}

const getMethodBadgeStyle = (method: string): string => {
  switch (method) {
    case "get":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 uppercase";
    case "post":
      return "bg-blue-50 text-blue-700 border-blue-200 uppercase";
    case "put":
      return "bg-amber-50 text-amber-700 border-amber-200 uppercase";
    case "delete":
      return "bg-rose-50 text-rose-700 border-rose-200 uppercase";
    default:
      return "bg-zinc-50 text-zinc-700 border-zinc-200 uppercase";
  }
};

export function SwaggerViewer({
  schemaText,
}: SwaggerViewerProps): ReactElement {
  const { endpoints, validationError } = useSwaggerParser(schemaText);

  if (validationError) {
    return (
      <div className="animate-fade-in rounded-lg border border-rose-200 bg-rose-50 p-4 font-sans">
        <h4 className="mb-1 text-sm font-semibold text-rose-800">
          Schema Validation Error
        </h4>
        <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-rose-600">
          {validationError}
        </p>
      </div>
    );
  }

  if (endpoints.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center font-sans select-none">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 font-mono text-lg font-bold text-zinc-400">
          ?
        </div>
        <h4 className="mb-1 text-sm font-semibold text-zinc-700">
          No API Definition Detected
        </h4>
        <p className="max-w-[280px] text-xs text-zinc-400">
          The Viewer will automatically populate with documentation endpoints
          when a valid schema is provided in the editor.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4 font-sans">
      <div className="flex justify-between border-b border-zinc-100 pb-2 font-mono text-xs text-zinc-400">
        <span>Swagger UI Client v1.0</span>
        <span>Detected {endpoints.length} endpoints</span>
      </div>

      <div className="space-y-2">
        {endpoints.map(
          (endpoint: EndpointData): ReactElement => (
            <div
              key={endpoint.id}
              className="group flex cursor-pointer items-center space-x-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100/50"
            >
              <span
                className={`rounded border px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider ${getMethodBadgeStyle(endpoint.method)}`}
              >
                {endpoint.method}
              </span>

              <span className="font-mono text-sm font-medium text-zinc-800 transition-colors group-hover:text-zinc-950">
                {endpoint.path}
              </span>

              {endpoint.summary && (
                <span className="max-w-[200px] truncate text-xs text-zinc-400 italic">
                  — {endpoint.summary}
                </span>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

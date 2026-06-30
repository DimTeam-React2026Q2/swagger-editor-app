"use client";

import { ReactElement } from "react";
import { useSwaggerParser } from "@/hooks/useSwaggerParser";
import { EndpointData } from "@/types/swagger";
import { Accordion } from "@/components/ui/accordion";
import { EndpointDetails } from "./EndpointDetails";

interface SwaggerViewerProps {
  schemaText: string;
}

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

      <Accordion type="multiple" className="w-full">
        {endpoints.map(
          (endpoint: EndpointData): ReactElement => (
            <EndpointDetails key={endpoint.id} endpoint={endpoint} />
          )
        )}
      </Accordion>
    </div>
  );
}

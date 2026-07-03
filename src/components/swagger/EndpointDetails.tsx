"use client";

import { ReactElement } from "react";
import {
  EndpointData,
  EndpointParameter,
  JsonSchemaProperty,
} from "@/types/swagger";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TryItOutForm from "./TryItOutForm";

interface EndpointDetailsProps {
  endpoint: EndpointData;
}

const getMethodColor = (method: string): string => {
  switch (method) {
    case "get":
      return "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700";
    case "post":
      return "border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700";
    case "put":
      return "border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-700";
    case "delete":
      return "border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700";
    default:
      return "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 text-zinc-700";
  }
};

const getBadgeStyle = (method: string): string => {
  switch (method) {
    case "get":
      return "bg-emerald-500 text-white font-mono";
    case "post":
      return "bg-blue-500 text-white font-mono";
    case "put":
      return "bg-amber-500 text-white font-mono";
    case "delete":
      return "bg-rose-500 text-white font-mono";
    default:
      return "bg-zinc-500 text-white font-mono";
  }
};

export function EndpointDetails({
  endpoint,
}: EndpointDetailsProps): ReactElement {
  return (
    <AccordionItem
      value={endpoint.id}
      className={`mb-2 overflow-hidden rounded-lg border transition-all duration-200 ${getMethodColor(endpoint.method)}`}
    >
      <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3 hover:no-underline">
        <div className="flex items-center space-x-3 text-left">
          <span
            className={`rounded px-2.5 py-0.5 text-xs font-black tracking-wider uppercase ${getBadgeStyle(endpoint.method)}`}
          >
            {endpoint.method}
          </span>
          <span className="font-mono text-[13px] font-semibold text-zinc-800">
            {endpoint.path}
          </span>
          {endpoint.summary && (
            <span className="hidden max-w-[250px] truncate text-xs font-normal text-zinc-500 sm:inline">
              {endpoint.summary}
            </span>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-6 border-t border-inherit bg-white p-4 text-zinc-700">
        <div>
          <h4 className="mb-2 text-xs font-bold tracking-wider text-zinc-800 uppercase">
            Parameters
          </h4>
          {endpoint.parameters.length === 0 ? (
            <p className="px-1 text-xs text-zinc-400 italic">
              No parameters required for this operation.
            </p>
          ) : (
            <div className="overflow-hidden rounded-md border border-zinc-100 text-xs">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50 font-semibold text-zinc-500">
                    <th className="w-1/3 p-2">Name</th>
                    <th className="w-1/4 p-2">Type</th>
                    <th className="p-2">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 font-mono">
                  {endpoint.parameters.map(
                    (param: EndpointParameter): ReactElement => (
                      <tr key={param.name} className="hover:bg-zinc-50/50">
                        <td className="p-2 font-semibold text-zinc-800">
                          {param.name}
                          {param.required && (
                            <span className="ml-1 font-sans text-rose-500">
                              * required
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-zinc-600">
                          {param.schema?.type || "string"}
                        </td>
                        <td className="p-2">
                          <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600">
                            {param.in}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {endpoint.requestBodySchema && (
          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-zinc-800 uppercase">
              Request Body
            </h4>
            <div className="max-h-48 overflow-x-auto rounded-md border border-zinc-100 bg-zinc-50 p-3 font-mono text-xs">
              <pre className="text-zinc-600">
                {JSON.stringify(endpoint.requestBodySchema, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div>
          <h4 className="mb-2 text-xs font-bold tracking-wider text-zinc-800 uppercase">
            Responses
          </h4>
          <div className="space-y-2 text-xs">
            {Object.entries(endpoint.responses).map(
              ([code, resp]: [
                string,
                { description: string; schema?: JsonSchemaProperty },
              ]): ReactElement => {
                const isSuccess = code.startsWith("2");
                return (
                  <div
                    key={code}
                    className="rounded-md border border-zinc-100 bg-zinc-50/30 p-3"
                  >
                    <div className="mb-1 flex items-center space-x-2 font-mono">
                      <span
                        className={`font-bold ${isSuccess ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        {code}
                      </span>
                      <span className="text-[11px] text-zinc-600">
                        — {resp.description}
                      </span>
                    </div>
                    {resp.schema && (
                      <pre className="mt-2 max-h-32 overflow-x-auto rounded border border-zinc-100 bg-zinc-50 p-2 font-mono text-[11px] text-zinc-500">
                        {JSON.stringify(resp.schema, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-dashed border-zinc-200 pt-4">
          <h4 className="mb-3 text-xs font-bold tracking-wider text-zinc-800 uppercase">
            Try it out
          </h4>
          <TryItOutForm endpoint={endpoint} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

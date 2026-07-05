"use client";

import { useMemo, useState, type ReactElement } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { EndpointData, TryItOutResponse } from "@/types/swagger";
import {
  assembleRequest,
  paramPlaceholder,
  type FieldValues,
} from "@/lib/swagger/assemble-request";
import { buildCurl } from "@/lib/swagger/build-curl";
import { Button } from "@/components/ui/button";

interface TryItOutFormProps {
  endpoint: EndpointData;
}

function buildSchema(
  endpoint: EndpointData
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const param of endpoint.parameters) {
    shape[param.name] = param.required
      ? z.string().min(1, `${param.name} is required`)
      : z.string().optional();
  }
  return z.object(shape);
}

const bodyMethods = new Set(["post", "put"]);

function statusColor(status: number): string {
  if (status === 0) return "bg-rose-100 text-rose-700";
  if (status >= 200 && status < 300) return "bg-emerald-100 text-emerald-700";
  if (status >= 300 && status < 400) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function formatBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

export default function TryItOutForm({
  endpoint,
}: TryItOutFormProps): ReactElement {
  const schema = useMemo(
    (): z.ZodObject<Record<string, z.ZodTypeAny>> => buildSchema(endpoint),
    [endpoint]
  );

  const [baseUrl, setBaseUrl] = useState<string>("");
  const [body, setBody] = useState<string>((): string => {
    const content = endpoint.requestBodySchema?.["application/json"];
    if (content?.example !== undefined) {
      return JSON.stringify(content.example, null, 2);
    }
    return "";
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FieldValues>,
    mode: "onBlur",
  });

  const showBody = bodyMethods.has(endpoint.method);

  const [response, setResponse] = useState<TryItOutResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const watched = useWatch({ control }) as FieldValues;
  const curlCommand = buildCurl(
    assembleRequest(endpoint, watched, baseUrl, body)
  );

  const handleCopyCurl = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout((): void => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = handleSubmit(async (values: FieldValues): Promise<void> => {
    const assembled = assembleRequest(endpoint, values, baseUrl, body);
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assembled),
      });
      const data = (await res.json()) as TryItOutResponse;
      setResponse(data);
    } catch (error: unknown) {
      setResponse({
        statusCode: 0,
        headers: {},
        body: `Failed to reach proxy: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 text-left font-sans"
      noValidate
    >
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
          Base URL
        </label>
        <input
          type="url"
          value={baseUrl}
          onChange={(e): void => setBaseUrl(e.target.value)}
          placeholder="https://api.example.com"
          className="rounded-md border border-zinc-200 px-3 py-1.5 font-mono text-xs outline-none focus:border-zinc-400"
        />
      </div>

      {endpoint.parameters.length > 0 && (
        <div className="space-y-3">
          {endpoint.parameters.map(
            (param): ReactElement => (
              <div key={param.name} className="flex flex-col gap-1">
                <label className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600">
                  <span className="font-mono">{param.name}</span>
                  <span className="rounded bg-zinc-100 px-1 text-[9px] text-zinc-500 uppercase">
                    {param.in}
                  </span>
                  {param.required && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder={paramPlaceholder(param)}
                  className="rounded-md border border-zinc-200 px-3 py-1.5 font-mono text-xs outline-none focus:border-zinc-400"
                  aria-invalid={Boolean(errors[param.name])}
                  {...register(param.name)}
                />
                {errors[param.name] && (
                  <span className="text-[11px] text-rose-600">
                    {String(errors[param.name]?.message)}
                  </span>
                )}
              </div>
            )
          )}
        </div>
      )}

      {showBody && (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            Request Body (JSON)
          </label>
          <textarea
            value={body}
            onChange={(e): void => setBody(e.target.value)}
            rows={6}
            spellCheck={false}
            className="custom-scrollbar-light rounded-md border border-zinc-200 p-3 font-mono text-xs outline-none focus:border-zinc-400"
          />
        </div>
      )}

      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading ? "Executing..." : "Execute"}
      </Button>

      <div className="mt-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            cURL
          </span>
          <button
            type="button"
            onClick={handleCopyCurl}
            className="rounded border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 hover:bg-zinc-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="custom-scrollbar-light max-h-40 overflow-auto rounded-md border border-zinc-100 bg-zinc-900 p-3 font-mono text-[11px] whitespace-pre-wrap text-zinc-100">
          {curlCommand}
        </pre>
      </div>

      {response && (
        <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              Response
            </span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${statusColor(
                response.statusCode
              )}`}
            >
              {response.statusCode === 0 ? "ERROR" : response.statusCode}
            </span>
          </div>

          {Object.keys(response.headers).length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                Headers
              </p>
              <div className="max-h-32 overflow-auto rounded-md border border-zinc-100 bg-zinc-50 p-2 font-mono text-[11px] text-zinc-600">
                {Object.entries(response.headers).map(
                  ([key, value]): ReactElement => (
                    <div key={key}>
                      <span className="text-zinc-800">{key}</span>: {value}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div>
            <p className="mb-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
              Body
            </p>
            <pre className="custom-scrollbar-light max-h-64 overflow-auto rounded-md border border-zinc-100 bg-zinc-50 p-3 font-mono text-[11px] whitespace-pre-wrap text-zinc-700">
              {formatBody(response.body)}
            </pre>
          </div>
        </div>
      )}
    </form>
  );
}

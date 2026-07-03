"use client";

import { useMemo, useState, type ReactElement } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { EndpointData } from "@/types/swagger";
import {
  assembleRequest,
  paramPlaceholder,
  type FieldValues,
} from "@/lib/swagger/assemble-request";
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
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FieldValues>,
    mode: "onBlur",
  });

  const showBody = bodyMethods.has(endpoint.method);

  const onSubmit = handleSubmit((values: FieldValues): void => {
    const assembled = assembleRequest(endpoint, values, baseUrl, body);
    // eslint-disable-next-line no-console
    console.log("Assembled request:", assembled);
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

      <Button type="submit" size="sm">
        Execute
      </Button>
    </form>
  );
}

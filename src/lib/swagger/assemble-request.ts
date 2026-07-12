import type { EndpointData, EndpointParameter } from "@/types/swagger";

export type FieldValues = Record<string, string>;

export type AssembledRequest = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
};

export function assembleRequest(
  endpoint: EndpointData,
  values: FieldValues,
  baseUrl: string,
  body?: string
): AssembledRequest {
  let path = endpoint.path;
  const query = new URLSearchParams();
  const headers: Record<string, string> = {};

  for (const param of endpoint.parameters) {
    const raw = values[param.name];
    if (raw === undefined || raw === "") continue;

    switch (param.in) {
      case "path":
        path = path.replace(`{${param.name}}`, encodeURIComponent(raw));
        break;
      case "query":
        query.append(param.name, raw);
        break;
      case "header":
        headers[param.name] = raw;
        break;
      case "cookie":
        headers["Cookie"] = headers["Cookie"]
          ? `${headers["Cookie"]}; ${param.name}=${raw}`
          : `${param.name}=${raw}`;
        break;
    }
  }

  const trimmedBase = baseUrl.trim().replace(/\/+$/, "");
  const queryString = query.toString();
  const url = `${trimmedBase}${path}${queryString ? `?${queryString}` : ""}`;

  const hasBody =
    (endpoint.method === "post" || endpoint.method === "put") &&
    Boolean(body && body.trim());

  if (hasBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return {
    method: endpoint.method.toUpperCase(),
    url,
    headers,
    body: hasBody ? body : undefined,
  };
}

export function paramPlaceholder(param: EndpointParameter): string {
  const example = param.schema?.example;
  if (example !== undefined && example !== null) return String(example);
  return param.schema?.type ?? "string";
}

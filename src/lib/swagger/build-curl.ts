import type { AssembledRequest } from "@/lib/swagger/assemble-request";

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export function buildCurl(request: AssembledRequest): string {
  const parts: string[] = [
    `curl -X ${request.method} ${shellQuote(request.url)}`,
  ];

  for (const [key, value] of Object.entries(request.headers)) {
    parts.push(`  -H ${shellQuote(`${key}: ${value}`)}`);
  }

  if (request.body && request.body.trim()) {
    parts.push(`  -d ${shellQuote(request.body)}`);
  }

  return parts.join(" \\\n");
}

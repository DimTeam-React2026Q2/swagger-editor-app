import type { AssembledRequest } from "@/lib/swagger/assemble-request";

// Single-quote a value for safe use inside a shell cURL command.
function shellQuote(value: string): string {
  // Close quote, escaped literal quote, reopen quote — standard POSIX trick.
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

// Builds a copy-pasteable cURL command from an assembled request. Multi-line with backslash continuations for readability.
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

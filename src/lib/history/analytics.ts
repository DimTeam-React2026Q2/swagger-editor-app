/** Byte length of a string using UTF-8 encoding (0 for empty/undefined). */
export function byteLength(text: string | undefined | null): number {
  if (!text) return 0;
  return new TextEncoder().encode(text).length;
}

/**
 * Total byte size of a set of headers as they'd appear on the wire
 * ("Key: Value" pairs). Used for request/response size analytics.
 */
export function headersSize(headers: Record<string, string>): number {
  return Object.entries(headers).reduce(
    (sum, [key, value]): number => sum + byteLength(`${key}: ${value}`),
    0
  );
}

/** Computes elapsed milliseconds from a start timestamp, rounded, never negative. */
export function elapsedMs(start: number, end: number): number {
  return Math.max(0, Math.round(end - start));
}

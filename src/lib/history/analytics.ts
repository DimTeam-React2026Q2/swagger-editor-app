export function byteLength(text: string | undefined | null): number {
  if (!text) return 0;
  return new TextEncoder().encode(text).length;
}

export function headersSize(headers: Record<string, string>): number {
  return Object.entries(headers).reduce(
    (sum, [key, value]): number => sum + byteLength(`${key}: ${value}`),
    0
  );
}

export function elapsedMs(start: number, end: number): number {
  return Math.max(0, Math.round(end - start));
}

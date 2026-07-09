import * as yaml from "js-yaml";
import type { SchemaFormat } from "@/lib/swagger/detect-schema-format";

export interface ConversionResult {
  text: string;
  error: string | null;
}

export function convertSchema(
  text: string,
  from: SchemaFormat,
  to: SchemaFormat
): ConversionResult {
  const trimmed = text.trim();

  // Nothing to do: empty input, unknown side, or same format.
  if (!trimmed || to === "unknown" || from === to) {
    return { text, error: null };
  }

  let parsed: unknown;
  try {
    parsed = from === "json" ? JSON.parse(trimmed) : yaml.load(trimmed);
  } catch (error: unknown) {
    return {
      text,
      error: `Cannot convert: source is not valid ${from.toUpperCase()} (${
        error instanceof Error ? error.message : "parse error"
      }).`,
    };
  }

  if (parsed === null || typeof parsed !== "object") {
    return {
      text,
      error: "Cannot convert: schema must be an object.",
    };
  }

  try {
    const output =
      to === "json"
        ? JSON.stringify(parsed, null, 2)
        : yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true });
    return { text: output, error: null };
  } catch (error: unknown) {
    return {
      text,
      error: `Conversion to ${to.toUpperCase()} failed (${
        error instanceof Error ? error.message : "serialize error"
      }).`,
    };
  }
}

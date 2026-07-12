import YAML from "yaml";

export type SchemaFormat = "json" | "yaml" | "unknown";

export function detectSchemaFormat(input: string): SchemaFormat {
  const trimmed = input.trim();

  if (!trimmed) return "unknown";

  if (isValidJson(trimmed)) return "json";

  if (userIsWrittingJson(trimmed)) return "json";

  if (isValidYaml(trimmed) || userIsWrittingYaml(trimmed)) return "yaml";

  return "unknown";
}

function isValidJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function userIsWrittingJson(text: string): boolean {
  return text.startsWith("{") || text.startsWith("[");
}

function isValidYaml(text: string): boolean {
  try {
    const result = YAML.parse(text);
    return typeof result === "object" && result !== null;
  } catch {
    return false;
  }
}

function userIsWrittingYaml(text: string): boolean {
  return (
    text.startsWith("---") ||
    /^(openapi|swagger)\s*:/m.test(text) ||
    /^[\w.-]+\s*:/m.test(text)
  );
}

import * as yaml from "js-yaml";

export interface SchemaValidation {
  status: "empty" | "valid" | "invalid";
  error: string | null;
}

interface OpenApiShape {
  paths?: unknown;
  openapi?: unknown;
  swagger?: unknown;
}

export function validateSchema(text: string): SchemaValidation {
  const trimmed = text.trim();
  if (!trimmed) return { status: "empty", error: null };

  let parsed: unknown;
  try {
    parsed =
      trimmed.startsWith("{") || trimmed.startsWith("[")
        ? JSON.parse(trimmed)
        : yaml.load(trimmed);
  } catch (error: unknown) {
    return {
      status: "invalid",
      error: error instanceof Error ? error.message : "Failed to parse schema.",
    };
  }

  if (parsed === null || typeof parsed !== "object") {
    return {
      status: "invalid",
      error: "Invalid schema format. Expected an object.",
    };
  }

  const schema = parsed as OpenApiShape;
  if (!schema.paths && !schema.openapi && !schema.swagger) {
    return {
      status: "invalid",
      error:
        "Invalid OpenAPI/Swagger structure. Missing 'paths' root property.",
    };
  }

  return { status: "valid", error: null };
}

import { describe, it, expect } from "vitest";
import { detectSchemaFormat } from "@/lib/swagger/detect-schema-format";

describe("detectSchemaFormat", (): void => {
  it("should return unknown for empty input", (): void => {
    expect(detectSchemaFormat("")).toBe("unknown");
    expect(detectSchemaFormat("   \n  ")).toBe("unknown");
  });

  it("should detect valid JSON schema input", (): void => {
    const jsonSchema = JSON.stringify({
      openapi: "3.0.0",
      info: { title: "Pet Store", version: "1.0.0" },
      paths: {},
    });

    expect(detectSchemaFormat(jsonSchema)).toBe("json");
  });

  it("should detect incomplete JSON while user is typing", (): void => {
    expect(detectSchemaFormat('{"openapi": "3.0.0"')).toBe("json");
    expect(detectSchemaFormat("[\n  {")).toBe("json");
  });

  it("should detect valid YAML schema input", (): void => {
    const yamlSchema = `
openapi: 3.0.0
info:
  title: Pet Store
  version: 1.0.0
paths: {}
`;

    expect(detectSchemaFormat(yamlSchema)).toBe("yaml");
  });

  it("should detect YAML while user is typing OpenAPI content", (): void => {
    expect(detectSchemaFormat("openapi: 3.0.0\npaths:")).toBe("yaml");
    expect(detectSchemaFormat("swagger: '2.0'\ninfo:")).toBe("yaml");
    expect(detectSchemaFormat("---\nopenapi: 3.0.0")).toBe("yaml");
  });

  it("should return unknown for unrecognized text", (): void => {
    expect(detectSchemaFormat("hello world")).toBe("unknown");
    expect(detectSchemaFormat("not a schema")).toBe("unknown");
  });
});

import { describe, it, expect } from "vitest";
import { convertSchema } from "@/lib/swagger/convert-schema";

describe("convertSchema", (): void => {
  const json = '{"openapi":"3.0.0","paths":{"/a":{"get":{}}}}';

  it("returns input unchanged when text is empty", (): void => {
    const r = convertSchema("   ", "json", "yaml");
    expect(r.error).toBeNull();
    expect(r.text).toBe("   ");
  });

  it("returns input unchanged when target format is unknown", (): void => {
    const r = convertSchema(json, "json", "unknown");
    expect(r.error).toBeNull();
    expect(r.text).toBe(json);
  });

  it("returns input unchanged when from === to", (): void => {
    const r = convertSchema(json, "json", "json");
    expect(r.error).toBeNull();
    expect(r.text).toBe(json);
  });

  it("converts JSON to YAML", (): void => {
    const r = convertSchema(json, "json", "yaml");
    expect(r.error).toBeNull();
    expect(r.text).toContain("openapi: 3.0.0");
    expect(r.text).toContain("paths:");
  });

  it("converts YAML to JSON", (): void => {
    const yaml = "openapi: 3.0.0\npaths:\n  /a:\n    get: {}\n";
    const r = convertSchema(yaml, "yaml", "json");
    expect(r.error).toBeNull();
    const parsed = JSON.parse(r.text);
    expect(parsed.openapi).toBe("3.0.0");
  });

  it("round-trips JSON -> YAML -> JSON without data loss", (): void => {
    const toYaml = convertSchema(json, "json", "yaml");
    const backToJson = convertSchema(toYaml.text, "yaml", "json");
    expect(JSON.parse(backToJson.text)).toEqual(JSON.parse(json));
  });

  it("returns an error for invalid JSON source, keeping the original text", (): void => {
    const bad = "{ broken";
    const r = convertSchema(bad, "json", "yaml");
    expect(r.error).toMatch(/not valid JSON/i);
    expect(r.text).toBe(bad);
  });

  it("returns an error for invalid YAML source", (): void => {
    const bad = "key: : : bad";
    const r = convertSchema(bad, "yaml", "json");
    expect(r.error).toMatch(/not valid YAML/i);
    expect(r.text).toBe(bad);
  });

  it("returns an error when parsed source is not an object", (): void => {
    const r = convertSchema('"just a string"', "json", "yaml");
    expect(r.error).toMatch(/must be an object/i);
  });
});

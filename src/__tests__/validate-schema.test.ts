import { describe, it, expect } from "vitest";
import { validateSchema } from "@/lib/swagger/validate-schema";

describe("validateSchema", (): void => {
  it("returns empty status for blank input", (): void => {
    expect(validateSchema("   ").status).toBe("empty");
  });

  it("validates a correct JSON OpenAPI schema", (): void => {
    const r = validateSchema('{"openapi":"3.0.0","paths":{}}');
    expect(r.status).toBe("valid");
    expect(r.error).toBeNull();
  });

  it("validates a correct YAML OpenAPI schema", (): void => {
    const r = validateSchema("openapi: 3.0.0\npaths: {}\n");
    expect(r.status).toBe("valid");
  });

  it("accepts a swagger 2.0 style document", (): void => {
    expect(validateSchema('{"swagger":"2.0","paths":{}}').status).toBe("valid");
  });

  it("flags invalid JSON as invalid with a parse error", (): void => {
    const r = validateSchema("{ broken");
    expect(r.status).toBe("invalid");
    expect(r.error).toBeTruthy();
  });

  it("flags a non-object schema (e.g. a bare string)", (): void => {
    const r = validateSchema('"a string"');
    expect(r.status).toBe("invalid");
    expect(r.error).toMatch(/expected an object/i);
  });

  it("flags an object missing paths/openapi/swagger", (): void => {
    const r = validateSchema('{"foo":"bar"}');
    expect(r.status).toBe("invalid");
    expect(r.error).toMatch(/OpenAPI\/Swagger structure/i);
  });

  it("flags invalid YAML as invalid", (): void => {
    const r = validateSchema("key: : : bad");
    expect(r.status).toBe("invalid");
  });
});

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSwaggerParser } from "@/hooks/useSwaggerParser";
import { EndpointData } from "@/types/swagger";

describe("useSwaggerParser hook logic", (): void => {
  it("should return empty endpoints array when schema text is empty", (): void => {
    const { result } = renderHook(() => useSwaggerParser(""));

    expect(result.current.endpoints).toEqual([]);
    expect(result.current.validationError).toBeNull();
    expect(result.current.isYaml).toBe(false);
  });

  it("should correctly parse valid OpenAPI JSON schema", (): void => {
    const jsonSchema: string = JSON.stringify({
      openapi: "3.0.0",
      paths: {
        "/users": {
          get: { summary: "Get users" },
        },
      },
    });

    const { result } = renderHook(() => useSwaggerParser(jsonSchema));

    expect(result.current.endpoints).toHaveLength(1);

    const endpoint: EndpointData = result.current.endpoints[0];
    expect(endpoint.path).toBe("/users");
    expect(endpoint.method).toBe("get");
    expect(result.current.validationError).toBeNull();
    expect(result.current.isYaml).toBe(false);
  });

  it("should correctly parse valid OpenAPI YAML schema", (): void => {
    const yamlSchema = `
openapi: 3.0.0
paths:
  /pets:
    post:
      summary: Add pet
    `;

    const { result } = renderHook(() => useSwaggerParser(yamlSchema));

    expect(result.current.endpoints).toHaveLength(1);

    const endpoint: EndpointData = result.current.endpoints[0];
    expect(endpoint.path).toBe("/pets");
    expect(endpoint.method).toBe("post");
    expect(result.current.validationError).toBeNull();
    expect(result.current.isYaml).toBe(true);
  });

  it("should catch syntax errors gracefully and return validation error string", (): void => {
    const brokenYaml = `
openapi: 3.0.0
paths:
  /broken
    get: [unclosed bracket
    `;

    const { result } = renderHook(() => useSwaggerParser(brokenYaml));

    expect(result.current.endpoints).toEqual([]);
    expect(result.current.validationError).not.toBeNull();
  });
});

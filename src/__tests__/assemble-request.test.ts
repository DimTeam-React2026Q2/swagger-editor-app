import { describe, it, expect } from "vitest";
import {
  assembleRequest,
  paramPlaceholder,
} from "@/lib/swagger/assemble-request";
import type { EndpointData, EndpointParameter } from "@/types/swagger";

function makeEndpoint(overrides: Partial<EndpointData> = {}): EndpointData {
  return {
    id: "get-/posts",
    path: "/posts",
    method: "get",
    summary: "",
    parameters: [],
    responses: {},
    ...overrides,
  } as EndpointData;
}

function param(overrides: Partial<EndpointParameter>): EndpointParameter {
  return {
    name: "x",
    in: "query",
    required: false,
    schema: { type: "string" },
    ...overrides,
  } as EndpointParameter;
}

describe("assembleRequest", (): void => {
  it("builds a plain GET url with trimmed base", (): void => {
    const r = assembleRequest(makeEndpoint(), {}, "https://api.test.com/");
    expect(r.method).toBe("GET");
    expect(r.url).toBe("https://api.test.com/posts");
    expect(r.body).toBeUndefined();
  });

  it("appends query parameters", (): void => {
    const ep = makeEndpoint({
      parameters: [param({ name: "userId", in: "query" })],
    });
    const r = assembleRequest(ep, { userId: "1" }, "https://api.test.com");
    expect(r.url).toBe("https://api.test.com/posts?userId=1");
  });

  it("substitutes path parameters (encoded)", (): void => {
    const ep = makeEndpoint({
      path: "/posts/{id}",
      parameters: [param({ name: "id", in: "path", required: true })],
    });
    const r = assembleRequest(ep, { id: "a b" }, "https://api.test.com");
    expect(r.url).toBe("https://api.test.com/posts/a%20b");
  });

  it("sets header parameters", (): void => {
    const ep = makeEndpoint({
      parameters: [param({ name: "X-Key", in: "header" })],
    });
    const r = assembleRequest(
      ep,
      { "X-Key": "secret" },
      "https://api.test.com"
    );
    expect(r.headers["X-Key"]).toBe("secret");
  });

  it("accumulates multiple cookie parameters into one Cookie header", (): void => {
    const ep = makeEndpoint({
      parameters: [
        param({ name: "a", in: "cookie" }),
        param({ name: "b", in: "cookie" }),
      ],
    });
    const r = assembleRequest(ep, { a: "1", b: "2" }, "https://api.test.com");
    expect(r.headers["Cookie"]).toBe("a=1; b=2");
  });

  it("skips empty/undefined parameter values", (): void => {
    const ep = makeEndpoint({
      parameters: [param({ name: "userId", in: "query" })],
    });
    const r = assembleRequest(ep, { userId: "" }, "https://api.test.com");
    expect(r.url).toBe("https://api.test.com/posts");
  });

  it("includes a JSON body and Content-Type for POST", (): void => {
    const ep = makeEndpoint({ id: "post-/posts", method: "post" });
    const r = assembleRequest(ep, {}, "https://api.test.com", '{"a":1}');
    expect(r.method).toBe("POST");
    expect(r.body).toBe('{"a":1}');
    expect(r.headers["Content-Type"]).toBe("application/json");
  });

  it("omits the body for GET even if provided", (): void => {
    const r = assembleRequest(
      makeEndpoint(),
      {},
      "https://api.test.com",
      '{"a":1}'
    );
    expect(r.body).toBeUndefined();
  });
});

describe("paramPlaceholder", (): void => {
  it("uses the schema example when present", (): void => {
    expect(
      paramPlaceholder(param({ schema: { type: "string", example: "42" } }))
    ).toBe("42");
  });

  it("falls back to the type when no example", (): void => {
    expect(paramPlaceholder(param({ schema: { type: "integer" } }))).toBe(
      "integer"
    );
  });

  it("falls back to 'string' when no schema info", (): void => {
    const p = { name: "x", in: "query", required: false } as EndpointParameter;
    expect(paramPlaceholder(p)).toBe("string");
  });
});

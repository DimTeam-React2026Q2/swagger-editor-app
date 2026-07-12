import { describe, it, expect } from "vitest";
import { buildCurl } from "@/lib/swagger/build-curl";
import type { AssembledRequest } from "@/lib/swagger/assemble-request";

function req(overrides: Partial<AssembledRequest> = {}): AssembledRequest {
  return {
    method: "GET",
    url: "https://api.test.com/posts",
    headers: {},
    ...overrides,
  };
}

describe("buildCurl", (): void => {
  it("builds a basic GET command", (): void => {
    expect(buildCurl(req())).toBe("curl -X GET 'https://api.test.com/posts'");
  });

  it("adds header flags", (): void => {
    const c = buildCurl(
      req({ headers: { "Content-Type": "application/json" } })
    );
    expect(c).toContain("-H 'Content-Type: application/json'");
  });

  it("adds a data flag when a body is present", (): void => {
    const c = buildCurl(req({ method: "POST", headers: {}, body: '{"a":1}' }));
    expect(c).toContain("curl -X POST");
    expect(c).toContain("-d '{\"a\":1}'");
  });

  it("omits the data flag for an empty/whitespace body", (): void => {
    const c = buildCurl(req({ body: "   " }));
    expect(c).not.toContain("-d");
  });

  it("escapes single quotes in values", (): void => {
    const c = buildCurl(req({ url: "https://api.test.com/a'b" }));
    // The single quote is closed, escaped, and reopened.
    expect(c).toContain("'\\''");
  });
});

import { describe, it, expect } from "vitest";
import { byteLength, headersSize, elapsedMs } from "@/lib/history/analytics";

describe("byteLength", (): void => {
  it("returns 0 for empty, null, or undefined", (): void => {
    expect(byteLength("")).toBe(0);
    expect(byteLength(undefined)).toBe(0);
    expect(byteLength(null)).toBe(0);
  });

  it("counts ASCII characters as one byte each", (): void => {
    expect(byteLength("hello")).toBe(5);
    expect(byteLength("GET /users")).toBe(10);
  });

  it("counts multi-byte UTF-8 characters correctly", (): void => {
    // "é" is 2 bytes in UTF-8, "字" is 3 bytes.
    expect(byteLength("é")).toBe(2);
    expect(byteLength("字")).toBe(3);
  });
});

describe("headersSize", (): void => {
  it("returns 0 for no headers", (): void => {
    expect(headersSize({})).toBe(0);
  });

  it("sums 'Key: Value' byte lengths", (): void => {
    // "a: b" = 4 bytes
    expect(headersSize({ a: "b" })).toBe(4);
    // "Content-Type: application/json" = 30 bytes
    expect(headersSize({ "Content-Type": "application/json" })).toBe(30);
  });

  it("adds up multiple headers", (): void => {
    const size = headersSize({ a: "b", c: "d" });
    expect(size).toBe(8);
  });
});

describe("elapsedMs", (): void => {
  it("computes rounded elapsed milliseconds", (): void => {
    expect(elapsedMs(1000, 1500)).toBe(500);
    expect(elapsedMs(1000, 1000.6)).toBe(1);
  });

  it("never returns a negative value", (): void => {
    expect(elapsedMs(2000, 1000)).toBe(0);
  });
});

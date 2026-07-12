import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the session + supabase modules the storage functions depend on.
const getCurrentUser = vi.fn();
const upsert = vi.fn();
const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ upsert, select }));
const createClient = vi.fn(async () => ({ from }));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: (): unknown => getCurrentUser(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: (): unknown => createClient(),
}));

import { saveSchema, loadSchema } from "@/lib/swagger/schema-storage";

beforeEach((): void => {
  vi.clearAllMocks();
});

describe("saveSchema", (): void => {
  it("returns an error when the user is not signed in", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue(null);
    const r = await saveSchema("content", "json");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/signed in/i);
  });

  it("upserts and returns ok for a signed-in user", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    upsert.mockResolvedValue({ error: null });
    const r = await saveSchema("content", "yaml");
    expect(from).toHaveBeenCalledWith("schemas");
    expect(upsert).toHaveBeenCalled();
    expect(r.ok).toBe(true);
    expect(r.error).toBeNull();
  });

  it("returns the DB error message when upsert fails", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    upsert.mockResolvedValue({ error: { message: "boom" } });
    const r = await saveSchema("content", "json");
    expect(r.ok).toBe(false);
    expect(r.error).toBe("boom");
  });
});

describe("loadSchema", (): void => {
  it("returns null when not signed in", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue(null);
    expect(await loadSchema()).toBeNull();
  });

  it("returns the saved schema for a signed-in user", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    maybeSingle.mockResolvedValue({
      data: { content: "abc", format: "yaml" },
      error: null,
    });
    const r = await loadSchema();
    expect(r).toEqual({ content: "abc", format: "yaml" });
  });

  it("returns null when the query errors", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    maybeSingle.mockResolvedValue({ data: null, error: { message: "x" } });
    expect(await loadSchema()).toBeNull();
  });
});

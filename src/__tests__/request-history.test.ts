import { describe, it, expect, vi, beforeEach } from "vitest";

const getCurrentUser = vi.fn();
const insert = vi.fn();
const order = vi.fn();
const eq = vi.fn(() => ({ order }));
const select = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ insert, select }));
const createClient = vi.fn(async () => ({ from }));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: (): unknown => getCurrentUser(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: (): unknown => createClient(),
}));

import { recordRequest, loadHistory } from "@/lib/history/request-history";

const input = {
  method: "GET",
  url: "https://api.test.com/posts",
  endpoint: "/posts",
  statusCode: 200,
  durationMs: 120,
  requestSize: 50,
  responseSize: 500,
  error: null,
};

beforeEach((): void => {
  vi.clearAllMocks();
});

describe("recordRequest", (): void => {
  it("does nothing when the user is not signed in", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue(null);
    await recordRequest(input);
    expect(from).not.toHaveBeenCalled();
  });

  it("inserts a row for a signed-in user", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    insert.mockResolvedValue({ error: null });
    await recordRequest(input);
    expect(from).toHaveBeenCalledWith("request_history");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "u1",
        method: "GET",
        url: "https://api.test.com/posts",
        endpoint: "/posts",
        status_code: 200,
        duration_ms: 120,
        request_size: 50,
        response_size: 500,
      })
    );
  });

  it("swallows errors so it never breaks the request", async (): Promise<void> => {
    getCurrentUser.mockRejectedValue(new Error("db down"));
    await expect(recordRequest(input)).resolves.toBeUndefined();
  });
});

describe("loadHistory", (): void => {
  it("returns an empty array when not signed in", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue(null);
    expect(await loadHistory()).toEqual([]);
  });

  it("returns rows for a signed-in user", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    const rows = [{ id: "1", method: "GET" }];
    order.mockResolvedValue({ data: rows, error: null });
    const r = await loadHistory();
    expect(from).toHaveBeenCalledWith("request_history");
    expect(r).toEqual(rows);
  });

  it("returns an empty array when the query errors", async (): Promise<void> => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    order.mockResolvedValue({ data: null, error: { message: "x" } });
    expect(await loadHistory()).toEqual([]);
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HistoryList from "@/components/history/HistoryList";
import type { RequestHistoryEntry } from "@/lib/history/request-history";

// Locale-aware Link renders as a plain anchor in tests.
vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }): React.ReactElement => <a href={href}>{children}</a>,
}));

const entry: RequestHistoryEntry = {
  id: "1",
  method: "GET",
  url: "https://api.example.com/users",
  endpoint: "/users",
  status_code: 200,
  duration_ms: 350,
  request_size: 100,
  response_size: 2048,
  error: null,
  created_at: new Date("2026-01-01T10:00:00Z").toISOString(),
};

describe("HistoryList", (): void => {
  it("shows an informational empty state with links when there are no entries", (): void => {
    render(<HistoryList entries={[]} />);
    expect(screen.getByText(/no requests yet/i)).toBeInTheDocument();
    expect(screen.getByText(/go to editor/i)).toBeInTheDocument();
    expect(screen.getByText(/open viewer/i)).toBeInTheDocument();
  });

  it("renders a row with analytics for each entry", (): void => {
    render(<HistoryList entries={[entry]} />);
    expect(screen.getByText("GET")).toBeInTheDocument();
    expect(screen.getByText("/users")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("350 ms")).toBeInTheDocument();
    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
  });

  it("shows error text when an entry has an error", (): void => {
    const errored: RequestHistoryEntry = {
      ...entry,
      id: "2",
      status_code: 0,
      error: "Network error: timeout",
    };
    render(<HistoryList entries={[errored]} />);
    expect(screen.getByText(/network error: timeout/i)).toBeInTheDocument();
    expect(screen.getByText("ERR")).toBeInTheDocument();
  });
});

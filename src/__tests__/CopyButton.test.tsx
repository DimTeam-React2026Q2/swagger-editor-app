import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import CopyButton from "@/components/swagger/CopyButton";

describe("CopyButton", (): void => {
  beforeEach((): void => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("renders the given label by default", (): void => {
    renderWithIntl(<CopyButton value="abc" label="Copy" />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("writes the value to the clipboard and shows the copied state on click", async (): Promise<void> => {
    renderWithIntl(<CopyButton value="hello" label="Copy" />);
    fireEvent.click(screen.getByRole("button"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
    await waitFor((): void => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  it("stays uncopied if the clipboard write fails", async (): Promise<void> => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    renderWithIntl(<CopyButton value="x" label="Copy" />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor((): void => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });
});

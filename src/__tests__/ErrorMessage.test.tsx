import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "@/components/ui/ErrorMessage";

describe("ErrorMessage", (): void => {
  it("renders the message text with an alert role", (): void => {
    render(<ErrorMessage message="Something went wrong" />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Something went wrong");
  });

  it("applies an extra className when provided", (): void => {
    render(<ErrorMessage message="Oops" className="mt-4" />);
    expect(screen.getByRole("alert")).toHaveClass("mt-4");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageToggle from "@/components/i18n/LanguageToggle";

const replace = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: (): string => "en",
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: (): string => "/history",
  useRouter: (): { replace: typeof replace } => ({ replace }),
}));

describe("LanguageToggle", (): void => {
  beforeEach((): void => {
    replace.mockClear();
  });

  it("renders both locale buttons with the active one pressed", (): void => {
    render(<LanguageToggle />);
    const en = screen.getByRole("button", { name: "en" });
    const ru = screen.getByRole("button", { name: "ru" });
    expect(en).toHaveAttribute("aria-pressed", "true");
    expect(ru).toHaveAttribute("aria-pressed", "false");
  });

  it("switches to the other locale, preserving the path", (): void => {
    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole("button", { name: "ru" }));
    expect(replace).toHaveBeenCalledWith("/history", { locale: "ru" });
  });

  it("does nothing when clicking the already-active locale", (): void => {
    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole("button", { name: "en" }));
    expect(replace).not.toHaveBeenCalled();
  });
});

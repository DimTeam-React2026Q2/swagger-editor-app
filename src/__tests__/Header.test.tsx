import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import React, { ReactElement } from "react";
import Header from "@/ui/header";

const LINK = "link";
const BUTTON = "button";
const IMG = "img";
const BANNER = "banner";

vi.mock(
  "next/image",
  (): Record<string, unknown> => ({
    default: ({ alt }: { alt: string }): ReactElement => (
      <span role="img" aria-label={alt} />
    ),
  })
);

vi.mock(
  "@/i18n/navigation",
  (): Record<string, unknown> => ({
    Link: ({
      href,
      children,
      className,
    }: {
      href: string;
      children: React.ReactNode;
      className?: string;
    }): ReactElement => (
      <a href={href} className={className}>
        {children}
      </a>
    ),
  })
);

vi.mock(
  "@/components/auth/SignOutButton",
  (): Record<string, unknown> => ({
    default: (): ReactElement => <button type="button">Sign out</button>,
  })
);

const HEADER_LABELS: Record<string, string> = {
  about: "About",
  history: "History",
  signIn: "Sign in",
  signUp: "Sign up",
  signOut: "Sign out",
};

vi.mock(
  "next-intl",
  (): Record<string, unknown> => ({
    useTranslations:
      () =>
      (key: string): string =>
        HEADER_LABELS[key] ?? key,
  })
);

vi.mock(
  "@/components/i18n/LanguageToggle",
  (): Record<string, unknown> => ({
    default: (): ReactElement => <div data-testid="language-toggle" />,
  })
);

const setScrollY = (value: number): void => {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
};

describe("Header component", (): void => {
  beforeEach((): void => {
    setScrollY(0);
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("should render logo link to home and About navigation", (): void => {
    render(<Header isLoggedin={false} />);

    expect(screen.getByRole(LINK, { name: /Swagger/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole(LINK, { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
    expect(screen.getByRole(IMG, { name: "Swagger logo" })).toBeInTheDocument();
  });

  it("should show Sign in and Sign up when user is not logged in", (): void => {
    render(<Header isLoggedin={false} />);

    expect(screen.getByRole(LINK, { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in"
    );
    expect(screen.getByRole(LINK, { name: "Sign up" })).toHaveAttribute(
      "href",
      "/sign-up"
    );
    expect(screen.queryByRole(LINK, { name: "History" })).toBeNull();
    expect(screen.queryByRole(BUTTON, { name: "Sign out" })).toBeNull();
  });

  it("should show History and Sign out when user is logged in", (): void => {
    render(<Header isLoggedin={true} />);

    expect(screen.getByRole(LINK, { name: "History" })).toHaveAttribute(
      "href",
      "/history"
    );
    expect(screen.getByRole(BUTTON, { name: "Sign out" })).toBeInTheDocument();
    expect(screen.queryByRole(LINK, { name: "Sign in" })).toBeNull();
    expect(screen.queryByRole(LINK, { name: "Sign up" })).toBeNull();
  });
});

describe("Header sticky behavior", (): void => {
  beforeEach((): void => {
    setScrollY(0);
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("should remain sticky at the top of the viewport", (): void => {
    render(<Header isLoggedin={false} />);

    const header = screen.getByRole(BANNER);
    expect(header).toHaveClass("sticky", "top-0", "z-50");
  });

  it("should use the default background color at scroll position zero", (): void => {
    render(<Header isLoggedin={false} />);

    expect(screen.getByRole(BANNER)).toHaveClass("bg-[#173647]");
  });

  it("should animate background color when page is scrolled", (): void => {
    render(<Header isLoggedin={false} />);

    const header = screen.getByRole(BANNER);
    expect(header).toHaveClass("transition-colors", "duration-300");

    setScrollY(120);

    act((): void => {
      fireEvent.scroll(window);
    });

    expect(header).toHaveClass("bg-[#0f2530]");
    expect(header).not.toHaveClass("bg-[#173647]");
  });

  it("should remove scroll listener on unmount", (): void => {
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<Header isLoggedin={false} />);
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});

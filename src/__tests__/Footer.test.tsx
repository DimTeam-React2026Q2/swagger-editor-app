import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import React, { ReactElement } from "react";
import Footer from "@/ui/footer";

const LINK = "link";
const CONTENTINFO = "contentinfo";

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

describe("Footer component", (): void => {
  it("should render About link pointing to the about page", (): void => {
    renderWithIntl(<Footer />);

    expect(screen.getByRole(LINK, { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
  });

  it("should render as a centered footer with app styling", (): void => {
    renderWithIntl(<Footer />);

    const footer = screen.getByRole(CONTENTINFO);
    expect(footer).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "bg-[#173647]",
      "p-5",
      "text-white"
    );
  });
});

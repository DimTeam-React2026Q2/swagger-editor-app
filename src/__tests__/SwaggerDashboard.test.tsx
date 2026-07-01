import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import React, { ReactElement } from "react";

vi.mock(
  "react-resizable-panels",
  (): Record<string, unknown> => ({
    Group: ({
      children,
      orientation,
    }: {
      children: React.ReactNode;
      orientation: string;
    }): ReactElement => (
      <div data-testid="mock-group" data-orientation={orientation}>
        {children}
      </div>
    ),
    Panel: ({ children }: { children: React.ReactNode }): ReactElement => (
      <div data-testid="mock-panel">{children}</div>
    ),
    Separator: (): ReactElement => <div data-testid="mock-handle" />,
  })
);

vi.mock(
  "../swagger/SwaggerEditor",
  (): Record<string, unknown> => ({
    SwaggerEditor: ({
      value,
      onChange,
    }: {
      value: string;
      onChange: (v: string) => void;
    }): ReactElement => (
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
          onChange(e.target.value)
        }
      />
    ),
  })
);

describe("SwaggerDashboard responsive layout", (): void => {
  beforeEach((): void => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should render both editor and viewer sections inside layout", async (): Promise<void> => {
    window.matchMedia = vi.fn().mockImplementation(
      (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn() as unknown as (event: Event) => boolean,
      })
    );

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    render(<SwaggerDashboardComponent />);

    expect(
      screen.getByText("Swagger UI // API Documentation")
    ).toBeInTheDocument();

    const group = screen.getByTestId("mock-group");
    expect(group).toHaveAttribute("data-orientation", "horizontal");
  });

  it("should trigger addEventListener and update state when screen orientation changes", async (): Promise<void> => {
    let changeCallback: (e: MediaQueryListEvent) => void = (): void => {};

    window.matchMedia = vi.fn().mockImplementation(
      (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(
          (event: string, callback: EventListener): void => {
            if (event === "change") {
              changeCallback = callback as unknown as (
                e: MediaQueryListEvent
              ) => void;
            }
          }
        ),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn() as unknown as (event: Event) => boolean,
      })
    );

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    render(<SwaggerDashboardComponent />);

    act((): void => {
      changeCallback({
        matches: true,
        media: "max-width: 767px",
      } as MediaQueryListEvent);
    });

    const group = screen.getByTestId("mock-group");
    expect(group).toHaveAttribute("data-orientation", "vertical");
  });

  it("should remove event listener when component unmounts", async (): Promise<void> => {
    const removeSpy = vi.fn<(type: string, listener: EventListener) => void>();

    window.matchMedia = vi.fn().mockImplementation(
      (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: removeSpy as unknown as (
          type: string,
          listener: EventListener
        ) => void,
        dispatchEvent: vi.fn() as unknown as (event: Event) => boolean,
      })
    );

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    const { unmount } = render(<SwaggerDashboardComponent />);
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should execute onChange handlers and cover line 105 when typing schema text", async (): Promise<void> => {
    window.matchMedia = vi.fn().mockImplementation(
      (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn() as unknown as (event: Event) => boolean,
      })
    );

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    render(<SwaggerDashboardComponent />);

    const textarea = screen.getByRole("textbox");

    act((): void => {
      fireEvent.change(textarea, { target: { value: "openapi: 3.0.0" } });
    });

    expect(textarea).toHaveValue("openapi: 3.0.0");
  });
});

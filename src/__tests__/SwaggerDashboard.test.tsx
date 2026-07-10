import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, act, fireEvent, waitFor } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
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
    renderWithIntl(<SwaggerDashboardComponent />);

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
    renderWithIntl(<SwaggerDashboardComponent />);

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
    const { unmount } = renderWithIntl(<SwaggerDashboardComponent />);
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
    renderWithIntl(<SwaggerDashboardComponent />);

    const textarea = screen.getByRole("textbox");

    act((): void => {
      fireEvent.change(textarea, { target: { value: "openapi: 3.0.0" } });
    });

    expect(textarea).toHaveValue("openapi: 3.0.0");
  });
});

describe("SwaggerDashboard schema input", (): void => {
  const mockMatchMedia = (): void => {
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
  };

  beforeEach((): void => {
    vi.resetModules();
    vi.clearAllMocks();
    mockMatchMedia();
  });

  it("should accept pasted JSON schema text in the editor", async (): Promise<void> => {
    const jsonSchema = JSON.stringify({ openapi: "3.0.0", paths: {} });

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    renderWithIntl(<SwaggerDashboardComponent />);

    const textarea = screen.getByRole("textbox");

    act((): void => {
      fireEvent.change(textarea, { target: { value: jsonSchema } });
    });

    expect(textarea).toHaveValue(jsonSchema);
  });

  it("should accept pasted YAML schema text in the editor", async (): Promise<void> => {
    const yamlSchema = "openapi: 3.0.0\npaths:\n  /pets:\n    get: {}";

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    renderWithIntl(<SwaggerDashboardComponent />);

    const textarea = screen.getByRole("textbox");

    act((): void => {
      fireEvent.change(textarea, { target: { value: yamlSchema } });
    });

    expect(textarea).toHaveValue(yamlSchema);
  });

  it("should display json format label when JSON schema is pasted", async (): Promise<void> => {
    const jsonSchema = JSON.stringify({ openapi: "3.0.0", paths: {} });

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    renderWithIntl(<SwaggerDashboardComponent />);

    act((): void => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: jsonSchema },
      });
    });

    expect(screen.getByText("json")).toBeInTheDocument();
  });

  it("should display yaml format label when YAML schema is pasted", async (): Promise<void> => {
    const yamlSchema = "openapi: 3.0.0\npaths:\n  /pets:\n    get: {}";

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    renderWithIntl(<SwaggerDashboardComponent />);

    act((): void => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: yamlSchema },
      });
    });

    expect(screen.getByText("yaml")).toBeInTheDocument();
  });

  it("should load uploaded JSON file content into the editor", async (): Promise<void> => {
    const fileContent = JSON.stringify({ openapi: "3.0.0", paths: {} });

    class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onload: (() => void) | null = null;

      readAsText(): void {
        this.result = fileContent;
        this.onload?.();
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    renderWithIntl(<SwaggerDashboardComponent />);

    const file = new File([fileContent], "schema.json", {
      type: "application/json",
    });
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    act((): void => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor((): void => {
      expect(screen.getByRole("textbox")).toHaveValue(fileContent);
    });

    vi.unstubAllGlobals();
  });

  it("should load uploaded YAML file content into the editor", async (): Promise<void> => {
    const fileContent = "openapi: 3.0.0\npaths:\n  /pets:\n    get: {}";

    class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onload: (() => void) | null = null;

      readAsText(): void {
        this.result = fileContent;
        this.onload?.();
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    const { default: SwaggerDashboardComponent } =
      await import("@/components/swagger/SwaggerDashboard");
    renderWithIntl(<SwaggerDashboardComponent />);

    const file = new File([fileContent], "schema.yaml", {
      type: "application/x-yaml",
    });
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    act((): void => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor((): void => {
      expect(screen.getByRole("textbox")).toHaveValue(fileContent);
    });

    vi.unstubAllGlobals();
  });
});

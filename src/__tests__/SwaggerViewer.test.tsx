import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React, { ReactElement } from "react";
import { SwaggerViewer } from "@/components/swagger/SwaggerViewer";
import { useSwaggerParser } from "@/hooks/useSwaggerParser";

vi.mock("@/hooks/useSwaggerParser", () => ({
  useSwaggerParser: vi.fn(),
}));

vi.mock("@/components/swagger/EndpointDetails", () => ({
  EndpointDetails: ({
    endpoint,
  }: {
    endpoint: { path: string };
  }): ReactElement => <div data-testid="mock-details">{endpoint.path}</div>,
}));

vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: { children: React.ReactNode }): ReactElement => (
    <div>{children}</div>
  ),
  AccordionItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }): ReactElement => <div data-value={value}>{children}</div>,
  AccordionTrigger: ({
    children,
  }: {
    children: React.ReactNode;
  }): ReactElement => <div>{children}</div>,
  AccordionContent: ({
    children,
  }: {
    children: React.ReactNode;
  }): ReactElement => <div>{children}</div>,
}));

describe("SwaggerViewer component", (): void => {
  it("should render placeholder when no endpoints are parsed", (): void => {
    vi.mocked(useSwaggerParser).mockReturnValue({
      endpoints: [],
      validationError: null,
      isYaml: false,
    });

    render(<SwaggerViewer schemaText="" />);

    expect(screen.getByText("No API Definition Detected")).toBeInTheDocument();
  });

  it("should render error message when validation fails", (): void => {
    vi.mocked(useSwaggerParser).mockReturnValue({
      endpoints: [],
      validationError: "YAMLException: unclosed bracket",
      isYaml: true,
    });

    render(<SwaggerViewer schemaText="broken: [" />);

    expect(screen.getByText("Schema Validation Error")).toBeInTheDocument();
    expect(
      screen.getByText("YAMLException: unclosed bracket")
    ).toBeInTheDocument();
  });

  it("should render parsed endpoints inside accordion group", (): void => {
    vi.mocked(useSwaggerParser).mockReturnValue({
      endpoints: [
        {
          id: "get-/users",
          path: "/users",
          method: "get",
          summary: "Get users",
          parameters: [],
          responses: {},
        },
        {
          id: "post-/users",
          path: "/users",
          method: "post",
          summary: "Create user",
          parameters: [],
          responses: {},
        },
      ],
      validationError: null,
      isYaml: false,
    });

    render(<SwaggerViewer schemaText="valid-json-content" />);

    expect(screen.getByText("Detected 2 endpoints")).toBeInTheDocument();
    const details = screen.getAllByTestId("mock-details");
    expect(details).toHaveLength(2);
  });
});

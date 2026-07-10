import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import { EndpointDetails } from "@/components/swagger/EndpointDetails";
import { EndpointData } from "@/types/swagger";
import { Accordion } from "@/components/ui/accordion";

describe("EndpointDetails component documentation sections", (): void => {
  const mockEndpoint: EndpointData = {
    id: "get-/api/test",
    path: "/api/test",
    method: "get",
    summary: "Test operation summary",
    parameters: [
      {
        name: "userId",
        in: "query",
        required: true,
        schema: { type: "string", example: "123" },
      },
    ],
    requestBodySchema: {
      "application/json": {
        schema: { type: "object" },
      },
    },
    responses: {
      "200": {
        description: "Success response",
        schema: { type: "object" },
      },
    },
  };

  it("should correctly render parameters table with required marks", (): void => {
    renderWithIntl(
      <Accordion type="single" collapsible defaultValue="get-/api/test">
        <EndpointDetails endpoint={mockEndpoint} />
      </Accordion>
    );

    expect(screen.getByText("Parameters")).toBeInTheDocument();
    const paramsTable = screen.getByRole("table");
    expect(within(paramsTable).getByText("userId")).toBeInTheDocument();
    expect(within(paramsTable).getByText("* required")).toBeInTheDocument();
    expect(within(paramsTable).getByText("query")).toBeInTheDocument();
  });

  it("should render request body section if schema is provided", (): void => {
    renderWithIntl(
      <Accordion type="single" collapsible defaultValue="get-/api/test">
        <EndpointDetails endpoint={mockEndpoint} />
      </Accordion>
    );

    expect(screen.getByText("Request Body")).toBeInTheDocument();
  });

  it("should correctly render responses status codes and descriptions", (): void => {
    renderWithIntl(
      <Accordion type="single" collapsible defaultValue="get-/api/test">
        <EndpointDetails endpoint={mockEndpoint} />
      </Accordion>
    );

    expect(screen.getByText("Responses")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("— Success response")).toBeInTheDocument();
  });

  it("should apply correct styling classes for POST method", (): void => {
    const postMock: EndpointData = {
      ...mockEndpoint,
      id: "post-/api/test",
      method: "post",
    };
    renderWithIntl(
      <Accordion type="single" collapsible defaultValue="post-/api/test">
        <EndpointDetails endpoint={postMock} />
      </Accordion>
    );

    const badge = screen.getByText("post");
    expect(badge).toHaveClass("bg-blue-500");
  });

  it("should apply correct styling classes for PUT and DELETE methods", (): void => {
    const putMock: EndpointData = {
      ...mockEndpoint,
      id: "put-/api/test",
      method: "put",
    };
    const { unmount } = renderWithIntl(
      <Accordion type="single" collapsible defaultValue="put-/api/test">
        <EndpointDetails endpoint={putMock} />
      </Accordion>
    );
    expect(screen.getByText("put")).toHaveClass("bg-amber-500");
    unmount();

    const deleteMock: EndpointData = {
      ...mockEndpoint,
      id: "delete-/api/test",
      method: "delete",
    };
    renderWithIntl(
      <Accordion type="single" collapsible defaultValue="delete-/api/test">
        <EndpointDetails endpoint={deleteMock} />
      </Accordion>
    );
    expect(screen.getByText("delete")).toHaveClass("bg-rose-500");
  });
  it("should render empty placeholder when parameters list is empty", (): void => {
    const emptyParamsMock: EndpointData = {
      ...mockEndpoint,
      id: "get-/api/empty",
      parameters: [],
    };

    renderWithIntl(
      <Accordion type="single" collapsible defaultValue="get-/api/empty">
        <EndpointDetails endpoint={emptyParamsMock} />
      </Accordion>
    );

    expect(
      screen.getByText("No parameters required for this operation.")
    ).toBeInTheDocument();
  });
});

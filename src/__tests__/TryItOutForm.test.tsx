import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import TryItOutForm from "@/components/swagger/TryItOutForm";
import type { EndpointData } from "@/types/swagger";

const getEndpoint: EndpointData = {
  id: "get-/posts",
  path: "/posts",
  method: "get",
  summary: "",
  parameters: [
    {
      name: "userId",
      in: "query",
      required: false,
      schema: { type: "string", example: "1" },
    },
  ],
  responses: { "200": { description: "OK" } },
};

describe("TryItOutForm", (): void => {
  beforeEach((): void => {
    vi.restoreAllMocks();
  });

  it("renders the base URL field and a cURL preview", (): void => {
    renderWithIntl(<TryItOutForm endpoint={getEndpoint} />);
    expect(
      screen.getByPlaceholderText("https://api.example.com")
    ).toBeInTheDocument();
    expect(screen.getByText(/curl -X GET/i)).toBeInTheDocument();
  });

  it("executes the request and displays the response", async (): Promise<void> => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async (): Promise<unknown> => ({
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: '{"ok":true}',
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<TryItOutForm endpoint={getEndpoint} />);
    fireEvent.click(screen.getByRole("button", { name: /execute/i }));

    await waitFor((): void => {
      expect(screen.getByText("200")).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/proxy",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(screen.getByText(/content-type/i)).toBeInTheDocument();
  });

  it("shows an error response when the proxy fetch throws", async (): Promise<void> => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    renderWithIntl(<TryItOutForm endpoint={getEndpoint} />);
    fireEvent.click(screen.getByRole("button", { name: /execute/i }));

    await waitFor((): void => {
      expect(screen.getByText(/ERROR/)).toBeInTheDocument();
    });
  });

  it("renders a JSON body textarea for POST endpoints", (): void => {
    const postEndpoint: EndpointData = {
      ...getEndpoint,
      id: "post-/posts",
      method: "post",
      parameters: [],
      requestBodySchema: {
        "application/json": { example: { title: "hi" } },
      },
    } as EndpointData;
    renderWithIntl(<TryItOutForm endpoint={postEndpoint} />);
    expect(screen.getByText(/request body/i)).toBeInTheDocument();
  });
});

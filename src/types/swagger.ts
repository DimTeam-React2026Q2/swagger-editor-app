export interface EndpointParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required: boolean;
  schema: {
    type: string;
    example?: string | number | boolean | null;
  };
}

export interface JsonSchemaProperty {
  type: string;
  description?: string;
  example?: unknown;
  properties?: Record<string, unknown>;
  required?: string[];
}

export interface RequestBodyContent {
  schema?: JsonSchemaProperty;
  example?: unknown;
}

export interface EndpointData {
  id: string;
  path: string;
  method: "get" | "post" | "put" | "delete";
  summary?: string;
  parameters: EndpointParameter[];
  requestBodySchema?: Record<string, RequestBodyContent>;
  responses: {
    [statusCode: string]: {
      description: string;
      schema?: JsonSchemaProperty;
    };
  };
}

export interface TryItOutResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

import { useMemo } from "react";
import * as yaml from "js-yaml";
import {
  EndpointData,
  EndpointParameter,
  JsonSchemaProperty,
} from "@/types/swagger";

interface UseSwaggerParserResult {
  endpoints: EndpointData[];
  validationError: string | null;
  isYaml: boolean;
}

interface RawParameter {
  name?: string;
  in?: string;
  required?: boolean;
  schema?: {
    type?: string;
    example?: unknown;
  };
  example?: unknown;
}

interface RawMethodObject {
  summary?: string;
  description?: string;
  parameters?: RawParameter[];
  requestBody?: {
    content?: Record<string, unknown>;
  };
  responses?: Record<
    string,
    { description: string; schema?: JsonSchemaProperty }
  >;
}

interface RawPathItem {
  parameters?: RawParameter[];
  get?: RawMethodObject;
  post?: RawMethodObject;
  put?: RawMethodObject;
  delete?: RawMethodObject;
}

interface RawOpenApiSchema {
  paths?: Record<string, RawPathItem>;
  openapi?: string;
  swagger?: string;
}

export function useSwaggerParser(schemaText: string): UseSwaggerParserResult {
  return useMemo((): UseSwaggerParserResult => {
    if (!schemaText.trim()) {
      return {
        endpoints: [],
        validationError: null,
        isYaml: false,
      };
    }

    try {
      let parsedSchema: unknown = null;
      let detectedYaml = false;
      const trimmed: string = schemaText.trim();

      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        parsedSchema = JSON.parse(trimmed);
        detectedYaml = false;
      } else {
        parsedSchema = yaml.load(trimmed);
        detectedYaml = true;
      }

      if (!parsedSchema || typeof parsedSchema !== "object") {
        throw new Error("Invalid schema format. Expected an object.");
      }

      const schema = parsedSchema as RawOpenApiSchema;

      if (!schema.paths && !schema.openapi && !schema.swagger) {
        throw new Error(
          "Invalid OpenAPI/Swagger structure. Missing 'paths' root property."
        );
      }

      const extractedEndpoints: EndpointData[] = [];
      const paths: Record<string, RawPathItem> = schema.paths || {};

      for (const [path, pathObj] of Object.entries(paths)) {
        if (!pathObj || typeof pathObj !== "object") continue;

        const allowedMethods = ["get", "post", "put", "delete"] as const;

        for (const method of allowedMethods) {
          const methodObj: RawMethodObject | undefined = pathObj[method];
          if (!methodObj || typeof methodObj !== "object") continue;

          const rawParameters: RawParameter[] = [
            ...(Array.isArray(pathObj.parameters) ? pathObj.parameters : []),
            ...(Array.isArray(methodObj.parameters)
              ? methodObj.parameters
              : []),
          ];

          const formattedParameters: EndpointParameter[] = rawParameters.map(
            (param: RawParameter): EndpointParameter => ({
              name: param.name || "unknown",
              in:
                param.in &&
                ["path", "query", "header", "cookie"].includes(param.in)
                  ? (param.in as "path" | "query" | "header" | "cookie")
                  : "query",
              required: !!param.required,
              schema: {
                type: param.schema?.type || "string",
                example: (param.schema?.example ?? param.example ?? null) as
                  | string
                  | number
                  | boolean
                  | null,
              },
            })
          );

          extractedEndpoints.push({
            id: `${method}-${path}`,
            path,
            method,
            summary: methodObj.summary || methodObj.description || "",
            parameters: formattedParameters,
            requestBodySchema: methodObj.requestBody?.content as
              | Record<
                  string,
                  { schema?: JsonSchemaProperty; example?: unknown }
                >
              | undefined,
            responses: methodObj.responses || {},
          });
        }
      }

      return {
        endpoints: extractedEndpoints,
        validationError: null,
        isYaml: detectedYaml,
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        endpoints: [],
        validationError: err.message || "Failed to parse API schema",
        isYaml: false,
      };
    }
  }, [schemaText]);
}

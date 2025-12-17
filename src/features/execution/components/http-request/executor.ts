import type { NodeExecutor } from "@/configs/executors";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { HttpRequestNodeData } from "./node";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export const httpRequestExecutor: NodeExecutor<HttpRequestNodeData> = async ({
  nodeId,
  context,
  step,
  data,
}) => {
  // TODO: loading state for http request

  if (!data.endpoint) {
    throw new NonRetriableError(
      "HTTP Request node: Endpoint가 설정되지 않았습니다."
    );
  }

  if (!data.variableName) {
    throw new NonRetriableError(
      "HTTP Request node: 변수 이름이 설정되지 않았습니다."
    );
  }

  if (!data.method) {
    throw new NonRetriableError(
      "HTTP Request node: 메서드가 설정되지 않았습니다."
    );
  }

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method;
    const options: KyOptions = { method };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body)(context);
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  //  TODO: success state for http request

  return result;
};

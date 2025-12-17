import type { NodeExecutor } from "@/configs/executors";

type HttpRequestData = Record<string, unknown>;

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  nodeId,
  context,
  step,
}) => {
  // TODO: loading state for http request

  const result = await step.run("http-request", async () => context);

  //  TODO: success state for http request

  return result;
};

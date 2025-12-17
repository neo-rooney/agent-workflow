import type { NodeExecutor } from "@/configs/executors";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  // TODO: loading state for menual trigger

  const result = await step.run("manual-trigger", async () => context);

  //  TODO: success state for menual trigger

  return result;
};

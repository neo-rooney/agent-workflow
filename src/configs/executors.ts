import { NodeType } from "@/generated/prisma/enums";
import type { GetStepTools, Inngest } from "inngest";
import { manualTriggerExecutor } from "@/features/trigger/components/menual-trigger/executor";
import { httpRequestExecutor } from "@/features/execution/components/http-request/executor";

export type WorkflowContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;
export interface NodeExecutionParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  context: WorkflowContext;
  step: StepTools;
  // publish: TODO
}

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutionParams<TData>
) => Promise<WorkflowContext>;

export type NodeTypeForExecutor = Exclude<NodeType, typeof NodeType.INITIAL>;

export const executorRegistry: Record<NodeTypeForExecutor, NodeExecutor> = {
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.MAMUAL_TRIGGER]: manualTriggerExecutor,
};

export const getExecutor = (nodeType: NodeTypeForExecutor): NodeExecutor => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`${nodeType} 노드 실행기를 찾을 수 없습니다.`);
  }
  return executor;
};

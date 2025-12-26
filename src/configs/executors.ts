import { NodeType } from "@/generated/prisma/enums";
import type { GetStepTools, Inngest } from "inngest";
import { manualTriggerExecutor } from "@/features/trigger/components/menual-trigger/executor";
import { httpRequestExecutor } from "@/features/execution/components/http-request/executor";
import type { Realtime } from "@inngest/realtime";
import { googleFormTriggerExecutor } from "@/features/trigger/components/google-form-trigger/executor";
import { geminiExecutor } from "@/features/execution/components/gemini/executor";
import { openaiExecutor } from "@/features/execution/components/openai/executor";
import { anthropicExecutor } from "@/features/execution/components/anthropic/executor";
import { editFieldsExecutor } from "@/features/execution/components/edit-fields/executor";

export type WorkflowContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;
export interface NodeExecutionParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  context: WorkflowContext;
  step: StepTools;
  publish: Realtime.PublishFn;
  userId: string;
}

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutionParams<TData>
) => Promise<WorkflowContext>;

export type NodeTypeForExecutor = Exclude<NodeType, typeof NodeType.INITIAL>;

export const executorRegistry: Record<NodeTypeForExecutor, NodeExecutor> = {
  [NodeType.HTTP_REQUEST]: httpRequestExecutor as NodeExecutor,
  [NodeType.MAMUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor as NodeExecutor,
  [NodeType.OPENAI]: openaiExecutor as NodeExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor as NodeExecutor,
  [NodeType.EDIT_FIELDS]: editFieldsExecutor as NodeExecutor,
};

export const getExecutor = (nodeType: NodeTypeForExecutor): NodeExecutor => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`${nodeType} 노드 실행기를 찾을 수 없습니다.`);
  }
  return executor;
};

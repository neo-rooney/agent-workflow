import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma/enums";
import { ManualTriggerNode } from "@/features/trigger/components/menual-trigger/node";
import { HttpRequestNode } from "@/features/execution/components/http-request/node";
import { GoogleFormTriggerNode } from "@/features/trigger/components/google-form-trigger/node";
import { GeminiNode } from "@/features/execution/components/gemini/node";
import { OpenAINode } from "@/features/execution/components/openai/node";
import { AnthropicNode } from "@/features/execution/components/anthropic/node";
import { EditFieldsNode } from "@/features/execution/components/edit-fields/node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MAMUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAINode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.EDIT_FIELDS]: EditFieldsNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;

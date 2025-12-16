import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma/enums";
import { ManualTriggerNode } from "@/features/trigger/components/menual-trigger/node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MAMUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;

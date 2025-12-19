"use client";
import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { fetchAnthropicRealtimeToken } from "@/features/execution/components/anthropic/actions";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";
import { useNodeStatus } from "@/hooks/use-node-status";
import { BaseExecutionNode } from "@/features/execution/components/base-execution-node";
import { AnthropicDialog, type AnthropicFormValues } from "./dialog";
import { AVAILABLE_ANTHROPIC_MODELS } from "@/configs/constants";

type AnthropicNodeType = Node<AnthropicFormValues>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const nodeData = props.data;
  const { setNodes } = useReactFlow();
  const description = nodeData?.userPrompt
    ? `${
        nodeData.model || AVAILABLE_ANTHROPIC_MODELS[0]
      }: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: ANTHROPIC_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchAnthropicRealtimeToken,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: AnthropicFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/anthropic.svg"
        name="Anthropic"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
      />
      <AnthropicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";


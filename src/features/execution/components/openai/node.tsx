"use client";
import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { fetchOpenAIRealtimeToken } from "@/features/execution/components/openai/actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { useNodeStatus } from "@/hooks/use-node-status";
import { BaseExecutionNode } from "@/features/execution/components/base-execution-node";
import { OpenAIDialog, type OpenAIFormValues } from "./dialog";
import { AVAILABLE_OPENAI_MODELS } from "@/configs/constants";

type OpenAINodeType = Node<OpenAIFormValues>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const nodeData = props.data;
  const { setNodes } = useReactFlow();
  const description = nodeData?.userPrompt
    ? `${
        nodeData.model || AVAILABLE_OPENAI_MODELS[0]
      }: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAIRealtimeToken,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: OpenAIFormValues) => {
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
        icon="/logos/openai.svg"
        name="OpenAI"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
      />
      <OpenAIDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
    </>
  );
});

OpenAINode.displayName = "OpenAINode";


"use client";
import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { EditIcon } from "lucide-react";
import { memo, useState } from "react";
import { fetchEditFieldsRealtimeToken } from "@/features/execution/components/edit-fields/actions";
import { EDIT_FIELDS_CHANNEL_NAME } from "@/inngest/channels/edit-fields";
import { useNodeStatus } from "@/hooks/use-node-status";
import { BaseExecutionNode } from "@/features/execution/components/base-execution-node";
import { EditFieldsDialog, type EditFieldsFormValues } from "./dialog";

type EditFieldsNodeType = Node<EditFieldsFormValues>;

export const EditFieldsNode = memo((props: NodeProps<EditFieldsNodeType>) => {
  const nodeData = props.data;
  const { setNodes } = useReactFlow();
  const description =
    nodeData?.fields && nodeData.fields.length > 0
      ? `${nodeData.fields.length}개 필드 정의됨`
      : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: EDIT_FIELDS_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchEditFieldsRealtimeToken,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: EditFieldsFormValues) => {
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
        icon={EditIcon}
        name="Edit Fields"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
      />
      <EditFieldsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
    </>
  );
});

EditFieldsNode.displayName = "EditFieldsNode";


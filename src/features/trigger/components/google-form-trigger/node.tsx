import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "@/features/trigger/components/base-trigger-node";
import { GoogleFormTriggerDialog } from "@/features/trigger/components/google-form-trigger/dialog";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "@/features/trigger/components/google-form-trigger/actions";
import { useNodeStatus } from "@/hooks/use-node-status";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon="/logos/google-form.svg"
        name="Google Form Trigger"
        description="Google Form 제출 시 워크플로우를 실행하는 노드입니다."
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";

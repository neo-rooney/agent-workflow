import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "@/features/trigger/components/base-trigger-node";
import { ManualTriggerDialog } from "@/features/trigger/components/menual-trigger/dialog";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/menual-trigger";
import { fetchManualTriggerRealtimeToken } from "@/features/trigger/components/menual-trigger/actions";
import { useNodeStatus } from "@/hooks/use-node-status";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="Manual Trigger"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";

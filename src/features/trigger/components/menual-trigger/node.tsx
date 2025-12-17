import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "@/features/trigger/components/base-trigger-node";
import { ManualTriggerDialog } from "@/features/trigger/components/menual-trigger/dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = "initial";

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

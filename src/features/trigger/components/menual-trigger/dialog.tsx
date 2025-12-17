"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ManualTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({
  open,
  onOpenChange,
}: ManualTriggerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>
            메뉴얼 트리거 노드가 존재하는 경우 워크플로우 실행 버튼이 에디터에
            표시됩니다. <br />
            메뉴얼 트리거 노드는 에디터에 단 하나만 존재할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

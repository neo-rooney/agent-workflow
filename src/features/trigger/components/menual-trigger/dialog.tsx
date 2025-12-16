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
          <DialogTitle>메뉴얼 트리거</DialogTitle>
          <DialogDescription>
            트리거 노드가 클릭되면 흐름을 실행합니다.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

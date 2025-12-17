"use client";
import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflow/hooks/use-workflow";

export const EditorExecuteButton = ({ workflowId }: { workflowId: string }) => {
  const executeWorkflow = useExecuteWorkflow();
  const handleExecute = async () => {
    await executeWorkflow.mutateAsync({ id: workflowId });
  };
  return (
    <Button
      size="lg"
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      워크플로우 실행
    </Button>
  );
};

"use client";
import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EditorExecuteButton = ({ workflowId }: { workflowId: string }) => {
  return (
    <Button size="lg" onClick={() => {}} disabled={false}>
      <FlaskConicalIcon className="size-4" />
      워크플로우 실행
    </Button>
  );
};

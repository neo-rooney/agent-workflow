"use client";

import { useSuspenseWorkflows } from "@/features/workflow/hooks/use-workflow";

export const WorkflowsList = () => {
  const { data: workflows } = useSuspenseWorkflows();
  return <pre>{JSON.stringify(workflows, null, 2)}</pre>;
};

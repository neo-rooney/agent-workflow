import { useQueryStates } from "nuqs";
import { workflowsParams } from "@/features/workflow/utils/params";

export const useWorkflowsParams = () => {
  return useQueryStates(workflowsParams);
};

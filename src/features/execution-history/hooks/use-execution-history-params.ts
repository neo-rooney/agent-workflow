import { useQueryStates } from "nuqs";
import { executionHistoryParams } from "../utils/params";

export const useExecutionHistoryParams = () => {
  return useQueryStates(executionHistoryParams);
};

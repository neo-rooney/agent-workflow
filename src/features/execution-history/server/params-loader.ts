import { createLoader } from "nuqs/server";
import { executionHistoryParams } from "@/features/execution-history/utils/params";

export const executionHistoryParamsLoader = createLoader(
  executionHistoryParams
);

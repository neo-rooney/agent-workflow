import { createLoader } from "nuqs/server";
import { workflowsParams } from "@/features/workflow/utils/params";

export const workflowsParamsLoader = createLoader(workflowsParams);

import { createTRPCRouter } from "../init";
import { workflowRouter } from "@/features/workflow/server/router";
import { credentialsRouter } from "@/features/credential/server/router";
import { executionHistoryRouter } from "@/features/execution-history/server/router";

export const appRouter = createTRPCRouter({
  workflow: workflowRouter,
  credential: credentialsRouter,
  executionHistory: executionHistoryRouter,
});

export type AppRouter = typeof appRouter;

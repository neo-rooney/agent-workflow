import { createTRPCRouter } from "../init";
import { workflowRouter } from "@/features/workflow/server/router";
import { credentialsRouter } from "@/features/credential/server/router";

export const appRouter = createTRPCRouter({
  workflow: workflowRouter,
  credential: credentialsRouter,
});

export type AppRouter = typeof appRouter;

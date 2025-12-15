import { createTRPCRouter } from "../init";
import { workflowRouter } from "@/features/workflow/server/router";

export const appRouter = createTRPCRouter({
  workflow: workflowRouter,
});

export type AppRouter = typeof appRouter;

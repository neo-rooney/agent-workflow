// import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query(() => {
    return prisma.user.findMany();
  }),
  testAi: baseProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });
    return {
      success: true,
      message: "AI 백그라운드 작업 시작",
    };
  }),
});
export type AppRouter = typeof appRouter;

import { inngest } from "@/inngest/client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/prisma";
import { topologicalSort } from "@/inngest/utils";
import { getExecutor, type NodeTypeForExecutor } from "@/configs/executors";
import { manualTriggerChannel } from "@/inngest/channels/menual-trigger";
import { httpRequestChannel } from "@/inngest/channels/http-requset";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { geminiChannel } from "@/inngest/channels/gemini";
import { openaiChannel } from "@/inngest/channels/openai";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { ExecutionStatus } from "@/generated/prisma/enums";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
    onFailure: async ({ event, step }) => {
      await step.run("update-execution-history", async () => {
        await prisma.executionHistory.update({
          where: {
            inngestEventId: event.data.event.id,
            workflowId: event.data.event.data.workflowId,
          },
          data: {
            status: ExecutionStatus.FAILED,
            error: event.data.error.message,
            errorStack: event.data.error.stack,
          },
        });
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      manualTriggerChannel(),
      httpRequestChannel(),
      googleFormTriggerChannel(),
      geminiChannel(),
      openaiChannel(),
      anthropicChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;
    const inngestEventId = event.id;
    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }

    if (!inngestEventId) {
      throw new NonRetriableError("Inngest event ID is missing");
    }

    await step.run("create-execution-history", async () => {
      await prisma.executionHistory.create({
        data: {
          workflowId,
          inngestEventId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeTypeForExecutor);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    await step.run("update-execution-history", async () => {
      await prisma.executionHistory.update({
        where: {
          inngestEventId,
          workflowId,
        },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return { workflowId, result: context };
  }
);

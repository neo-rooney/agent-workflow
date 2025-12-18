import { inngest } from "@/inngest/client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/prisma";
import { topologicalSort } from "@/inngest/utils";
import { getExecutor, type NodeTypeForExecutor } from "@/configs/executors";
import { manualTriggerChannel } from "@/inngest/channels/menual-trigger";
import { httpRequestChannel } from "@/inngest/channels/http-requset";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  {
    event: "workflows/execute.workflow",
    channels: [manualTriggerChannel(), httpRequestChannel()],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }

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

    let context = event.data.context || {};

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

    return { workflowId, result: context };
  }
);

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
/**
 * 모든 워크플로우를 가져오는 훅, suspense 적용
 * @returns 워크플로우 목록
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflow.getWorkflows.queryOptions());
};

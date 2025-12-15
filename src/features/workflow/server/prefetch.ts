// src/featrue/workflows/server/prefetch.ts
import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflow.getWorkflows>;
/**
 * 모든 워크플로우를 가져오는 쿼리를 미리 실행
 * @param params 쿼리 파라미터
 * @returns 쿼리 결과
 */
export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflow.getWorkflows.queryOptions(params));
};

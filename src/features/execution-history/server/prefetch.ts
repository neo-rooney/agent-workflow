import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.executionHistory.getMany>;
/**
 * 모든 실행 기록을 가져오는 쿼리를 미리 실행
 * @param params 쿼리 파라미터
 * @returns 쿼리 결과
 */
export const prefetchExecutionHistories = (params: Input) => {
  return prefetch(trpc.executionHistory.getMany.queryOptions(params));
};

/**
 * 하나의 실행 기록을 가져오는 쿼리를 미리 실행
 * @param id 실행 기록 ID
 * @returns 쿼리 결과
 */
export const prefetchExecutionHistory = (id: string) => {
  return prefetch(trpc.executionHistory.getOne.queryOptions({ id }));
};

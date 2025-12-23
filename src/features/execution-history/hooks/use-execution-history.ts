import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useExecutionHistoryParams } from "./use-execution-history-params";
/**
 * 모든 실행 기록을 가져오는 훅, suspense 적용
 * @returns
 */
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionHistoryParams();
  return useSuspenseQuery(trpc.executionHistory.getMany.queryOptions(params));
};

/**
 * 하나의 실행 기록을 가져오는 훅, suspense 적용
 */
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executionHistory.getOne.queryOptions({ id }));
};

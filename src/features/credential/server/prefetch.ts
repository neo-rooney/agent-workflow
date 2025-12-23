import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.credential.getMany>;
/**
 * 모든 인증 정보를 가져오는 쿼리를 미리 실행
 * @param params 쿼리 파라미터
 * @returns 쿼리 결과
 */
export const prefetchCredentials = (params: Input) => {
  return prefetch(trpc.credential.getMany.queryOptions(params));
};

/**
 * 하나의 인증 정보를 가져오는 쿼리를 미리 실행
 * @param id 인증 정보 ID
 * @returns 쿼리 결과
 */
export const prefetchCredential = (id: string) => {
  return prefetch(trpc.credential.getOne.queryOptions({ id }));
};

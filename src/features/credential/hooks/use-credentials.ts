import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { CredentialType } from "@/generated/prisma/enums";
import { useTRPC } from "@/trpc/client";
import { useCredentialsParams } from "@/features/credential/hooks/use-credentials-params";
/**
 * 모든 인증 정보를 가져오는 훅, suspense 적용
 * @returns 인증 정보 목록
 */
export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();
  return useSuspenseQuery(trpc.credential.getMany.queryOptions(params));
};

/**
 * 새로운 인증 정보를 생성하는 훅
 */
export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credential.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`인증 정보 "${data.name}" 생성 성공`);
        queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`인증 정보 생성 실패: ${error.message}`);
      },
    })
  );
};

/**
 * 인증 정보를 삭제하는 훅
 */
export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credential.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`인증 정보 "${data.name}" 삭제 성공`);
        queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`인증 정보 삭제 실패: ${error.message}`);
      },
    })
  );
};

/**
 * 하나의 인증 정보를 가져오는 훅, suspense 적용
 */
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credential.getOne.queryOptions({ id }));
};

/**
 * 인증 정보를 업데이트하는 훅
 */
export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credential.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`인증 정보 "${data.name}" 업데이트 성공`);
        queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.credential.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`인증 정보 업데이트 실패: ${error.message}`);
      },
    })
  );
};

/**
 * 인증 정보를 타입별로 가져오는 훅
 * 프리패칭이 필요하지 않음(모달 등장 시 사용 하기 때문)
 */
export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();
  return useQuery(trpc.credential.getByType.queryOptions({ type }));
};

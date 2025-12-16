import { useWorkflowsParams } from "@/features/workflow/hooks/use-workflows-params";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
/**
 * 모든 워크플로우를 가져오는 훅, suspense 적용
 * @returns 워크플로우 목록
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  return useSuspenseQuery(trpc.workflow.getWorkflows.queryOptions(params));
};

/**
 * 새로운 워크플로우를 생성하는 훅
 */
export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`워크플로우 "${data.name}" 생성 성공`);
        queryClient.invalidateQueries(
          trpc.workflow.getWorkflows.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(`워크플로우 생성 실패: ${error.message}`);
      },
    })
  );
};

/**
 * 워크플로우를 삭제하는 훅
 */
export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflow.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`워크플로우 "${data.name}" 삭제 성공`);
        queryClient.invalidateQueries(
          trpc.workflow.getWorkflows.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(`워크플로우 삭제 실패: ${error.message}`);
      },
    })
  );
};

/**
 * 개별 워크플로우를 가져오는 훅, suspense 적용
 * @param id 워크플로우 ID
 * @returns 워크크플로우 데이터
 */
export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflow.getWorkflow.queryOptions({ id }));
};

/**
 * 워크플로우 이름을 업데이트하는 훅
 */
export const useUpdateWorkflowName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflow.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`워크플로우 이름이 변경 : "${data.name}"`);
        queryClient.invalidateQueries(
          trpc.workflow.getWorkflows.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.workflow.getWorkflow.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`워크플로우 이름 업데이트 실패: ${error.message}`);
      },
    })
  );
};

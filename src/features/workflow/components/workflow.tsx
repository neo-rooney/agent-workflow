"use client";

import { EntittyHeader, EntityContainer } from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "@/features/workflow/hooks/use-workflow";
import { useRouter } from "next/navigation";

export const WorkflowsList = () => {
  const { data: workflows } = useSuspenseWorkflows();
  return <pre>{JSON.stringify(workflows, null, 2)}</pre>;
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer header={<WorkflowsHeader disabled={false} />}>
      {children}
    </EntityContainer>
  );
};

export const WorkflowsHeader = ({ disabled }: { disabled: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
    });
  };
  return (
    <EntittyHeader
      title="워크플로우"
      description="워크플로우를 생성하고 관리합니다"
      onNew={handleCreate}
      newButtonLabel="새 워크플로우"
      disabled={disabled}
      isCreating={createWorkflow.isPending}
    />
  );
};

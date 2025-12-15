"use client";

import {
  EntittyHeader,
  EntityContainer,
  EntityEmptyView,
  EntityItem,
  EntityList,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "@/features/workflow/hooks/use-workflow";
import { Workflow } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();
  return (
    <EntityList
      items={workflows.data}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowsItem data={workflow} />}
      emptyView={<WorkflowsEmptyView />}
    />
  );
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

export const WorkflowsItem = ({ data }: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    removeWorkflow.mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};

export const WorkflowsEmptyView = () => {
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
    <EntityEmptyView
      message="생성된 워크플로우가 없습니다. 새로운 워크플로우를 생성해주세요."
      onNew={handleCreate}
    />
  );
};

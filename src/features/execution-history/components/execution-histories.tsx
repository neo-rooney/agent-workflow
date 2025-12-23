"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import {
  EntityEmptyView,
  EntityHeader,
  EntityContainer,
  EntityItem,
  EntityList,
  EntityPagination,
  EntityErrorView,
  EntityLoadingView,
} from "@/components/entity-components";
import { useExecutionHistoryParams } from "@/features/execution-history/hooks/use-execution-history-params";
import type { ExecutionHistory } from "@/generated/prisma/client";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { useSuspenseExecutionHistories } from "@/features/execution-history/hooks/use-execution-history";
import { useRouter } from "next/navigation";

export const ExecutionHistoryList = () => {
  const executionHistories = useSuspenseExecutionHistories();

  return (
    <EntityList
      items={executionHistories.data.items}
      getKey={(executionHistory) => executionHistory.id}
      renderItem={(executionHistory) => (
        <ExecutionHistoryItem data={executionHistory} />
      )}
      emptyView={<ExecutionHistoryEmptyView />}
    />
  );
};

export const ExecutionHistoryHeader = () => {
  return (
    <EntityHeader
      title="실행 기록"
      description="실행 기록을 생성하고 관리합니다"
    />
  );
};

export const ExecutionHistoryPagination = () => {
  const executions = useSuspenseExecutionHistories();
  const [params, setParams] = useExecutionHistoryParams();
  return (
    <EntityPagination
      disabled={executions.isFetching}
      page={params.page}
      totalPages={executions.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionHistoryContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionHistoryHeader />}
      pagination={<ExecutionHistoryPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionHistoryLoadingView = () => {
  return <EntityLoadingView message="실행 기록을 불러오는 중입니다." />;
};

export const ExecutionHistoryErrorView = () => {
  return (
    <EntityErrorView message="실행 기록을 불러오는 중에 오류가 발생했습니다." />
  );
};

export const ExecutionHistoryEmptyView = () => {
  const router = useRouter();
  return (
    <EntityEmptyView
      title="실행 기록"
      message={
        <>
          <>생성된 실행 기록이 없습니다.</>
          <br />
          <>워크플로우를 실행해주세요.</>
        </>
      }
      onNew={() => {
        router.push("/workflows");
      }}
      buttonLabel="워크플로우 목록"
    />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

export const ExecutionHistoryItem = ({
  data,
}: {
  data: ExecutionHistory & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round((data.completedAt.getTime() - data.startedAt.getTime()) / 1000)
    : null;

  const subTitle = (
    <>
      {data.workflow.name} &bull; 시작 시간{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true, locale: ko })}
      {duration && <> &bull; 실행 시간 {duration}s</>}
    </>
  );

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.status}
      subtitle={subTitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};

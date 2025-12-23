"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { useSuspenseExecutionHistory } from "@/features/execution-history/hooks/use-execution-history";

export const getStatusIcon = (status: ExecutionStatus) => {
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

export const ExecutionHistoryView = ({
  executionId,
}: {
  executionId: string;
}) => {
  const { data: executionHistory } = useSuspenseExecutionHistory(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = executionHistory.completedAt
    ? Math.round(
        (executionHistory.completedAt.getTime() -
          executionHistory.startedAt.getTime()) /
          1000
      )
    : null;
  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon(executionHistory.status)}
          <div>
            <CardTitle>{executionHistory.status}</CardTitle>
            <CardDescription>
              {executionHistory.workflow.name} 실행 기록
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="test-sm font-medium text-muted-foreground">
              워크플로우
            </p>
            <Link
              href={`/workflows/${executionHistory.workflowId}`}
              prefetch
              className="text-sm hover:underline text-primary"
            >
              {executionHistory.workflow.name}
            </Link>
          </div>

          <div>
            <p className="test-sm font-medium text-muted-foreground">상태</p>
            <p className="text-sm">{executionHistory.status}</p>
          </div>

          <div>
            <p className="test-sm font-medium text-muted-foreground">
              시작 시간
            </p>
            <p className="text-sm">
              {formatDistanceToNow(executionHistory.startedAt, {
                addSuffix: true,
                locale: ko,
              })}
            </p>
          </div>

          {executionHistory.completedAt && (
            <div>
              <p className="test-sm font-medium text-muted-foreground">
                완료 시간
              </p>
              <p className="text-sm">
                {formatDistanceToNow(executionHistory.completedAt, {
                  addSuffix: true,
                  locale: ko,
                })}
              </p>
            </div>
          )}

          {duration && (
            <div>
              <p className="test-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-sm">{duration}s</p>
            </div>
          )}

          <div>
            <p className="test-sm font-medium text-muted-foreground">
              이벤트 ID
            </p>
            <p className="text-sm">{executionHistory.inngestEventId}</p>
          </div>
        </div>
        {executionHistory.error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
            <div>
              <p className="text-sm font-medium text-red-900">에러</p>
              <p className="text-sm text-red-800 font-mono">
                {executionHistory.error}
              </p>
            </div>
            {executionHistory.errorStack && (
              <Collapsible
                open={showStackTrace}
                onOpenChange={setShowStackTrace}
              >
                <CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-900 hover:bg-red-100"
                  >
                    {showStackTrace ? "숨기기" : "자세히 보기"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="text-xs text-red-800 font-mono overflow-auto mt-2 p-2 bg-red-100 rounded">
                    {executionHistory.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}
        {executionHistory.output && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">출력</p>
            <pre className="text-xs font-mono overflow-auto">
              {JSON.stringify(executionHistory.output, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

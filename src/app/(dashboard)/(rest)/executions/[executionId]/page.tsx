import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ExecutionHistoryView } from "@/features/execution-history/components/execution-history";
import {
  ExecutionHistoryLoadingView,
  ExecutionHistoryErrorView,
} from "@/features/execution-history/components/execution-histories";
import { prefetchExecutionHistory } from "@/features/execution-history/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { executionId } = await params;
  prefetchExecutionHistory(executionId);

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionHistoryErrorView />}>
            <Suspense fallback={<ExecutionHistoryLoadingView />}>
              <ExecutionHistoryView executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
};

export default Page;

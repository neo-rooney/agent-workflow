import { requireAuth } from "@/lib/auth-utils";
import { SearchParams } from "nuqs";
import { executionHistoryParamsLoader } from "@/features/execution-history/server/params-loader";
import { prefetchExecutionHistories } from "@/features/execution-history/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  ExecutionHistoryContainer,
  ExecutionHistoryList,
} from "@/features/execution-history/components/execution-histories";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await executionHistoryParamsLoader(searchParams);
  prefetchExecutionHistories(params);

  return (
    <ExecutionHistoryContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<div>Loading</div>}>
            <ExecutionHistoryList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionHistoryContainer>
  );
};

export default Page;

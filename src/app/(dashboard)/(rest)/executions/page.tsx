import { requireAuth } from "@/lib/auth-utils";
import { SearchParams } from "nuqs";
import { executionHistoryParamsLoader } from "@/features/execution-history/server/params-loader";
import { prefetchExecutionHistories } from "@/features/execution-history/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await executionHistoryParamsLoader(searchParams);
  prefetchExecutionHistories(params);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading</div>}>
          <div>Executions</div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;

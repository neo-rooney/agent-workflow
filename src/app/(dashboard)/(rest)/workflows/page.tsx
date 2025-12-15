import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflow/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  WorkflowsContainer,
  WorkflowsList,
  WorkflowsErrorView,
  WorkflowsLoadingView,
} from "@/features/workflow/components/workflow";
import { workflowsParamsLoader } from "@/features/workflow/server/params-loader";
import type { SearchParams } from "nuqs/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();
  const params = await workflowsParamsLoader(searchParams);
  prefetchWorkflows(params);

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsErrorView />}>
          <Suspense fallback={<WorkflowsLoadingView />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
};

export default Page;

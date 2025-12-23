import { requireAuth } from "@/lib/auth-utils";
import { credentialsParamsLoader } from "@/features/credential/server/params-loader";
import { prefetchCredentials } from "@/features/credential/server/prefetch";
import { SearchParams } from "nuqs";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);
  prefetchCredentials(params);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading</div>}>
          <div>Credentials</div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;

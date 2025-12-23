import { requireAuth } from "@/lib/auth-utils";
import { credentialsParamsLoader } from "@/features/credential/server/params-loader";
import { prefetchCredentials } from "@/features/credential/server/prefetch";
import { SearchParams } from "nuqs";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  CredentialsContainer,
  CredentialsList,
} from "@/features/credential/components/credentials";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);
  prefetchCredentials(params);

  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<div>Loading</div>}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  );
};

export default Page;

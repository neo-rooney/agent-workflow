import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CredentialView } from "@/features/credential/components/credential";
import {
  CredentialsErrorView,
  CredentialsLoadingView,
} from "@/features/credential/components/credentials";
import { prefetchCredential } from "@/features/credential/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { credentialId } = await params;
  prefetchCredential(credentialId);
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialsErrorView />}>
            <Suspense fallback={<CredentialsLoadingView />}>
              <CredentialView credentialId={credentialId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
};

export default Page;

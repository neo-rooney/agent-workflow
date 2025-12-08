import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Client } from "./client";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default Page;

"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Client = () => {
  const trpc = useTRPC();
  const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions());

  const testAi = useMutation(
    trpc.testAi.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
      },
    })
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {JSON.stringify(users)}
      <Button onClick={() => testAi.mutate()} disabled={testAi.isPending}>
        {testAi.isPending ? "Testing..." : "Test AI"}
      </Button>
    </div>
  );
};

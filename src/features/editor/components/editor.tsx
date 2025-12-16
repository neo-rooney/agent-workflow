"use client";

import { LoadingView, ErrorView } from "@/components/entity-components";

export const EditorLoadingView = () => {
  return <LoadingView message="워크플로우 편집기를 불러오는 중입니다." />;
};

export const EditorErrorView = () => {
  return (
    <ErrorView message="워크플로우 편집기를 불러오는 중에 오류가 발생했습니다." />
  );
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  return <div>{workflowId}</div>;
};

"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  EntityEmptyView,
  EntityHeader,
  EntityContainer,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  EntityErrorView,
  EntityLoadingView,
} from "@/components/entity-components";
import { useCredentialsParams } from "@/features/credential/hooks/use-credentials-params";
import type { Credential } from "@/generated/prisma/client";
import { CredentialType } from "@/generated/prisma/enums";
import { useEntitySearch } from "@/hooks/use-entity-search";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="인증 정보 검색"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialsItem data={credential} />}
      emptyView={<CredentialsEmptyView />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled: boolean }) => {
  return (
    <EntityHeader
      title="인증 정보"
      description="인증 정보를 생성하고 관리합니다"
      newButtonLabel="새 인증 정보"
      newButtonHref="/credentials/new"
      disabled={disabled}
    />
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();
  return (
    <EntityPagination
      disabled={credentials.isFetching}
      page={params.page}
      totalPages={credentials.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader disabled={false} />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoadingView = () => {
  return <EntityLoadingView message="인증 정보를 불러오는 중입니다." />;
};

export const CredentialsErrorView = () => {
  return (
    <EntityErrorView message="인증 정보를 불러오는 중에 오류가 발생했습니다." />
  );
};

export const CredentialsEmptyView = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(`/credentials/new`);
  };
  return (
    <EntityEmptyView
      message={
        <>
          생성된 인증 정보가 없습니다.
          <br />새 인증 정보를 생성해주세요.
        </>
      }
      title="인증 정보"
      onNew={handleCreate}
      buttonLabel="새 인증 정보"
    />
  );
};

const credentialLogo: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/logos/openai.svg",
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
};

export const CredentialsItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const logo = credentialLogo[data.type] || "/logos/openai.svg";

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          마지막 업데이트{" "}
          {formatDistanceToNow(data.updatedAt, { addSuffix: true, locale: ko })}{" "}
          &bull; 생성 일{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true, locale: ko })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};

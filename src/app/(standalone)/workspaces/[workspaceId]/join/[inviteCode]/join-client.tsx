"use client";

import { JoinWorkspaceForm } from "@/app/(dashboard)/(workspaces)/_components/join-workspace-form";
import { ErrorPage } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export function MemberJoinClient() {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ workspaceId });

  if (isLoading) return <PageLoader />;
  if (!data) return <ErrorPage message="Project not found" />;

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm intialValues={data} />
    </div>
  );
}

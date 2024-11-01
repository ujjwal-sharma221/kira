"use client";

import { EditWorkspaceForm } from "@/app/(dashboard)/(workspaces)/_components/edit-workspace-form";
import { ErrorPage } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export function WorkspaceSettingsClient() {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) return <PageLoader />;
  if (!data) return <ErrorPage message="Project not found" />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={data} />
    </div>
  );
}

"use client";

import { FilePenIcon } from "lucide-react";
import Link from "next/link";

import { ProjectAvatar } from "@/app/(dashboard)/(projects)/_components/project-avatar";
import { Button } from "@/components/ui/button";
import { TaskViewSwitcher } from "@/components/task-view-switcher";
import { useProjectId } from "@/hooks/use-projectId";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { PageLoader } from "@/components/page-loader";
import { ErrorPage } from "@/components/page-error";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data, isLoading } = useGetProject({ projectId });

  if (isLoading) return <PageLoader />;
  if (!data) return <ErrorPage message="Project not found" />;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={data.name}
            image={data.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${data.workspaceId}/projects/${data.$id}/settings`}
            >
              <FilePenIcon className="" />
              Edit project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

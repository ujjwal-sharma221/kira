"use client";

import { EditProjectForm } from "@/app/(dashboard)/(projects)/_components/edit-project-form";
import { ErrorPage } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useProjectId } from "@/hooks/use-projectId";

export const ProjectIdSettings = () => {
  const projectId = useProjectId();
  const { data: initialValues, isLoading } = useGetProject({ projectId });

  if (isLoading) return <PageLoader />;
  if (!initialValues) return <ErrorPage message="no project found" />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

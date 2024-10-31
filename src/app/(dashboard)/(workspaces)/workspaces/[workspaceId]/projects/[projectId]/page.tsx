import { redirect } from "next/navigation";
import { FilePenIcon } from "lucide-react";
import Link from "next/link";

import { getCurrent } from "@/features/auth/action";
import { getProject } from "@/features/projects/actions";
import { ProjectAvatar } from "@/app/(dashboard)/(projects)/_components/project-avatar";
import { Button } from "@/components/ui/button";
import { TaskViewSwitcher } from "@/components/task-view-switcher";

const ProjectIdPage = async ({ params }: { params: { projectId: string } }) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({ projectId: params.projectId });
  if (!initialValues) throw new Error("Project not found");

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
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

export default ProjectIdPage;

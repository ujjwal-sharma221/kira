import Link from "next/link";
import { ChevronRightIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { projectValues } from "@/features/projects/project-types";
import { Task } from "@/features/tasks/types";
import { ProjectAvatar } from "../../(projects)/_components/project-avatar";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";

interface TaskBreadCrumbsProps {
  project: projectValues;
  task: Task;
}

export function TaskBreadCrumbs({ project, task }: TaskBreadCrumbsProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "This action cannot be reversed",
    "destructive",
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm font-semibold transition hover:opacity-75 lg:text-lg">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-3" />
      <p className="text-sm font-semibold lg:text-lg">{task.name}</p>
      <Button
        disabled={isPending}
        className="ml-auto"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
      >
        <Trash2 className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
}

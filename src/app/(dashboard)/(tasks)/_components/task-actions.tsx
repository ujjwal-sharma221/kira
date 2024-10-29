import {
  Eraser,
  ExternalLinkIcon,
  FilePenLine,
  SquareArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useEditTaskModal } from "@/hooks/use-update-task-modal";

interface TaskActionProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export function TaskAction({ children, id, projectId }: TaskActionProps) {
  const router = useRouter();
  const worksapceId = useWorkspaceId();
  const { open } = useEditTaskModal();

  const [ConfirmDialog, confirmDelete] = useConfirm(
    "Delete Task",
    "This action cannot be undone",
    "destructive",
  );
  const { mutate, isPending } = useDeleteTask();

  async function onDelete() {
    const ok = await confirmDelete();
    if (!ok) return;

    mutate({ param: { taskId: id } });
  }

  function onOpenTask() {
    router.push(`/workspaces/${worksapceId}/tasks/${id}`);
  }

  function onOpenProject() {
    router.push(`/workspaces/${worksapceId}/projects/${projectId}`);
  }

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <SquareArrowRight className="mr-2 size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <FilePenLine className="mr-2 size-4 stroke-2" />
            Edit task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="p-[10px] font-medium text-amber-700 focus:text-amber-700"
          >
            <Eraser className="mr-2 size-4 stroke-2" />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

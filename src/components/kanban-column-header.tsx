import {
  Circle,
  CircleCheck,
  CircleDashedIcon,
  CircleDot,
  CircleDotDashed,
  PlusIcon,
} from "lucide-react";

import { TaskStatus } from "@/features/tasks/types";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "./ui/button";
import { useCreateTaskModal } from "@/hooks/use-create-task-modal";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.TODO]: <Circle className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashed className="size-[18px]" />,
  [TaskStatus.IN_REVIEW]: <CircleDot className="size-[18px] text-sky-400" />,
  [TaskStatus.DONE]: <CircleCheck className="size-[18px] text-emerald-400" />,
};

export function KanbanColumnHeader({
  board,
  taskCount,
}: KanbanColumnHeaderProps) {
  const { open } = useCreateTaskModal();
  const statusIcon = statusIconMap[board];
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="flex items-center gap-x-2">
        {statusIcon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="flex size-5 items-center justify-center rounded-full bg-neutral-600 text-xs font-medium text-white">
          {taskCount}
        </div>
      </div>

      <Button
        onClick={open}
        size="icon"
        variant="ghost"
        className="size-5 rounded-full"
      >
        <PlusIcon className="size-4 text-zinc-900" />
      </Button>
    </div>
  );
}

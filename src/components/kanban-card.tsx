import { Dot, Ellipsis } from "lucide-react";

import { TaskAction } from "@/app/(dashboard)/(tasks)/_components/task-actions";
import { Task } from "@/features/tasks/types";
import { Separator } from "./ui/separator";
import { MemberAvatar } from "@/app/(standalone)/workspaces/[workspaceId]/members/_components/member-avatar";
import { TaskDate } from "@/app/(dashboard)/(tasks)/_components/task-date";
import { ProjectAvatar } from "@/app/(dashboard)/(projects)/_components/project-avatar";

interface KanbanCardProps {
  task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="mb-1.5 space-y-3 rounded bg-[#FAF9F9] p-2.5 text-[#121212] shadow-sm">
      <div className="flex items-start justify-between gap-x-2">
        <p className="line-clamp-2 text-sm">{task.name}</p>
        <TaskAction id={task.$id} projectId={task.projectId}>
          <Ellipsis className="size-[18px] shrink-0 stroke-1 transition hover:opacity-75" />
        </TaskAction>
      </div>
      <Separator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          fallbackClassName="text-[10px]"
          name={task.assignee.name}
        />
        <Dot className="size-4 text-muted-foreground" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
}

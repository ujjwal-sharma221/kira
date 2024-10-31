import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Task } from "@/features/tasks/types";
import { Separator } from "@/components/ui/separator";
import { OverviewProperties } from "./overview-property";
import { MemberAvatar } from "@/app/(standalone)/workspaces/[workspaceId]/members/_components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "@/hooks/use-update-task-modal";

export function TaskOverview({ task }: { task: Task }) {
  const { open } = useEditTaskModal();
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-zinc-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-black">Overview</p>
          <Button
            onClick={() => open(task.$id)}
            className="border"
            size="sm"
            variant="default"
          >
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperties label="Assignee">
            <MemberAvatar
              name={task.assignee.name}
              className="size-6"
            ></MemberAvatar>
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperties>
          <OverviewProperties label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperties>
          <OverviewProperties label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperties>
        </div>
      </div>
    </div>
  );
}

"use client";

import { ListTodo, LoaderCircle } from "lucide-react";
import { useCallback } from "react";
import { useQueryState } from "nuqs";

import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { useCreateTaskModal } from "@/hooks/use-create-task-modal";
import { useGetTasks } from "@/features/tasks/api/use-get-task";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DataFilters } from "@/app/(dashboard)/(tasks)/_components/data-filters";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { DataTable } from "@/app/(dashboard)/(tasks)/_components/data-table";
import { columns } from "@/app/(dashboard)/(tasks)/_components/columns";
import { DataKanban } from "./data-kanban";
import { PayloadStatus } from "@/features/tasks/types";
import { useBulkUpdateTask } from "@/features/tasks/api/use-bulk-update-task";
import { DataCalendar } from "./data-calendar";
import { useProjectId } from "@/hooks/use-projectId";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export function TaskViewSwitcher({ hideProjectFilter }: TaskViewSwitcherProps) {
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();
  const paramProjectId = useProjectId();
  const { mutate: bulkUpdate } = useBulkUpdateTask();

  const [{ assigneeId, dueDate, projectId, search, status }] = useTaskFilters();
  const { data: tasks, isLoading: loadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    search,
    dueDate,
    status,
  });

  const onKanbanChange = useCallback(
    (tasks: PayloadStatus[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate],
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full flex-1 rounded-lg border"
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanaban">
              Kanaban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <ListTodo className="mr-2 size-4" />
            New
          </Button>
        </div>
        <Separator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <Separator className="my-4" />
        {loadingTasks ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanaban" className="mt-0">
              <DataKanban
                onChange={onKanbanChange}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}

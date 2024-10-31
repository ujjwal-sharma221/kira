"use client";

import { TaskBreadCrumbs } from "@/app/(dashboard)/(tasks)/_components/task-bread-crumbs";
import { TaskDescription } from "@/app/(dashboard)/(tasks)/_components/task-description";
import { TaskOverview } from "@/app/(dashboard)/(tasks)/_components/task-overview";
import { ErrorPage } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Separator } from "@/components/ui/separator";
import { useGetTask } from "@/features/tasks/api/use-get-single-task";
import { useTaskId } from "@/hooks/use-taskId";

export function TaskIdClient() {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <ErrorPage message="Task not found" />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadCrumbs project={data.project} task={data} />
      <Separator className="my-6" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
}

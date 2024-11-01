import { ProjectAnalyticsResponse } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { Separator } from "./ui/separator";

export function Analytics({ data }: ProjectAnalyticsResponse) {
  return (
    <ScrollArea className="w-full shrink-0 whitespace-nowrap rounded-lg border">
      <div className="flex w-full flex-row">
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            variant={data.taskDifference > 0 ? "up" : "down"}
            title="Total tasks"
            value={data.taskCount}
            increaseValue={data.taskDifference}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            title="Assigned tasks"
            value={data.assignedTaskCount}
            increaseValue={data.assignedTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>

        <div className="flex flex-1 items-center">
          <AnalyticsCard
            variant={data.completeTaskDifference > 0 ? "up" : "down"}
            title="Completed tasks"
            value={data.completeTasksCount}
            increaseValue={data.completeTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>

        <div className="flex flex-1 items-center">
          <AnalyticsCard
            variant={data.overdueTaskDifference > 0 ? "up" : "down"}
            title="Overdue tasks"
            value={data.overdueTasksCount}
            increaseValue={data.overdueTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>

        <div className="flex flex-1 items-center">
          <AnalyticsCard
            variant={data.incompleteTaskDifference > 0 ? "up" : "down"}
            title="Incomplete tasks"
            value={data.incompleteTasksCount}
            increaseValue={data.incompleteTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

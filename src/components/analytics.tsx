import { ProjectAnalyticsResponse } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";

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
        </div>
      </div>
    </ScrollArea>
  );
}

import { BookUser, Logs, SquareChartGantt } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TaskStatus } from "@/features/tasks/types";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { DatePicker } from "@/components/date-picker";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export function DataFilters({ hideProjectFilter }: DataFiltersProps) {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: loadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: loadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = loadingMembers || loadingProjects;

  const projectOptions = projects?.documents.map((p) => ({
    value: p.$id,
    label: p.name,
  }));

  const membersOptions = members?.documents.map((m) => ({
    value: m.$id,
    label: m.name,
  }));

  const [{ assigneeId, dueDate, projectId, status }, setFilters] =
    useTaskFilters();

  function onStatusChange(value: string) {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  }

  function onAssigneeChange(value: string) {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ assigneeId: value as string });
    }
  }

  function onProjectChange(value: string) {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ projectId: value as string });
    }
  }

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => {
          onStatusChange(value);
        }}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <Logs className="mr-2 size-4" />
            <SelectValue placeholder="all statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In review</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In progress</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => {
          onAssigneeChange(value);
        }}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <BookUser className="mr-2 size-4" />
            <SelectValue placeholder="all assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {membersOptions?.map((m) => (
            <SelectItem value={m.value} key={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => {
            onProjectChange(value);
          }}
        >
          <SelectTrigger className="h-8 w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <SquareChartGantt className="mr-2 size-4" />
              <SelectValue placeholder="all projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((m) => (
              <SelectItem value={m.value} key={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(data) => {
          setFilters({ dueDate: data ? data.toISOString() : null });
        }}
      />
    </div>
  );
}

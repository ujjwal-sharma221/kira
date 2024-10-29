import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export function useGetTasks({
  workspaceId,
  assigneeId,
  dueDate,
  projectId,
  status,
  search,
}: useGetTasksProps) {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      assigneeId,
      projectId,
      dueDate,
      status,
      search,
    ],
    queryFn: async () => {
      const res = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch projects");

      const { data } = await res.json();

      return data;
    },
  });

  return query;
}

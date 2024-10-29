import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetTaskProps {
  taskId: string;
}

export function useGetTask({ taskId }: useGetTaskProps) {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await client.api.tasks[":taskId"].$get({ param: { taskId } });
      if (!res.ok) throw new Error("Failed to fetch task");

      const { data } = await res.json();

      return data;
    },
  });

  return query;
}

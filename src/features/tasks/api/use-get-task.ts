import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export function useGetTasks({ workspaceId }: { workspaceId: string }) {
  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const res = await client.api.tasks.$get({
        query: { workspaceId },
      });
      if (!res.ok) throw new Error("Failed to fetch projects");

      const { data } = await res.json();

      return data;
    },
  });

  return query;
}

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export function useGetWorkspace({ workspaceId }: { workspaceId: string }) {
  const query = useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!res.ok) throw new Error("Failed to fetch workspace");

      const { data } = await res.json();

      return data;
    },
  });

  return query;
}

import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

export type ProjectAnalyticsResponse = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
  200
>;

export function useGetProjectAnalytics({ projectId }: { projectId: string }) {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const res = await client.api.projects[":projectId"]["analytics"].$get({
        param: { projectId },
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");

      const { data } = await res.json();

      return data;
    },
  });

  return query;
}

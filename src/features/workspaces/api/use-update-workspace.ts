import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const res = await client.api.workspaces[":workspaceId"].$patch({
        form,
        param,
      });
      if (!res.ok) throw new Error("Failed to create workspace");
      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace Updated");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: () => {
      toast.error("Error while updating worksapce, please try again");
    },
  });

  return mutation;
}

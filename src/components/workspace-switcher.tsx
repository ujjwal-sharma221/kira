"use client";

import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WorkspaceAvatar } from "@/app/(dashboard)/(workspaces)/_components/workspace-avatar";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useWorkspaceModal } from "@/hooks/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { open } = useWorkspaceModal();

  const { data: workspaces } = useGetWorkspaces();

  function onSelect(id: string) {
    router.push(`/workspaces/${id}`);
  }

  return (
    <div className="m-2 ml-4 flex flex-col gap-y-2 pb-2 pt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase">Workspaces</p>
        <CirclePlus
          onClick={open}
          className="mr-2 size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
        />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="p-1 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent className="">
          {workspaces?.documents.map((w) => (
            <SelectItem key={w.$id} value={w.$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar name={w.name} image={w.imageUrl} />
                <span className="truncate">{w.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

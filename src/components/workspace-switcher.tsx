"use client";

import { CirclePlus } from "lucide-react";

import { useGetWorkspaces } from "@/app/(workspaces)/api/use-get-workspaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WorkspaceAvatar } from "@/app/(workspaces)/_components/workspace-avatar";

export const WorkspaceSwitcher = () => {
  const { data: workspaces } = useGetWorkspaces();
  return (
    <div className="m-2 ml-4 flex flex-col gap-y-2 pb-2 pt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase">Workspaces</p>
        <CirclePlus className="mr-2 size-5 cursor-pointer text-neutral-500 transition hover:opacity-75" />
      </div>

      <Select>
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

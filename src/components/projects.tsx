"use client";

import { CirclePlus } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TextShimmer } from "./text-shimmer";
import { useCreateProjectModal } from "@/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/app/(dashboard)/(projects)/_components/project-avatar";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });
  const pathname = usePathname();
  const { open } = useCreateProjectModal();

  return (
    <div className="m-2 ml-4 flex flex-col gap-y-2 pb-2 pt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase">Projects</p>
        <CirclePlus
          onClick={open}
          className="mr-2 size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
        />
      </div>
      {data?.documents.map((p) => {
        const href = `/workspaces/${workspaceId}/projects/${p.$id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={p.$id}>
            <div className="flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-sm text-[#393646] transition hover:opacity-75">
              <ProjectAvatar image={p.imageUrl} name={p.name} />
              {isActive ? (
                <TextShimmer className="font-mono" duration={1}>
                  {p.name}
                </TextShimmer>
              ) : (
                <span className="truncate">{p.name}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

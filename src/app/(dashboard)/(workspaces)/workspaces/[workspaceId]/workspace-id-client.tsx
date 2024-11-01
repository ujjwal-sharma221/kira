"use client";

import { Bolt, Plus } from "lucide-react";
import Link from "next/link";
import { CalendarIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";

import { Analytics } from "@/components/analytics";
import { ErrorPage } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-task";
import { Task } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useCreateProjectModal } from "@/hooks/use-create-project-modal";
import { useCreateTaskModal } from "@/hooks/use-create-task-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { projectValues } from "@/features/projects/project-types";
import { ProjectAvatar } from "@/app/(dashboard)/(projects)/_components/project-avatar";
import { Member } from "@/features/members/types";
import { MemberAvatar } from "@/app/(standalone)/workspaces/[workspaceId]/members/_components/member-avatar";

export function WorkspaceIdClient() {
  const workspaceId = useWorkspaceId();
  const { data: analytics, isLoading: loadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: loadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: loadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: loadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    loadingAnalytics || loadingTasks || loadingProjects || loadingMembers;

  if (isLoading) return <PageLoader />;

  if (!analytics || !projects || !members || !tasks)
    return <ErrorPage message="Workspace data not found" />;

  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={analytics}></Analytics>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} />
      </div>
    </div>
  );
}

interface TaskListProps {
  data: Task[];
  total: number;
}

export function TaskList({ data, total }: TaskListProps) {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-zinc-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total}) </p>
          <Button size="icon" variant="outline" onClick={createTask}>
            <Plus className="size-4" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((t) => (
            <li key={t.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${t.$id}`}>
                <Card className="h rounded-lg border-none shadow-none transition hover:opacity-75">
                  <CardContent className="p-4">
                    <p className="truncate text-lg font-medium">{t.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{t.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300"></div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 size-3" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(t.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant="link" asChild className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All </Link>
        </Button>
      </div>
    </div>
  );
}

interface ProjectListProps {
  data: projectValues[];
  total: number;
}

export function ProjectList({ data, total }: ProjectListProps) {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4 bg-neutral-50">
      <div className="rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total}) </p>
          <Button size="icon" variant="outline" onClick={createProject}>
            <Plus className="size-4" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((p) => (
            <li key={p.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${p.$id}`}>
                <Card className="h -none rounded-lg border-none shadow-none transition hover:opacity-75">
                  <CardContent className="flex items-center gap-x-2.5 p-4">
                    <ProjectAvatar
                      name={p.name}
                      image={p.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="truncate text-lg font-medium">{p.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
}

interface MemberListProps {
  data: Member[];
  total: number;
}

export function MemberList({ data, total }: MemberListProps) {
  const workspaceId = useWorkspaceId();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total}) </p>
          <Button size="icon" variant="outline" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <Bolt className="size-4" />
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((m) => (
            <li key={m.$id}>
              <Card className="overflow-hidden rounded-lg shadow-none">
                <CardContent className="flex flex-col items-center gap-x-2 p-3">
                  <MemberAvatar name={m.name} className="size-12" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="line-clamp-1 text-lg font-medium">{m.name}</p>
                    <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                      {m.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
}

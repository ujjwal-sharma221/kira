"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpAZ } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "../../(projects)/_components/project-avatar";
import { MemberAvatar } from "@/app/(standalone)/workspaces/[workspaceId]/members/_components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className="text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpAZ className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <p className="line-clamp-1">{name}</p>;
    },
  },

  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className="text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpAZ className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.imageUrl}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className="text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpAZ className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className="text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpAZ className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return <TaskDate value={dueDate} />;
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className="text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpAZ className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className="" variant={status}>
          {snakeCaseToTitleCase(status)}
        </Badge>
      );
    },
  },
];

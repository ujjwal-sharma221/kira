import { z } from "zod";

import { TaskStatus } from "@/features/tasks/types";

export const createTaskSchema = z.object({
  name: z.string().min(1, "required").trim(),
  workspaceId: z.string().min(1, "required").trim(),
  projectId: z.string().min(1, "required").trim(),
  assigneeId: z.string().min(1, "required").trim(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  dueDate: z.coerce.date(),
});

export const queryTaskSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
});

export type CreateTaskValues = z.infer<typeof createTaskSchema>;

import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "the name can't be empty").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});

export const inviteCodeSchema = z.object({
  code: z.string(),
});

export type newWorkspaceValues = z.infer<typeof createWorkspaceSchema>;
export type updateWorkspaceValues = z.infer<typeof updateWorkspaceSchema>;

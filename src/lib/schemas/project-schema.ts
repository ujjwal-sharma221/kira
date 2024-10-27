import { z } from "zod";

export const projectQuerySchema = z.object({
  workspaceId: z.string(),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "the name can't be empty").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export type ProjectValues = z.infer<typeof createProjectSchema>;

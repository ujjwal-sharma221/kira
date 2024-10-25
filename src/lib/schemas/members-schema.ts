import { z } from "zod";

import { MemberRole } from "@/features/members/types";

export const querySchema = z.object({
  workspaceId: z.string(),
});

export const memberRoleSchema = z.object({
  role: z.nativeEnum(MemberRole),
});

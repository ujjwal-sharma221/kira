import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/middlewares/session-middleware";
import { memberRoleSchema, querySchema } from "@/lib/schemas/members-schema";
import { createAdminClient } from "@/lib/appwrite";
import { getMember } from "@/lib/utils";
import { DATABASE_ID, MEMBERS_ID } from "@/lib/config";
import { Member, MemberRole } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, zValidator("query", querySchema), async (c) => {
    const { users } = await createAdminClient();
    const { workspaceId } = c.req.valid("query");
    const databases = c.get("databases");
    const user = c.get("user");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const members = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", workspaceId)],
    );

    const populatedMembers = await Promise.all(
      members.documents.map(async (m) => {
        const user = await users.get(m.userId);
        return { ...m, name: user.name, email: user.email };
      }),
    );

    return c.json({ data: { ...members, documents: populatedMembers } });
  })
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId,
    );

    const allMembers = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", memberToDelete.workspaceId),
    ]);

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (allMembers.total === 1) {
      return c.json(
        { error: "Cannot delete the only member, delete the workspace itself" },
        400,
      );
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberId } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", memberRoleSchema),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId,
      );

      const allMembers = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)],
      );

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allMembers.total === 1) {
        return c.json(
          {
            error:
              "Cannot downgrade the only member, delete the workspace itself",
          },
          400,
        );
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    },
  );

export default app;

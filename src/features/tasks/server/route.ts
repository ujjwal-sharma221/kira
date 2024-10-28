import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/middlewares/session-middleware";
import { createTaskSchema, queryTaskSchema } from "@/lib/schemas/task-shema";
import { getMember } from "@/lib/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/lib/config";
import { createAdminClient } from "@/lib/appwrite";
import { projectValues } from "@/features/projects/project-types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", queryTaskSchema),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId, assigneeId, dueDate, projectId, search, status } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log(`Project Id: ${projectId}`);
        query.push(Query.equal("projectId", projectId));
      }

      if (status) {
        console.log(`status: ${status}`);
        query.push(Query.equal("status", status));
      }

      if (assigneeId) {
        console.log(`assigneeId: ${assigneeId}`);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        console.log(`DueDate: ${dueDate}`);
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        console.log(`search: ${search}`);
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query);

      const projectIds = tasks.documents.map((t) => t.projectId);
      const assigneeIds = tasks.documents.map((t) => t.assigneeId);

      const projects = await databases.listDocuments<projectValues>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
      );

      const assignees = await Promise.all(
        members.documents.map(async (m) => {
          const user = await users.get(m.userId);
          return { ...m, name: user.name, email: user.email };
        }),
      );

      const populatedTasks = tasks.documents.map((t) => {
        const project = projects.documents.find((p) => p.$id === t.projectId);
        const assignee = assignees.find((a) => a.$id === t.assigneeId);

        return { ...t, project, assignee };
      });

      return c.json({ ...tasks, documents: populatedTasks });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const {
        assigneeId,
        name,
        dueDate,
        projectId,
        status,
        workspaceId,
        description,
      } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ],
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          assigneeId,
          name,
          dueDate,
          projectId,
          status,
          workspaceId,
          description,
          position: newPosition,
        },
      );

      return c.json({ data: task });
    },
  );

export default app;

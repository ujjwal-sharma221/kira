import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/middlewares/session-middleware";
import {
  createTaskSchema,
  postBulkSchema,
  queryTaskSchema,
} from "@/lib/schemas/task-shema";
import { getMember } from "@/lib/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/lib/config";
import { createAdminClient } from "@/lib/appwrite";
import { projectValues } from "@/features/projects/project-types";
import { Task } from "../types";

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

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query,
      );

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

      return c.json({ data: { ...tasks, documents: populatedTasks } });
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
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );

    const member = getMember({
      databases,
      userId: user.$id,
      workspaceId: task.workspaceId,
    });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: { $id: task.$id } });
  })
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();
      const { assigneeId, name, dueDate, projectId, status, description } =
        c.req.valid("json");

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          assigneeId,
          name,
          dueDate,
          projectId,
          status,
          description,
        },
      );

      return c.json({ data: task });
    },
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const { taskId } = c.req.param();
    const currentUser = c.get("user");
    const { users } = await createAdminClient();
    const databases = c.get("databases");

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );
    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });
    if (!currentMember) return c.json({ error: "Unauthorized" }, 401);

    const project = await databases.getDocument<projectValues>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId,
    );

    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId,
    );

    const user = await users.get(member.userId);

    const assignee = { ...member, name: user.name, email: user.email };

    return c.json({ data: { ...task, project, assignee } });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator("json", postBulkSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { tasks } = c.req.valid("json");

      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map((t) => t.$id),
          ),
        ],
      );

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((t) => t.workspaceId),
      );
      if (workspaceIds.size !== 1)
        return c.json({ error: "All tasks belong to the same workspace" });

      const workspaceId = workspaceIds.values().next().value as string;

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const updatedTasks = await Promise.all(
        tasks.map(async (t) => {
          const { $id, status, position } = t;
          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
            status,
            position,
          });
        }),
      );

      return c.json({ data: updatedTasks });
    },
  );

export default app;
